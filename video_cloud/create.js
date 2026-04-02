import express from "express";
import Videocloud from "../models/videocloud.js";
import { verify } from "../routes/verifyToken.js";
import createError from "http-errors";
import App from "../models/app.js";
import mongoose from "mongoose";
// Create Video CLoud Account

const router = express.Router();
router.post("/:AppId/createVideoCloud", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists
    const videoExist = await Videocloud.countDocuments({
      application: req.params.AppId,
    });
    if (videoExist > 0)
      throw createError(
        400,
        "Video Cloud Account already Exist for this application"
      );

    //Hashing the password
    //create New User
    const videoAccount = new Videocloud({
      cloudName: req.body.cloudName,
      liveCloudName: req.body.liveCloudName || null,
      cloudKey: req.body.cloudKey,
      cloudSecret: req.body.cloudSecret,
      cloudKeyV2: req.body.cloudKeyV2 || null,
      cloudSecretV2: req.body.cloudSecretV2 || null,
      mainAccountId: req.body.mainAccountId,
      secondAccountId: req.body.secondAccountId || null,
      firstPlayer: req.body.firstPlayer,
      secondPlayer: req.body.secondPlayer || null,
      premiumPlayer: req.body.premiumPlayer || null,
      licenseKey: req.body.licenseKey || null,
      iosLicenseKey: req.body.iosLicenseKey || null,
      premLicenseKey: req.body.premLicenseKey || null,
      iosPremLicenseKey: req.body.iosPremLicenseKey || null,
      secLicenseKey: req.body.secLicenseKey || null,
      iosSecLicenseKey: req.body.iosSecLicenseKey || null,
      drmKey: req.body.drmKey || null,
      drmMobileKey: req.body.drmMobileKey || null,
      drmTVKey: req.body.drmTVKey || null,
      searchPlaylist: req.body.searchPlaylist || null,
      recommendedPlaylist: req.body.recommendedPlaylist || null,
      watchPlaylist: req.body.watchPlaylist || null,
      application: AppId._id,
    });

    const savedVideo = await videoAccount.save();
    res.send(savedVideo);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.put("/:AppId/editVideoCloud", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists
    const video = await Videocloud.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
          cloudName: req.body.cloudName,
          liveCloudName: req.body.liveCloudName || null,
          cloudKey: req.body.cloudKey,
          cloudSecret: req.body.cloudSecret,
          cloudKeyV2: req.body.cloudKeyV2 || null,
          cloudSecretV2: req.body.cloudSecretV2 || null,
          mainAccountId: req.body.mainAccountId,
          secondAccountId: req.body.secondAccountId || null,
          firstPlayer: req.body.firstPlayer,
          secondPlayer: req.body.secondPlayer || null,
          premiumPlayer: req.body.premiumPlayer || null,
          licenseKey: req.body.licenseKey || null,
          iosLicenseKey: req.body.iosLicenseKey || null,
          premLicenseKey: req.body.premLicenseKey || null,
          iosPremLicenseKey: req.body.iosPremLicenseKey || null,
          secLicenseKey: req.body.secLicenseKey || null,
          iosSecLicenseKey: req.body.iosSecLicenseKey || null,
          drmKey: req.body.drmKey || null,
          drmMobileKey: req.body.drmMobileKey || null,
          searchPlaylist: req.body.searchPlaylist || null,
          recommendedPlaylist: req.body.recommendedPlaylist || null,
          watchPlaylist: req.body.watchPlaylist || null,
          drmTVKey: req.body.drmTVKey || null,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "Video Cloud Account does not Exist for this application"
          );
        } else {
          return Appex;
        }
      }
    );
    res.send(video);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getVideoCloud", verify, async (req, res, next) => {
  try {
    const appl = await Videocloud.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Video Cloud Account Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getfulldetails", async (req, res, next) => {
  Videocloud.findOne({ application: req.params.AppId })
    .populate("application") // key to populate
    .then((user) => {
      res.json(user);
    });
});

export default router;
