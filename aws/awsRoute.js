import express from "express";
import { generateUploadURL } from "./s3.js";
import Image from "../models/images.js";
import File from "../models/files.js";
import createError from "http-errors";
import { verify } from "../routes/verifyToken.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/uploadImage/:key", async (req, res) => {
  try {
    const ext = req.params.key;
    const url = await generateUploadURL(ext);
    res.send({ url });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/:application/saveImage", async (req, res) => {
  const master = new Image({
    imageName: req.body.imageName,
    application: req.params.application,
    imagekey: req.body.imagekey,
    createdBy: "Preview Admin",
  });

  try {
    const savedUser = await master.save();
    res.send(savedUser);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/:application/saveFile", async (req, res) => {
  const master = new File({
    fileName: req.body.fileName,
    application: req.params.application,
    filekey: req.body.filekey,
    createdBy: "Preview Admin",
  });

  try {
    const savedUser = await master.save();
    res.send(savedUser);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/:application/fileAll", async (req, res) => {
  var limit = parseInt(req.query.limit) || 10;
  var skip = parseInt(req.query.skip) || 0;
  var application = req.params.application;
  try {
    const imageCount = await File.countDocuments({
      application: req.params.application,
    });
    const appl = await File.find({ application: { $eq: application } })
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip);

    if (!appl) throw createError(400, "Invalid Application ID");
    const result = {
      limit: limit,
      skip: skip,
      images: appl,
      count: imageCount,
    };

    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:application/imageAll", async (req, res) => {
  var limit = parseInt(req.query.limit) || 10;
  var skip = parseInt(req.query.skip) || 0;
  var application = req.params.application;
  try {
    const imageCount = await Image.countDocuments({
      application: req.params.application,
    });
    const appl = await Image.find({ application: { $eq: application } })
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip);

    if (!appl) throw createError(400, "Invalid Application ID");
    const result = {
      limit: limit,
      skip: skip,
      images: appl,
      count: imageCount,
    };

    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:application/searchImages",verify,async (req, res,next) => {
  var limit = parseInt(req.query.limit) || 10;
  var skip = parseInt(req.query.skip) || 0;
  var query = req.query.query;
  var application = req.params.application;
  try {
    const imageCount = await Image.countDocuments({
      application: application,
    });
    Image.aggregate(
      [
        {
          $search: {
            index: "imageRef",
            autocomplete: {
              query: query,
              path: "imageName",
            },
          },
        },

        {
          $match: {
            application: mongoose.Types.ObjectId(req.params.application),
          },
        },

        {
          $limit: limit,
        },
        {
          $skip: skip,
        },
      ],
      function (error, data) {
        console.log(error);
        if (error) {
          throw createError(404, "No App Exists for this id");
        }
        //client.setex(req.path, process.env.REDIS_TIME, JSON.stringify(data));
        const result = {
          limit: limit,
          skip: skip,
          images: data,
          count: imageCount,
        };
         return res.json(result);
        //handle error case also
      }
    );

  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:imageKey/fileKey", async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 0;
  var skip = parseInt(req.query.skip) || 0;
  var key = req.params.imageKey;

  try {
    const appl = await File.findOne({ filekey: { $eq: key } }).sort({
      date: "descending",
    });
    if (!appl) throw createError(400, "Invalid Image Key");
    const result = {
      limit: limit,
      skip: skip,
      images: appl,
    };

    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:imageKey/imageKey", async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 0;
  var skip = parseInt(req.query.skip) || 0;
  var key = req.params.imageKey;

  try {
    const appl = await Image.findOne({ imagekey: { $eq: key } }).sort({
      date: "descending",
    });
    if (!appl) throw createError(400, "Invalid Image Key");
    const result = {
      limit: limit,
      skip: skip,
      images: appl,
    };

    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:imageKey/getImage", async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 0;
  var skip = parseInt(req.query.skip) || 0;
  var key = req.params.imageKey;

  try {
    const appl = await Image.findOne({ _id: { $eq: key } }).sort({
      date: "descending",
    });
    if (!appl) throw createError(400, "Invalid ID");
    const result = {
      limit: limit,
      skip: skip,
      images: appl,
    };
    res.setHeader("cache-control", "max-age=1200, max-stale=180");
    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:imageKey/getFile", async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 0;
  var skip = parseInt(req.query.skip) || 0;
  var key = req.params.imageKey;

  try {
    const appl = await File.findOne({ _id: { $eq: key } }).sort({
      date: "descending",
    });
    if (!appl) throw createError(400, "Invalid ID");
    const result = {
      limit: limit,
      skip: skip,
      images: appl,
    };
    res.setHeader("cache-control", "max-age=1200, max-stale=180");
    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.delete("/:Id/deleteImage", verify, async (req, res, next) => {
  try {
    const SystemId = await Image.findByIdAndDelete(
      req.params.Id,
      function (error, Appex) {
        if (error) {
          throw createError(400, "Invalid ID");
        } else {
          return Appex;
        }
      }
    );
    res.send(SystemId);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.delete("/:Id/deleteFile", verify, async (req, res, next) => {
  try {
    const SystemId = await File.findByIdAndDelete(
      req.params.Id,
      function (error, Appex) {
        if (error) {
          throw createError(400, "Invalid ID");
        } else {
          return Appex;
        }
      }
    );
    res.send(SystemId);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

export default router;
