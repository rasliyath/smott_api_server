import express from "express";
import Master from "../models/master.js";
import {
  masterValidation,
  loginValidation,
  registerValidation,
  passwordValidation,
} from "../validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { masterVerify } from "../routes/verifyToken.js";
import App from "../models/app.js";
import User from "../models/user.js";
import createError from "http-errors";
import logger from '../logger/index.js';

const router = express.Router();
// Master Creation ...
router.post("/createUser", async (req, res) => {
  //validation
  const { error } = masterValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if user exists
  const masterExist = await Master.findOne({ email: req.body.email });
  if (masterExist) return res.status(400).send("Email Already Exists");

  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create New Master User
  const master = new Master({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    admin: req.body.admin,
    analytics: req.body.analytics,
    reader: req.body.reader,
    rgbId: req.body.rgbId,
  });

  console.log('master');
  console.log(master);

  try {
    const savedUser = await master.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
    res.header("Authorization", token).send(token);
    //res.send(token);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Master Deletion ...
router.delete("/:userId/deleteUser", async (req, res) => {
  const MasterId = await Master.findByIdAndDelete(
    req.params.userId,
    function (error, Appex) {
      if (error) {
        return res.status(400).send("Invalid ID for Deletion");
      } else {
        return res.status(200).send("Deleted Successfully");
      }
    }
  );
  res.send(MasterId);
});

// Edit Master Details
router.put("/:userId/editUser", masterVerify, async (req, res) => {
  //Master Id Checking
  const MasterId = await Master.findByIdAndUpdate(
    req.params.userId,
    {
      name: req.body.name,
      admin: req.body.admin,
      analytics: req.body.analytics,
      reader: req.body.reader,
      rgbId: req.body.rgbId,
    },
    function (error, Appex) {
      if (error) {
        return res.status(400).send("Invalid ID - Unable to edit");
      } else {
        return Appex;
      }
    }
  );
  res.send("Updated Master Successfully");
});

// Edit Master Password
router.put("/:userId/changePassword", masterVerify, async (req, res) => {
  //validation
  const { error } = passwordValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Master Id Checking
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //checking if User exists

  const master = await Master.findOne({ _id: req.params.userId });
  if (!master) return res.status(400).send("Invalid User ID");

  //checking if Current Password Matches

  const validPass = await bcrypt.compare(
    req.body.currentPassword,
    master.password
  );
  if (!validPass) return res.status(400).send("Invalid Current Password");

  const MasterId = await Master.findByIdAndUpdate(
    req.params.userId,
    {
      password: hashPassword,
    },
    function (error, Appex) {
      if (error) {
        return res.status(400).send(error);
      } else {
        return Appex;
      }
    }
  );
  res.send("Successfully Changed Password");
});

// Master Login ...
router.post("/masterlogin", async (req, res, next) => {
  try {
    //validation
    const { error } = loginValidation(req.body);
    if (error) throw createError(400, error.details[0].message);

    //checking if email exists
    const master = await Master.findOne({ email: req.body.email });
    if (!master) throw createError(400, "Invalid Login Credentials");

    const validPass = await bcrypt.compare(req.body.password, master.password);
    if (!validPass) throw createError(400, "Invalid User Credentials");

    //JWT Token Creation
    const token = jwt.sign({ _id: master._id }, process.env.TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    res.header("Authorization", token).send(token);
  } catch (error) {
    //res.status.send(dbErrorHandling(error.message,error.status));

    next(createError(error.status, error.message));
  }
});

// Super Admin register Against Application
router.post(
  "/:AppId/createSuperAdmin",
  masterVerify,
  async (req, res, next) => {
    try {
      //Application Id Checking
      const AppId = await App.findOne({ _id: req.params.AppId });
      if (!AppId) throw createError(400, "Invalid Application Id");

      //validation
      const { error } = registerValidation(req.body);
      if (error) throw createError(400, error.details[0].message);

      //checking if user exists
      const emailExist = await User.findOne({ email: req.body.email });
      if (emailExist) throw createError(400, "Email Id already Exist");

      logger.info(JSON.stringify(req.body));
      //checking if super admin exists
       if (req.body.superAdmin == true) {
        const superAdminExist = await User.countDocuments({
          application: AppId._id,
          superAdmin: true,
        });
        if (superAdminExist > 0)
          throw createError(400, "Super Admin already Exist");
      }
 
      //Hashing the password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      //create New User
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        superAdmin: req.body.superAdmin,
        admin: req.body.admin,
        reader: req.body.reader,
        editor: req.body.editor,
        application: AppId._id,
      });

      const savedUser = await user.save();
      res.send(savedUser);
    } catch (error) {
      next(createError(error.status, error.message));
    }
  }
);

// User register Against Application
router.post("/:AppId/register", masterVerify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //validation
    const { error } = registerValidation(req.body);
    if (error) throw createError(400, error.details[0].message);

    //checking if user exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) throw createError(400, "Email Id already Exist");

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    //create New User
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      superAdmin: false,
      admin: req.body.admin,
      reader: req.body.reader,
      editor: req.body.editor,
      application: AppId._id,
    });

    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

//get Clean Master ID

router.get("/cleanMaster", masterVerify, async (req, res, next) => {
  try {
    const master = await Master.findOne(
      { _id: req.master._id },
      function (error, Appex) {
        if (error) {
          throw createError(400, "Unknown Token ID");
        } else {
          return Appex;
        }
      }
    );

    const master_raw = new Master({
      name: master.name,
      email: master.email,
      admin: master.admin,
      analytics: master.analytics,
      reader: master.reader,
      rgbId: master.rgbId,
    });

    res.send(master_raw);
  } catch (error) {
    next(createError(error.status, error.message));
  }

  // get user by id
});

// GET APPLICATION DATA

router.get("/getAllApps", masterVerify, async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 10;
  var skip = parseInt(req.query.skip) || 0;
  var expiry = req.query.expiry || false;

  try {
    const appl = await App.find({ expireStatus: { $eq: expiry } })
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip);
    if (!appl) throw createError(400, "Invalid ID");
    const result = {
      limit: limit,
      skip: skip,
      application: appl,
    };

    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }

  // get user by id
});

router.get("/:AppId/getAppUsers", masterVerify, async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 20;
  var skip = parseInt(req.query.skip) || 0;
  var expiry = req.query.expiry || false;

  try {
    const appl = await User.find({ application: { $eq: req.params.AppId } })
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip);
    if (!appl) throw createError(400, "Invalid ID");
    const result = {
      limit: limit,
      skip: skip,
      user: appl,
    };

    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

export default router;
