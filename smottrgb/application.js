import express from "express";
import App from "../models/app.js";
import { masterVerify } from "../routes/verifyToken.js";
import Sys from "../models/system.js";
import Feature from "../models/features.js";
import Permission from "../models/permission.js";
import createError from "http-errors";
const router = express.Router();

router.post("/createApplication", async (req, res) => {
  const date = new Date();
  date.setDate(date.getDate() + req.body.licensedays);

  const app = new App({
    appName: req.body.appName,
    appType: req.body.appType,
    menuType: req.body.menuType ? req.body.menuType : "Default",
    owner_type: req.body.owner_type,
    web: req.body.web,
    android: req.body.android,
    iOS: req.body.iOS,
    androidTv: req.body.androidTv,
    appleTv: req.body.appleTv,
    fireTv: req.body.fireTv,
    roku: req.body.roku,
    samsungTizen: req.body.samsungTizen,
    lgWebOs: req.body.lgWebOs,
    chromecast: req.body.chromecast,
    licensetype: req.body.licensetype,
    languages: req.body.languages || null,
    licensedays: req.body.licensedays,
    expireStatus: req.body.expireStatus,
    expiresOn: date,
  });
  try {
    const application = await app.save();
    res.send(application._id);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Edit Application Details
router.put("/:appId/editApplication", masterVerify, async (req, res) => {
  //Master Id Checking
  const AppId = await App.findByIdAndUpdate(
    req.params.appId,
    {
      appName: req.body.appName,
      appType: req.body.appType,
      menuType: req.body.menuType ? req.body.menuType : "Default",
      owner_type: req.body.owner_type,
      web: req.body.web,
      android: req.body.android,
      iOS: req.body.iOS,
      androidTv: req.body.androidTv,
      appleTv: req.body.appleTv,
      fireTv: req.body.fireTv,
      roku: req.body.roku,
      samsungTizen: req.body.samsungTizen,
      lgWebOs: req.body.lgWebOs,
      languages: req.body.languages || null,
    },
    function (error, Appex) {
      if (error) {
        return res.status(400).send("Invalid ID - Unable to edit");
      } else {
        return Appex;
      }
    }
  );
  res.send("Updated Application Successfully");
});

// delete an application
router.delete("/:appId/deleteApplicationm", masterVerify, async (req, res) => {
  const AppId = await App.findByIdAndDelete(
    req.params.appId,
    function (error, Appex) {
      if (error) {
        return res.status(400).send("Invalid App Id for Deletion");
      } else {
        return res.status(200).send("Application deleted successfully");
      }
    }
  );
  res.send(AppId);
});

// Edit Application expireStatus
router.put("/:appId/expireApp", masterVerify, async (req, res) => {
  const date = new Date();
  //APP Id Checking
  const AppId = await App.findByIdAndUpdate(
    req.params.appId,
    {
      licensetype: req.body.licensetype,
      licensedays: req.body.licensedays,
      expireStatus: req.body.expireStatus,
      expiresOn: date.setDate(date.getDate() + req.body.licensedays),
    },
    function (error, Appex) {
      if (error) {
        return res.status(400).send("Invalid ID - Unable to edit");
      } else {
        return Appex;
      }
    }
  );
  res.send("Updated Application Successfully");
});

// Create System
router.post("/createSystem", masterVerify, async (req, res) => {
  const date = new Date();
  const system = new Sys({
    systemName: req.body.systemName,
    createdBy: req.master._id,
    date: date,
  });
  try {
    const systems = await system.save();
    res.send(systems._id);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Delete SYSTEM

router.delete("/:sysId/deleteFeature", masterVerify, async (req, res) => {
  const SystemId = await Sys.findByIdAndDelete(
    req.params.sysId,
    function (error, Appex) {
      if (error) {
        return res.status(400).send("Invalid ID for Deletion");
      } else {
        return res.status(200).send("Deleted Successfully");
      }
    }
  );
  res.send(SystemId);
});

// Create Feature
router.post("/:sysId/createFeature", masterVerify, async (req, res) => {
  const systemId = await Sys.findOne(
    { _id: req.params.sysId },
    function (error, Appex) {
      if (error) {
        return res.status(400).send("System Id wrong or Missing");
      } else {
        return Appex;
      }
    }
  );
  const date = new Date();
  const feature = new Feature({
    featureName: req.body.featureName,
    system: systemId._id,
    createdBy: req.master._id,
    date: date,
    path: req.body.path,
  });
  try {
    const features = await feature.save();
    res.send(features._id);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Delete Feature

router.delete("/:featureId/deleteFeature", masterVerify, async (req, res) => {
  const FeatureId = await Feature.findByIdAndDelete(
    req.params.featureId,
    function (error, Appex) {
      if (error) {
        return res.status(400).send("Invalid ID for Deletion");
      } else {
        return res.status(200).send("Deleted Successfully");
      }
    }
  );
  res.send(FeatureId);
});

//Application ADD Permission

router.post("/:applicationId/featurePermission", async (req, res) => {
  const AppId = await App.findOne(
    { _id: req.params.applicationId },
    function (error, Appex) {
      if (error) {
        return res.status(400).send("Application Id wrong or Missing");
      } else {
        return Appex;
      }
    }
  );
  const permissionStatus = await Permission.findOne({
    applicationId: req.params.applicationId,
  });
  if (permissionStatus)
    return res
      .status(400)
      .send("Permission against this Application Id already exists");

  // Save Permission
  const permissions = new Permission({
    applicationId: AppId._id,
    permission_details: req.body.permission_details,
  });
  try {
    const permissionResult = await permissions.save();
    res.send(permissionResult._id);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Edit Application ADD Permission
router.put(
  "/:applicationId/:permissionId/updatePermission",
  async (req, res) => {
    const AppId = await App.findOne(
      { _id: req.params.applicationId },
      function (error, Appex) {
        if (error) {
          return res.status(400).send("Application Id wrong or Missing");
        } else {
          return Appex;
        }
      }
    );
    const permissionResult = await Permission.findByIdAndUpdate(
      req.params.permissionId,
      {
        permission_details: req.body.permission_details,
      },
      function (error, Appex) {
        if (error) {
          return res.status(400).send("Invalid ID - Unable to edit");
        } else {
          return Appex;
        }
      }
    );
    res.send("Updated Permission for Application Successfully");
  }
);

//Delete Application and Permission

router.delete("/:permissionId/deletePermission", async (req, res) => {
  const permission_Id = await Permission.findByIdAndDelete(
    req.params.permissionId,
    function (error, Appex) {
      if (error) {
        return res.status(400).send("Invalid ID for Deletion");
      } else {
        return res.status(200).send("Deleted Successfully");
      }
    }
  );
  res.send(permission_Id);
});

// GET ONE APPLICATION DATA

router.get("/:AppId/getApp", masterVerify, async (req, res, next) => {
  try {
    const appl = await App.findOne({ _id: req.params.AppId });
    if (!appl) throw createError(400, "Invalid ID");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }

  // get user by id
});

export default router;
