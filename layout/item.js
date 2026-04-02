import express from "express";
import { verify } from "../routes/verifyToken.js";
import createError from "http-errors";
import App from "../models/app.js";
import Page from "../models/pages.js";
import Element from "../models/elements.js";
import Color from "../models/colorTypes.js";
import Branding from "../models/brandingTypes.js";
import Menu from "../models/menu.js";
import mongoose from "mongoose";
import Ticker from "../models/ticker.js";
import TickerPage from "../models/tickerRefer.js";
import Setting from "../models/settings.js";
import Analytics from "../models/analytics.js";
import WebSetting from "../models/webSettings.js";
import AppSetting from "../models/appSetting.js";
import Monetize from "../models/monetize.js";
import VastSchedule from "../models/VastSchedule.js";
import VmapData from "../models/VmapData.js";
import Footer from "../models/footer.js";
import Font from "../models/fontTypes.js";
import Log from "../models/logs.js";
import Subscription from "../models/subscribe.js";
import Language from "../models/languages.js";
import User from "../models/user.js";
import { passwordValidation } from "../validation.js";
const router = express.Router();
import logger from "../logger/index.js";
import Notification from "../models/notifications.js";

router.post("/:AppId/createPage", verify, async (req, res, next) => {
  const date = new Date();
  date.setDate(date.getDate());

  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });

    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists

    const device = [
      {
        itemName: "web",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "android",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "iOS",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "appletv",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "androidtv",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "firetv",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "roku",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "tizen",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "webos",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "chromecast",
        itemSize: "20",
        itemVisibility: true,
      },
    ];

    //Hashing the password
    //create New User
    const page = new Page({
      pageType: req.body.pageType,
      referenceName: req.body.referenceName || null,
      displayName: req.body.displayName || null,
      urlName: req.body.urlName || null,
      portraitThumbnail: req.body.portraitThumbnail || null,
      landscapeThumbnail: req.body.landscapeThumbnail || null,
      bannerImage: req.body.bannerImage || null,
      genre: req.body.genre || null,
      starring: req.body.starring || null,
      rating: req.body.rating || null,
      ageRating: req.body.ageRating || null,
      description: req.body.description || null,
      author: req.body.author || null,
      publishDate: req.body.publishDate || null,
      publishedDate: req.body.publishedDate || null,
      mainHeader: req.body.mainHeader || null,
      externalPage: req.body.externalPage || null,
      livePage: req.body.livePage || null,
      internalPage: req.body.internalPage || null,
      blockQuote: req.body.blockQuote || null,
      sectionHeader1: req.body.sectionHeader1 || null,
      sectionHeader2: req.body.sectionHeader2 || null,
      introduction: req.body.introduction || null,
      sectionDescription1: req.body.sectionDescription1 || null,
      sectionDescription2: req.body.sectionDescription2 || null,
      contentType: req.body.contentType || null,
      premiumType: req.body.premiumType || null,
      videoId: req.body.videoId || null,
      audio: req.body.audio || null,
      tag: req.body.tag || null,
      firstTag: req.body.firstTag || null,
      secondTag: req.body.secondTag || null,
      director: req.body.director || null,
      writer: req.body.writer || null,
      recommendation: req.body.recommendation || null,
      cite: req.body.cite || null,
      studio: req.body.studio || null,
      producer: req.body.producer || null,
      application: AppId._id,
      devices: device,
      items: req.body.items || null,
      languages: req.body.languages || null,
      draftStatus: req.body.draftStatus || true,
      publishStatus: req.body.publishStatus || false,
      republishStatus: false,
      RFP: req.body.RFP || false,
      createdBy: req.body.createdBy,
      editedBy: req.body.editedBy,
      editedDate: date,
    });

    const savedPage = await page.save();
    const logResult = {
      "Reference Name": savedPage.referenceName,
      type: "page",
      _id: savedPage._id,
      edit_user_id: savedPage.editedBy,
      create_user_id: savedPage.createdBy,
    };
    const loged = new Log({
      itemtype: "page",
      itemid: savedPage._id,
      actionBy: savedPage.createdBy,
      message: "Created Page of Type " + savedPage.pageType,
      msgtype: "Info",
      application: AppId._id,
    });
    const logResponse = await loged.save();
    logger.info(JSON.stringify(logResult));
    res.send(savedPage);
  } catch (error) {
    console.log(req.user);
    const loged = new Log({
      itemtype: "page",
      itemid: "",
      actionBy: req.user._id,
      message: error.status + " - " + error.message,
      msgtype: "Error",
      application: req.user.application,
    });
    const logResponse = await loged.save();
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createLog", verify, async (req, res, next) => {
  const AppId = await App.findOne({ _id: req.params.AppId });

  if (!AppId) throw createError(400, "Invalid Application Id");
  let channel = "";
  if (req.body.channelName === "alrayyan") {
    channel = "AlRayyan TV";
  } else if (req.body.channelName === "alrayyan_audio") {
    channel = "AlRayyan FM";
  } else if (req.body.channelName === "oldrayyan_audio") {
    channel = "Oldrayyan TV";
  } else if (req.body.channelName === "oldrayyan") {
    channel = "Sawt Al Islam";
  }

  try {
    //Application Id Checking
    const loged = new Log({
      itemtype: "Switching",
      itemid: req.body.stream,
      actionBy: req.user._id,
      message: req.body.message + channel + " to " + req.body.stream,
      msgtype: "Info",
      application: AppId._id,
    });
    const logResponse = await loged.save();
    res.send(logResponse);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createTracking", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists

    //Hashing the password
    //create New User
    const page = new Analytics({
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
      application: AppId._id,
    });

    const savedPage = await page.save();
    const logResult = { application: AppId._id, message: "Analytics is added" };
    logger.info(JSON.stringify(logResult));
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.put("/:AppId/editTracking", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists

    //Hashing the password
    //create New User
    const savedPage = await Analytics.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
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
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "Analytics Schema does not Exist for this application"
          );
        } else {
          return Appex;
        }
      }
    );
    const logResult = {
      application: AppId._id,
      message: "Analytics is edited",
    };
    logger.info(JSON.stringify(logResult));
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createElement", verify, async (req, res, next) => {
  const device = [
    {
      itemName: "web",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "android",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "iOS",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "appletv",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "androidtv",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "firetv",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "roku",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "tizen",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "webos",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "chromecast",
      itemSize: "20",
      itemVisibility: true,
    },
  ];
  const date = new Date();
  date.setDate(date.getDate());
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists

    //Hashing the password
    //create New User
    const page = new Element({
      elementType: req.body.elementType,
      referenceName: req.body.referenceName || null,
      urlName: req.body.urlName || null,
      urlPage: req.body.urlPage || null,
      portraitThumbnail: req.body.portraitThumbnail || null,
      landscapeThumbnail: req.body.landscapeThumbnail || null,
      bannerImage: req.body.bannerImage || null,
      displayName: req.body.displayName || null,
      displayNameVisibility: req.body.displayNameVisibility || true,
      viewAllText: req.body.viewAllText || null,
      viewAllVisibility: req.body.viewAllVisibility || true,
      viewAllPage: req.body.viewAllPage || null,
      playlistId: req.body.playlistId || "mjOebLVA",
      tabType: req.body.tabType || "Left",
      tab1Name: req.body.tab1Name || null,
      tab2Name: req.body.tab2Name || null,
      tab3Name: req.body.tab3Name || null,
      tab1Container: req.body.tab1Container || null,
      tab2Container: req.body.tab2Container || null,
      tab3Container: req.body.tab3Container || null,
      RFP: req.body.RFP || false,
      application: AppId._id,
      devices: device,
      items: req.body.items || null,
      channels: req.body.channels || null,
      epg: req.body.epg || null,
      languages: req.body.languages || null,
      draftStatus: req.body.draftStatus || true,
      publishStatus: req.body.publishStatus || false,
      republishStatus: false,
      autoPlay: req.body.autoPlay || false,
      autoPlayTimer: req.body.autoPlayTimer || "5",
      publishedDate: req.body.publishedDate || null,
      createdBy: req.body.createdBy,
      editedBy: req.body.editedBy,
      editedDate: date,
    });

    const savedPage = await page.save();
    const logResult = {
      "Reference Name": savedPage.referenceName,
      type: "element",
      _id: savedPage._id,
      edit_user_id: savedPage.editedBy,
      create_user_id: savedPage.createdBy,
    };

    const loged = new Log({
      itemtype: "element",
      itemid: savedPage._id,
      actionBy: savedPage.createdBy,
      message: "Created Element of Type " + savedPage.elementType,
      msgtype: "Info",
      application: AppId._id,
    });
    const logResponse = await loged.save();
    logger.info(JSON.stringify(logResult));
    res.send(savedPage);
  } catch (error) {
    const loged = new Log({
      itemtype: "element",
      itemid: "",
      actionBy: req.user._id,
      message: error.status + " - " + error.message,
      msgtype: "Error",
      application: req.user.application,
    });
    const logResponse = await loged.save();
    next(createError(error.status, error.message));
  }
});

router.post(
  "/:AppId/:pageId/createElementInPage",
  verify,
  async (req, res, next) => {
    const device = [
      {
        itemName: "web",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "android",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "iOS",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "appletv",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "androidtv",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "firetv",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "roku",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "tizen",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "webos",
        itemSize: "20",
        itemVisibility: true,
      },
      {
        itemName: "chromecast",
        itemSize: "20",
        itemVisibility: true,
      },
    ];
    const date = new Date();
    date.setDate(date.getDate());
    try {
      //Application Id Checking
      const AppId = await App.findOne({ _id: req.params.AppId });
      if (!AppId) throw createError(400, "Invalid Application Id");

      const url = await Page.findOne({ _id: req.params.pageId });
      if (!url) throw createError(400, "Invalid Page Id");

      //checking if Video Cloud account exists

      //Hashing the password
      //create New User
      const elem = new Element({
        elementType: req.body.elementType,
        referenceName: req.body.referenceName || null,
        urlName: req.body.urlName || null,
        portraitThumbnail: req.body.portraitThumbnail || null,
        landscapeThumbnail: req.body.landscapeThumbnail || null,
        bannerImage: req.body.bannerImage || null,
        displayName: req.body.displayName || null,
        displayNameVisibility: req.body.displayNameVisibility || true,
        viewAllText: req.body.viewAllText || null,
        viewAllVisibility: req.body.viewAllVisibility || true,
        viewAllPage: req.body.viewAllPage || null,
        playlistId: req.body.playlistId || "mjOebLVA",
        tabType: req.body.tabType || "Left",
        tab1Name: req.body.tab1Name || null,
        tab2Name: req.body.tab2Name || null,
        tab3Name: req.body.tab3Name || null,
        tab1Container: req.body.tab1Container || null,
        tab2Container: req.body.tab2Container || null,
        tab3Container: req.body.tab3Container || null,
        application: AppId._id,
        devices: device,
        items: req.body.items || null,
        languages: req.body.languages || null,
        draftStatus: req.body.draftStatus || true,
        publishStatus: req.body.publishStatus || false,
        republishStatus: false,
        autoPlay: req.body.autoPlay || false,
        autoPlayTimer: req.body.autoPlayTimer || "5",
        publishedDate: req.body.publishedDate || null,
        RFP: req.body.RFP || false,
        createdBy: req.body.createdBy,
        editedBy: req.body.editedBy,
        editedDate: date,
      });

      const savedPage = await elem.save();
      const logResult = {
        "Reference Name": savedPage.referenceName,
        type: "element",
        _id: savedPage._id,
        edit_user_id: savedPage.editedBy,
        create_user_id: savedPage.createdBy,
      };

      const loged = new Log({
        itemtype: "element",
        itemid: savedPage._id,
        actionBy: savedPage.createdBy,
        message: "Created Element of Type " + savedPage.elementType,
        msgtype: "Info",
        application: AppId._id,
      });
      const logResponse = await loged.save();
      logger.info(JSON.stringify(logResult));

      let items = [];
      items = url.items;
      const pageElement = {
        itemid: savedPage._id,
        itemRef: savedPage.referenceName,
        itemOrder: items.length + 1,
        itemPublish: false,
        itemRepublish: false,
        itemDraft: true,
        itemType: savedPage.elementType,
      };
      items.push(pageElement);

      //checking if Page  exists
      const video = await Page.findByIdAndUpdate(
        { _id: req.params.pageId },
        {
          referenceName: url.referenceName || null,
          urlName: url.urlName || null,
          displayName: url.displayName || null,
          portraitThumbnail: url.portraitThumbnail || null,
          landscapeThumbnail: url.landscapeThumbnail || null,
          bannerImage: url.bannerImage || null,
          genre: url.genre || null,
          starring: url.starring || null,
          rating: url.rating || null,
          ageRating: url.ageRating || null,
          description: url.description || null,
          author: url.author || null,
          publishDate: url.publishDate || null,
          publishedDate: url.publishedDate || null,
          republishStatus: false,
          mainHeader: url.mainHeader || null,
          externalPage: url.externalPage || null,
          internalPage: url.internalPage || null,
          livePage: url.livePage || null,
          blockQuote: url.blockQuote || null,
          sectionHeader1: url.sectionHeader1 || null,
          sectionHeader2: url.sectionHeader2 || null,
          introduction: url.introduction || null,
          sectionDescription1: url.sectionDescription1 || null,
          sectionDescription2: url.sectionDescription2 || null,
          contentType: url.contentType || null,
          premiumType: url.premiumType || null,
          videoId: url.videoId || null,
          audio: url.audio || null,
          tag: url.tag || null,
          firstTag: url.firstTag || null,
          secondTag: url.secondTag || null,
          director: url.director || null,
          cite: url.cite || null,
          writer: url.writer || null,
          studio: url.studio || null,
          recommendation: url.recommendation || null,
          producer: url.producer || null,
          devices: url.devices || null,
          languages: url.languages || null,
          items: items || url.items,
          draftStatus: url.draftStatus,
          publishStatus: url.publishStatus,
          editedBy: url.editedBy,
          editedDate: date,
        },
        function (error, Appex) {
          if (error) {
            throw createError(400, "This Page does not Exist");
          } else {
            return Appex;
          }
        }
      );

      res.send(video);
    } catch (error) {
      const loged = new Log({
        itemtype: "element",
        itemid: "",
        actionBy: req.user._id,
        message: error.status + " - " + error.message,
        msgtype: "Error",
        application: req.user.application,
      });
      const logResponse = await loged.save();
      next(createError(error.status, error.message));
    }
  }
);

router.post("/:AppId/:elemId/createPageInElement", async (req, res, next) => {
  const device = [
    {
      itemName: "web",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "android",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "iOS",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "appletv",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "androidtv",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "firetv",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "roku",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "tizen",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "webos",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "chromecast",
      itemSize: "20",
      itemVisibility: true,
    },
  ];
  const date = new Date();
  date.setDate(date.getDate());
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    const url = await Element.findOne({ _id: req.params.elemId });
    if (!url) throw createError(400, "Invalid element Id");

    //checking if Video Cloud account exists

    //Hashing the password
    //create New User
    const page = new Page({
      pageType: req.body.pageType,
      referenceName: req.body.referenceName || null,
      displayName: req.body.displayName || null,
      urlName: req.body.urlName || null,
      portraitThumbnail: req.body.portraitThumbnail || null,
      landscapeThumbnail: req.body.landscapeThumbnail || null,
      bannerImage: req.body.bannerImage || null,
      genre: req.body.genre || null,
      starring: req.body.starring || null,
      rating: req.body.rating || null,
      ageRating: req.body.ageRating || null,
      description: req.body.description || null,
      author: req.body.author || null,
      publishDate: req.body.publishDate || null,
      publishedDate: req.body.publishedDate || null,
      mainHeader: req.body.mainHeader || null,
      externalPage: req.body.externalPage || null,
      livePage: req.body.livePage || null,
      internalPage: req.body.internalPage || null,
      blockQuote: req.body.blockQuote || null,
      sectionHeader1: req.body.sectionHeader1 || null,
      sectionHeader2: req.body.sectionHeader2 || null,
      introduction: req.body.introduction || null,
      sectionDescription1: req.body.sectionDescription1 || null,
      sectionDescription2: req.body.sectionDescription2 || null,
      contentType: req.body.contentType || null,
      premiumType: req.body.premiumType || null,
      videoId: req.body.videoId || null,
      audio: req.body.audio || null,
      tag: req.body.tag || null,
      firstTag: req.body.firstTag || null,
      secondTag: req.body.secondTag || null,
      director: req.body.director || null,
      writer: req.body.writer || null,
      recommendation: req.body.recommendation || null,
      cite: req.body.cite || null,
      studio: req.body.studio || null,
      producer: req.body.producer || null,
      application: AppId._id,
      devices: device,
      items: req.body.items || null,
      languages: req.body.languages || null,
      draftStatus: req.body.draftStatus || true,
      publishStatus: req.body.publishStatus || false,
      republishStatus: false,
      RFP: req.body.RFP || false,
      createdBy: req.body.createdBy,
      editedBy: req.body.editedBy,
      editedDate: date,
    });

    const savedPage = await page.save();
    const logResult = {
      "Reference Name": savedPage.referenceName,
      type: "page",
      _id: savedPage._id,
      edit_user_id: savedPage.editedBy,
      create_user_id: savedPage.createdBy,
    };
    const loged = new Log({
      itemtype: "page",
      itemid: savedPage._id,
      actionBy: savedPage.createdBy,
      message: "Created Page of Type " + savedPage.pageType,
      msgtype: "Info",
      application: AppId._id,
    });
    const logResponse = await loged.save();
    logger.info(JSON.stringify(logResult));

    let items = [];
    items = url.items;
    const pageElement = {
      itemid: savedPage._id,
      itemRef: savedPage.referenceName,
      itemOrder: items.length + 1,
      itemPublish: false,
      itemRepublish: false,
      itemDraft: true,
      itemType: savedPage.pageType,
    };
    items.push(pageElement);

    //checking if Page  exists
    const video = await Element.findByIdAndUpdate(
      { _id: req.params.elemId },
      {
        referenceName: url.referenceName || null,
        urlName: url.urlName || null,
        portraitThumbnail: url.portraitThumbnail || null,
        landscapeThumbnail: url.landscapeThumbnail || null,
        bannerImage: url.bannerImage || null,
        displayName: url.displayName || null,
        displayNameVisibility: url.displayNameVisibility || true,
        viewAllText: url.viewAllText || null,
        viewAllVisibility: url.viewAllVisibility || true,
        viewAllPage: url.viewAllPage || null,
        playlistId: url.playlistId || null,
        tabType: url.tabType || null,
        tab1Name: url.tab1Name || null,
        tab2Name: url.tab2Name || null,
        tab3Name: url.tab3Name || null,
        tab1Container: url.tab1Container || null,
        tab2Container: url.tab2Container || null,
        tab3Container: url.tab3Container || null,
        devices: url.devices || null,
        items: items || url.items,
        languages: url.languages || null,
        draftStatus: url.draftStatus,
        publishStatus: url.publishStatus,
        republishStatus: false,
        publishedDate: url.publishedDate,
        autoPlay: url.autoPlay || false,
        autoPlayTimer: url.autoPlayTimer || "5",
        editedBy: url.editedBy,
        editedDate: date,
      },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "This Element does not Exist for this application"
          );
        } else {
          return Appex;
        }
      }
    );

    res.send(video);
  } catch (error) {
    const loged = new Log({
      itemtype: "page",
      itemid: "",
      actionBy: req.user._id,
      message: error.status + " - " + error.message,
      msgtype: "Error",
      application: req.user.application,
    });
    const logResponse = await loged.save();
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/addLanguages", async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists
    const video = await App.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
          languages: req.body.languages,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(400, "No Such Appid Exists");
        } else {
          return Appex;
        }
      }
    );
    const logResult = {
      application: AppId._id,
      message: "APP Languages Added",
    };
    logger.info(JSON.stringify(logResult));
    res.send(video);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getLanguageDetail", verify, async (req, res, next) => {
  try {
    const appl = await App.findOne({ _id: req.params.Id }).select("languages");
    if (!appl) throw createError(404, "No APP Exists for this id");
    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createColor", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Color account exists

    const videoExist = await Color.countDocuments({
      application: req.params.AppId,
    });
    if (videoExist > 0)
      throw createError(
        400,
        "A Color Schema already Exist for this application"
      );

    //Hashing the password
    //create New User
    const page = new Color({
      primaryBackgroundColor: req.body.primaryBackgroundColor,
      secondaryBackgroundColor: req.body.secondaryBackgroundColor,
      primaryTextColor: req.body.primaryTextColor,
      secondaryTextColor: req.body.secondaryTextColor,
      primaryHighlightColor: req.body.primaryHighlightColor,
      secondaryHighlightColor: req.body.secondaryHighlightColor,
      menuBackgroundColor: req.body.menuBackgroundColor,
      dark: req.body.dark,
      elementBackgroundColor: req.body.elementBackgroundColor,
      elementForegroundColor: req.body.elementForegroundColor,
      buttonBackgroundColor: req.body.buttonBackgroundColor,
      buttonForegroundColor: req.body.buttonForegroundColor,
      menuForegroundColor: req.body.menuForegroundColor,
      textShadow: req.body.textShadow,
      application: AppId._id,
    });

    const savedPage = await page.save();
    const logResult = { application: AppId._id, message: "Colors is Added" };
    logger.info(JSON.stringify(logResult));
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.put("/:AppId/editColor", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists
    const video = await Color.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
          primaryBackgroundColor: req.body.primaryBackgroundColor,
          secondaryBackgroundColor: req.body.secondaryBackgroundColor,
          primaryTextColor: req.body.primaryTextColor,
          secondaryTextColor: req.body.secondaryTextColor,
          primaryHighlightColor: req.body.primaryHighlightColor,
          dark: req.body.dark,
          secondaryHighlightColor: req.body.secondaryHighlightColor,
          menuBackgroundColor: req.body.menuBackgroundColor,
          elementBackgroundColor: req.body.elementBackgroundColor,
          elementForegroundColor: req.body.elementForegroundColor,
          buttonBackgroundColor: req.body.buttonBackgroundColor,
          buttonForegroundColor: req.body.buttonForegroundColor,
          menuForegroundColor: req.body.menuForegroundColor,
          textShadow: req.body.textShadow,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "Color Schema does not Exist for this application"
          );
        } else {
          return Appex;
        }
      }
    );
    const logResult = { application: AppId._id, message: "Colors is Edited" };
    logger.info(JSON.stringify(logResult));
    res.send(video);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.put("/:elemId/editElement", verify, async (req, res, next) => {
  const date = new Date();
  date.setDate(date.getDate());
  try {
    //Application Id Checking
    const url = await Element.findOne({ _id: req.params.elemId });
    if (url) {
      if (url.urlName !== req.body.urlName) {
        const newUrl = await Element.countDocuments({
          application: url.application,
          urlName: req.body.urlName,
        });

        if (newUrl > 0) throw createError(400, "Url Name Already Exist");
      }
    }
    //checking if Video Cloud account exists
    const video = await Element.findByIdAndUpdate(
      { _id: req.params.elemId },
      {
        referenceName: req.body.referenceName || null,
        urlName: req.body.urlName || null,
        urlPage: req.body.urlPage || null,
        portraitThumbnail: req.body.portraitThumbnail || null,
        landscapeThumbnail: req.body.landscapeThumbnail || null,
        bannerImage: req.body.bannerImage || null,
        displayName: req.body.displayName || null,
        displayNameVisibility: req.body.displayNameVisibility || true,
        viewAllText: req.body.viewAllText || null,
        viewAllVisibility: req.body.viewAllVisibility || true,
        viewAllPage: req.body.viewAllPage || null,
        playlistId: req.body.playlistId || null,
        tabType: req.body.tabType || null,
        tab1Name: req.body.tab1Name || null,
        tab2Name: req.body.tab2Name || null,
        tab3Name: req.body.tab3Name || null,
        tab1Container: req.body.tab1Container || null,
        tab2Container: req.body.tab2Container || null,
        tab3Container: req.body.tab3Container || null,
        devices: req.body.devices || null,
        items: req.body.items || null,
        channels: req.body.channels || null,
        epg: req.body.epg || null,
        languages: req.body.languages || null,
        draftStatus: req.body.draftStatus,
        publishStatus: req.body.publishStatus,
        republishStatus: false,
        RFP: req.body.RFP || false,
        publishedDate: req.body.publishedDate,
        autoPlay: req.body.autoPlay || false,
        autoPlayTimer: req.body.autoPlayTimer || "5",
        editedBy: req.body.editedBy,
        editedDate: date,
      },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "This Element does not Exist for this application"
          );
        } else {
          return Appex;
        }
      }
    );
    const logResult = {
      "Reference Name": video.referenceName,
      type: "page",
      _id: video._id,
      edit_user_id: video.editedBy,
      create_user_id: video.createdBy,
    };
    const loged = new Log({
      itemtype: "element",
      itemid: video._id,
      actionBy: video.editedBy,
      message: "Edited Element of Type " + video.elementType,
      msgtype: "Info",
      application: video.application,
    });
    const logResponse = await loged.save();
    logger.info(JSON.stringify(logResult));
    res.send(video);
  } catch (error) {
    const loged = new Log({
      itemtype: "element",
      itemid: req.params.elemId,
      actionBy: req.body.editedBy,
      message: error.status + "-" + error.message,
      msgtype: "Info",
      application: req.user.application,
    });
    const logResponse = await loged.save();
    next(createError(error.status, error.message));
  }
});

router.put("/:elemId/reEditElement", verify, async (req, res, next) => {
  const date = new Date();
  date.setDate(date.getDate());
  try {
    //Application Id Checking
    const url = await Element.findOne({ _id: req.params.elemId });
    if (url) {
      if (url.urlName !== req.body.urlName) {
        const newUrl = await Element.countDocuments({
          application: url.application,
          urlName: req.body.urlName,
        });

        if (newUrl > 0) throw createError(400, "Url Name Already Exist");
      }
    }
    //checking if Video Cloud account exists
    const video = await Element.findByIdAndUpdate(
      { _id: req.params.elemId },
      {
        referenceName: req.body.referenceName || null,
        urlName: req.body.urlName || null,
        urlPage: req.body.urlPage || null,
        portraitThumbnail: req.body.portraitThumbnail || null,
        landscapeThumbnail: req.body.landscapeThumbnail || null,
        bannerImage: req.body.bannerImage || null,
        displayName: req.body.displayName || null,
        displayNameVisibility: req.body.displayNameVisibility || true,
        viewAllText: req.body.viewAllText || null,
        viewAllVisibility: req.body.viewAllVisibility || true,
        viewAllPage: req.body.viewAllPage || null,
        playlistId: req.body.playlistId || null,
        tabType: req.body.tabType || null,
        tab1Name: req.body.tab1Name || null,
        tab2Name: req.body.tab2Name || null,
        tab3Name: req.body.tab3Name || null,
        tab1Container: req.body.tab1Container || null,
        tab2Container: req.body.tab2Container || null,
        tab3Container: req.body.tab3Container || null,
        devices: req.body.devices || null,
        items: req.body.items || null,
        channels: req.body.channels || null,
        epg: req.body.epg || null,
        languages: req.body.languages || null,
        draftStatus: req.body.draftStatus,
        publishStatus: req.body.publishStatus,
        republishStatus: true,
        RFP: req.body.RFP || false,
        publishedDate: req.body.publishedDate,
        autoPlay: req.body.autoPlay || false,
        autoPlayTimer: req.body.autoPlayTimer || "5",
        editedBy: req.body.editedBy,
        editedDate: date,
      },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "This Element does not Exist for this application"
          );
        } else {
          return Appex;
        }
      }
    );
    const logResult = {
      "Reference Name": video.referenceName,
      type: "page",
      _id: video._id,
      edit_user_id: video.editedBy,
      create_user_id: video.createdBy,
    };
    const loged = new Log({
      itemtype: "element",
      itemid: video._id,
      actionBy: video.editededBy,
      message: "Re-Edited Element of Type " + video.elementType,
      msgtype: "Info",
      application: video.application,
    });
    const logResponse = await loged.save();
    logger.info(JSON.stringify(logResult));
    res.send(video);
  } catch (error) {
    const loged = new Log({
      itemtype: "element",
      itemid: req.params.elemId,
      actionBy: req.body.editedBy,
      message: error.status + "-" + error.message,
      msgtype: "Info",
      application: req.user.application,
    });
    const logResponse = await loged.save();
    next(createError(error.status, error.message));
  }
});

router.put("/:PageId/editPage", verify, async (req, res, next) => {
  const date = new Date();
  date.setDate(date.getDate());
  try {
    const url = await Page.findOne({ _id: req.params.PageId });
    if (url) {
      if (url.urlName !== req.body.urlName) {
        const newUrl = await Page.countDocuments({
          application: url.application,
          urlName: req.body.urlName,
        });
        if (newUrl > 0) throw createError(400, "Url Name Already Exist");
      }
    }
    //checking if Page  exists
    const video = await Page.findByIdAndUpdate(
      { _id: req.params.PageId },
      {
        referenceName: req.body.referenceName || null,
        urlName: req.body.urlName || null,
        displayName: req.body.displayName || null,
        portraitThumbnail: req.body.portraitThumbnail || null,
        landscapeThumbnail: req.body.landscapeThumbnail || null,
        bannerImage: req.body.bannerImage || null,
        genre: req.body.genre || null,
        starring: req.body.starring || null,
        rating: req.body.rating || null,
        ageRating: req.body.ageRating || null,
        description: req.body.description || null,
        author: req.body.author || null,
        publishDate: req.body.publishDate || null,
        publishedDate: req.body.publishedDate || null,
        republishStatus: false,
        mainHeader: req.body.mainHeader || null,
        externalPage: req.body.externalPage || null,
        internalPage: req.body.internalPage || null,
        livePage: req.body.livePage || null,
        blockQuote: req.body.blockQuote || null,
        sectionHeader1: req.body.sectionHeader1 || null,
        sectionHeader2: req.body.sectionHeader2 || null,
        introduction: req.body.introduction || null,
        sectionDescription1: req.body.sectionDescription1 || null,
        sectionDescription2: req.body.sectionDescription2 || null,
        contentType: req.body.contentType || null,
        premiumType: req.body.premiumType || null,
        videoId: req.body.videoId || null,
        audio: req.body.audio || null,
        tag: req.body.tag || null,
        firstTag: req.body.firstTag || null,
        secondTag: req.body.secondTag || null,
        director: req.body.director || null,
        cite: req.body.cite || null,
        writer: req.body.writer || null,
        studio: req.body.studio || null,
        recommendation: req.body.recommendation || null,
        producer: req.body.producer || null,
        devices: req.body.devices || null,
        languages: req.body.languages || null,
        items: req.body.items || null,
        draftStatus: req.body.draftStatus,
        publishStatus: req.body.publishStatus,
        RFP: req.body.RFP || false,
        editedBy: req.body.editedBy,
        editedDate: date,
      },
      function (error, Appex) {
        if (error) {
          throw createError(400, "This Page does not Exist");
        } else {
          return Appex;
        }
      }
    );
    const logResult = {
      "Reference Name": video.referenceName,
      type: "page",
      _id: video._id,
      edit_user_id: video.editedBy,
      create_user_id: video.createdBy,
    };
    const loged = new Log({
      itemtype: "page",
      itemid: video._id,
      actionBy: req.user._id,
      message: "Edited Page of Type " + video.pageType,
      msgtype: "Info",
      application: video.application,
    });
    const logResponse = await loged.save();
    logger.info(JSON.stringify(logResult));
    res.send(video);
  } catch (error) {
    const loged = new Log({
      itemtype: "page",
      itemid: req.params.PageId,
      actionBy: req.body.editedBy,
      message: error.status + "-" + error.message,
      msgtype: "Info",
      application: req.user.application,
    });
    const logResponse = await loged.save();
    next(createError(error.status, error.message));
  }
});

router.put("/:PageId/reEditPage", verify, async (req, res, next) => {
  const date = new Date();
  date.setDate(date.getDate());
  try {
    const url = await Page.findOne({ _id: req.params.PageId });
    if (url) {
      if (url.urlName !== req.body.urlName) {
        const newUrl = await Page.countDocuments({
          application: url.application,
          urlName: req.body.urlName,
        });
        if (newUrl > 0) throw createError(400, "Url Name Already Exist");
      }
    }
    //checking if Video Cloud account exists
    const video = await Page.findByIdAndUpdate(
      { _id: req.params.PageId },
      {
        referenceName: req.body.referenceName || null,
        urlName: req.body.urlName || null,
        displayName: req.body.displayName || null,
        portraitThumbnail: req.body.portraitThumbnail || null,
        landscapeThumbnail: req.body.landscapeThumbnail || null,
        bannerImage: req.body.bannerImage || null,
        genre: req.body.genre || null,
        starring: req.body.starring || null,
        rating: req.body.rating || null,
        ageRating: req.body.ageRating || null,
        description: req.body.description || null,
        author: req.body.author || null,
        publishDate: req.body.publishDate || null,
        publishedDate: req.body.publishedDate || null,
        republishStatus: true,
        mainHeader: req.body.mainHeader || null,
        externalPage: req.body.externalPage || null,
        internalPage: req.body.internalPage || null,
        livePage: req.body.livePage || null,
        blockQuote: req.body.blockQuote || null,
        sectionHeader1: req.body.sectionHeader1 || null,
        sectionHeader2: req.body.sectionHeader2 || null,
        introduction: req.body.introduction || null,
        sectionDescription1: req.body.sectionDescription1 || null,
        sectionDescription2: req.body.sectionDescription2 || null,
        contentType: req.body.contentType || null,
        premiumType: req.body.premiumType || null,
        videoId: req.body.videoId || null,
        audio: req.body.audio || null,
        tag: req.body.tag || null,
        firstTag: req.body.firstTag || null,
        secondTag: req.body.secondTag || null,
        director: req.body.director || null,
        cite: req.body.cite || null,
        writer: req.body.writer || null,
        studio: req.body.studio || null,
        recommendation: req.body.recommendation || null,
        producer: req.body.producer || null,
        devices: req.body.devices || null,
        languages: req.body.languages || null,
        items: req.body.items || null,
        draftStatus: req.body.draftStatus,
        publishStatus: req.body.publishStatus,
        RFP: req.body.RFP || false,
        editedBy: req.body.editedBy,
        editedDate: date,
      },
      function (error, Appex) {
        if (error) {
          throw createError(400, "This Page does not Exist");
        } else {
          return Appex;
        }
      }
    );
    const logResult = {
      "Reference Name": video.referenceName,
      type: "page",
      _id: video._id,
      edit_user_id: video.editedBy,
      create_user_id: video.createdBy,
    };
    const loged = new Log({
      itemtype: "page",
      itemid: video._id,
      actionBy: video.editedBy,
      message: "Re Edited Page of Type " + video.pageType,
      msgtype: "Info",
      application: video.application,
    });
    const logResponse = await loged.save();
    logger.info(JSON.stringify(logResult));
    res.send(video);
  } catch (error) {
    const loged = new Log({
      itemtype: "page",
      itemid: req.params.PageId,
      actionBy: req.body.editedBy,
      message: error.status + "-" + error.message,
      msgtype: "Info",
      application: req.user.application,
    });
    const logResponse = await loged.save();
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createNotification", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //Hashing the password
    //create New User
    const page = new Notification({
      itemtype: req.body.itemtype || null,
      redirect: req.body.redirect || null,
      itemid: req.body.itemid || null,
      message: req.body.message || null,
      read: true,
      sendBy: req.user._id,
      application: AppId._id,
    });

    const savedPage = await page.save();

    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.put("/:Id/editNotification", verify, async (req, res, next) => {
  try {
    //Application Id Checking

    //checking if Video Cloud account exists
    const video = await Notification.findByIdAndUpdate(
      { _id: req.params.Id },
      {
        $set: {
          read: req.body.read || false,
          actionBy: req.user._id,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "No Such Notification  Exist for this application"
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

router.post("/:AppId/createBranding", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Color account exists

    const videoExist = await Branding.countDocuments({
      application: req.params.AppId,
    });
    if (videoExist > 0)
      throw createError(
        400,
        "A Branding Schema already Exist for this application"
      );

    //Hashing the password
    //create New User
    const page = new Branding({
      pageTitle: req.body.pageTitle || null,
      mainLogo: req.body.mainLogo || null,
      footerLogo: req.body.footerLogo || null,
      iconLogo: req.body.iconLogo || null,
      footerDescription: req.body.footerDescription || null,
      appIcon: req.body.appIcon,
      marketingLogo: req.body.marketingLogo,
      tvLogo: req.body.tvLogo,
      chromeCastLogo: req.body.chromeCastLogo,
      mobileLogo: req.body.mobileLogo,
      mainDarkLogo: req.body.mainDarkLogo || null,
      footerDarkLogo: req.body.footerDarkLogo || null,
      tvDarkLogo: req.body.tvDarkLogo,
      chromeCastDarkLogo: req.body.chromeCastDarkLogo,
      mobileDarkLogo: req.body.mobileDarkLogo,

      application: AppId._id,
    });

    const savedPage = await page.save();
    const logResult = { application: AppId._id, message: "Branding is Added" };
    const loged = new Log({
      itemtype: "branding",
      itemid: savedPage._id,
      actionBy: req.user._id,
      message: "Created Branding for Application ",
      msgtype: "Info",
      application: AppId._id,
    });
    const logResponse = await loged.save();
    logger.info(JSON.stringify(logResult));
    res.send(savedPage);
  } catch (error) {
    const loged = new Log({
      itemtype: "branding",
      itemid: "",
      actionBy: req.user._id,
      message: error.status + "-" + error.message,
      msgtype: "Error",
      application: req.user.application,
    });
    const logResponse = await loged.save();
    next(createError(error.status, error.message));
  }
});

router.put("/:AppId/editBranding", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists
    const video = await Branding.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
          pageTitle: req.body.pageTitle,
          mainLogo: req.body.mainLogo,
          footerLogo: req.body.footerLogo,
          iconLogo: req.body.iconLogo,
          footerDescription: req.body.footerDescription,
          appIcon: req.body.appIcon,
          marketingLogo: req.body.marketingLogo,
          tvLogo: req.body.tvLogo,
          chromeCastLogo: req.body.chromeCastLogo,
          mobileLogo: req.body.mobileLogo,
          mainDarkLogo: req.body.mainDarkLogo || null,
          footerDarkLogo: req.body.footerDarkLogo || null,
          tvDarkLogo: req.body.tvDarkLogo,
          chromeCastDarkLogo: req.body.chromeCastDarkLogo,
          mobileDarkLogo: req.body.mobileDarkLogo,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "Branding Schema does not Exist for this application"
          );
        } else {
          return Appex;
        }
      }
    );
    const logResult = { application: AppId._id, message: "Branding is Edited" };
    const loged = new Log({
      itemtype: "branding",
      itemid: video._id,
      actionBy: req.user._id,
      message: "Editing Branding for Application ",
      msgtype: "Info",
      application: AppId._id,
    });
    const logResponse = await loged.save();
    logger.info(JSON.stringify(logResult));
    res.send(video);
  } catch (error) {
    const loged = new Log({
      itemtype: "branding",
      itemid: "",
      actionBy: req.user._id,
      message: error.status + "-" + error.message,
      msgtype: "Error",
      application: req.user.application,
    });
    const logResponse = await loged.save();
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createMenu", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists

    //Hashing the password
    //create New User
    const page = new Menu({
      menuTitle: req.body.menuTitle,
      urlName: req.body.urlName || null,
      menuType: req.body.menuType || null,
      menuPage: req.body.menuPage || null,
      items: req.body.items || null,
      externalUrl: req.body.externalUrl || null,
      internalUrl: req.body.internalUrl || null,
      menuIcon: req.body.menuIcon || null,
      menuOrder: req.body.menuOrder || null,
      application: AppId._id,
    });

    const savedPage = await page.save();
    const logResult = { application: AppId._id, message: "Menu is Added" };
    const loged = new Log({
      itemtype: "menu",
      itemid: savedPage._id,
      actionBy: req.user._id,
      message: "Menu is Created",
      msgtype: "Info",
      application: AppId._id,
    });
    const logResponse = await loged.save();
    logger.info(JSON.stringify(logResult));
    res.send(savedPage);
  } catch (error) {
    const loged = new Log({
      itemtype: "menu",
      itemid: "",
      actionBy: req.user._id,
      message: error.status + "-" + error.message,
      msgtype: "Error",
      application: req.user.application,
    });

    const logResponse = await loged.save();
    next(createError(error.status, error.message));
  }
});

router.put("/:menuId/editMenu", verify, async (req, res, next) => {
  try {
    //checking if Video Cloud account exists
    const video = await Menu.findOneAndUpdate(
      { _id: req.params.menuId },
      {
        menuTitle: req.body.menuTitle,
        urlName: req.body.urlName || null,
        menuType: req.body.menuType || null,
        menuPage: req.body.menuPage || null,
        items: req.body.items || null,
        externalUrl: req.body.externalUrl || null,
        internalUrl: req.body.internalUrl || null,
        menuIcon: req.body.menuIcon || null,
        menuOrder: req.body.menuOrder || null,
      },
      function (error, Appex) {
        if (error) {
          throw createError(400, "This Page does not Exist");
        } else {
          return Appex;
        }
      }
    );
    const logResult = { menuId: req.params.menuId, message: "Menu is Edited" };
    const loged = new Log({
      itemtype: "menu",
      itemid: video._id,
      actionBy: req.user._id,
      message: "Menu is Edited",
      msgtype: "Info",
      application: video.application,
    });
    const logResponse = await loged.save();
    logger.info(JSON.stringify(logResult));
    res.send(video);
  } catch (error) {
    const loged = new Log({
      itemtype: "menu",
      itemid: req.params.menuId,
      actionBy: req.user._id,
      message: error.status + "-" + error.message,
      msgtype: "Error",
      application: req.user.application,
    });

    const logResponse = await loged.save();
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createLanguage", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists

    //Hashing the password
    //create New User
    const page = new Language({
      languages: req.body.languages || null,
      application: AppId._id,
    });

    const savedPage = await page.save();

    AppId = await App.findByIdAndUpdate(
      req.params.AppId,
      {
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
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.put("/:AppId/editLanguage", verify, async (req, res, next) => {
  try {
    //checking if Video Cloud account exists
    const video = await Language.findOneAndUpdate(
      { application: req.params.AppId },
      {
        languages: req.body.languages || null,
      },
      function (error, Appex) {
        if (error) {
          throw createError(400, "This Language does not Exist");
        } else {
          return Appex;
        }
      }
    );

    const AppId = await App.findByIdAndUpdate(
      req.params.AppId,
      {
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

    res.send(video);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getMenu", verify, async (req, res, next) => {
  try {
    const appl = await Menu.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Menu item Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getNotification", verify, async (req, res, next) => {
  try {
    const appl = await Notification.find({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Notification Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getMenubyID", verify, async (req, res, next) => {
  try {
    const appl = await Menu.findOne({ _id: req.params.Id });
    if (!appl) throw createError(404, "No Menu item Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});
router.get("/:AppId/getColor", verify, async (req, res, next) => {
  try {
    const appl = await Color.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Color Schema Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});
router.get("/:AppId/getBranding", verify, async (req, res, next) => {
  try {
    const appl = await Branding.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Branding item Exists");
    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getTracking", verify, async (req, res, next) => {
  try {
    const appl = await Analytics.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Analytics Schema Exists");
    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getPage", verify, async (req, res, next) => {
  try {
    const appl = await Page.findOne({ _id: req.params.Id });
    if (!appl) throw createError(404, "No Page Exists for this id");
    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getAllPages", verify, async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 20;
  var skip = parseInt(req.query.skip) || 0;
  var application = req.params.Id;
  try {
    const imageCount = await Page.countDocuments({
      application: req.params.Id,
    });
    const appl = await Page.find({ application: { $eq: application } })
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip);

    if (!appl) throw createError(400, "Invalid Application ID");
    const result = {
      limit: limit,
      skip: skip,
      pages: appl,
      count: imageCount,
    };

    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getSearchPages", verify, async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 20;
  var skip = parseInt(req.query.skip) || 0;
  var application = req.params.Id;
  var query = req.query.query;
  const imageCount = await Page.countDocuments({ application: application });
  try {
    Page.aggregate(
      [
        {
          $search: {
            index: "pageRef",
            compound: {
              should: [
                {
                  autocomplete: {
                    query: query,
                    path: "displayName",
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 1,
                      maxExpansions: 75,
                    },
                  },
                },
                {
                  autocomplete: {
                    query: query,
                    path: "referenceName",
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 1,
                      maxExpansions: 75,
                    },
                  },
                },
                {
                  autocomplete: {
                    query: query,
                    path: "urlName",
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 1,
                      maxExpansions: 75,
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $match: { application: mongoose.Types.ObjectId(req.params.Id) },
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
          pages: data,
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

router.get("/:Id/getSearchElements", verify, async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 20;
  var skip = parseInt(req.query.skip) || 0;
  var application = req.params.Id;
  var query = req.query.query;
  const imageCount = await Element.countDocuments({ application: application });
  try {
    Element.aggregate(
      [
        {
          $search: {
            index: "elemRef",
            compound: {
              should: [
                {
                  autocomplete: {
                    query: query,
                    path: "displayName",
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 1,
                      maxExpansions: 75,
                    },
                  },
                },
                {
                  autocomplete: {
                    query: query,
                    path: "referenceName",
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 1,
                      maxExpansions: 75,
                    },
                  },
                },
                {
                  autocomplete: {
                    query: query,
                    path: "description",
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 1,
                      maxExpansions: 75,
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $match: { application: mongoose.Types.ObjectId(req.params.Id) },
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
          elements: data,
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

router.delete("/:Id/deletePage", verify, async (req, res, next) => {
  try {
    const SystemId = await Page.findByIdAndDelete(
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

router.get("/:Id/getElement", verify, async (req, res, next) => {
  try {
    const appl = await Element.findOne({ _id: req.params.Id });
    if (!appl) throw createError(404, "No Elements Exists for this id");
    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getAllElements", verify, async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 20;
  var skip = parseInt(req.query.skip) || 0;
  var application = req.params.Id;
  try {
    const imageCount = await Element.countDocuments({
      application: req.params.Id,
    });
    const appl = await Element.find({ application: { $eq: application } })
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip);

    if (!appl) throw createError(400, "Invalid Application ID");
    const result = {
      limit: limit,
      skip: skip,
      elements: appl,
      count: imageCount,
    };

    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getAllElementsByType", verify, async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 20;
  var skip = parseInt(req.query.skip) || 0;
  var type = req.query.type || "portraitSlider";
  var application = req.params.Id;
  try {
    const imageCount = await Element.countDocuments({
      application: req.params.Id,
      elementType: type,
    });
    const appl = await Element.find({
      application: { $eq: application },
      elementType: { $eq: type },
    })
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip);

    if (!appl) throw createError(400, "Invalid Application ID");
    const result = {
      limit: limit,
      skip: skip,
      elements: appl,
      count: imageCount,
    };

    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getfullMenu", async (req, res, next) => {
  Menu.find({ application: req.params.AppId })
    .populate("menuPage") // key to populate
    .then((user) => {
      res.json(user);
    });
});

router.delete("/:Id/deleteMenu", verify, async (req, res, next) => {
  try {
    const SystemId = await Menu.findByIdAndDelete(
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

router.post("/:AppId/createTicker", verify, async (req, res, next) => {
  const device = [
    {
      itemName: "web",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "android",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "iOS",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "appletv",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "androidtv",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "firetv",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "roku",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "tizen",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "webos",
      itemSize: "20",
      itemVisibility: true,
    },
    {
      itemName: "chromecast",
      itemSize: "20",
      itemVisibility: true,
    },
  ];
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists

    //Hashing the password
    //create New User
    const page = new Ticker({
      referenceName: req.body.referenceName || null,
      application: AppId._id,
      devices: device,
      items: req.body.items || [],
      draftStatus: req.body.draftStatus || true,
      publishStatus: req.body.publishStatus || false,
    });

    const savedPage = await page.save();
    const logResult = {
      application: AppId._id,
      message: "Ticker is Added",
      ticker_id: savedPage._id,
    };
    logger.info(JSON.stringify(logResult));
    res.send(savedPage);
  } catch (error) {
    console.log(error);
    next(createError(error.status, error.message));
  }
});

router.put("/:elemId/editTicker", verify, async (req, res, next) => {
  try {
    //Application Id Checking

    //checking if Video Cloud account exists
    const video = await Ticker.findByIdAndUpdate(
      { _id: req.params.elemId },
      {
        referenceName: req.body.referenceName || null,
        devices: req.body.devices || null,
        items: req.body.items || null,
        draftStatus: req.body.draftStatus,
        publishStatus: req.body.publishStatus,
      },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "This Ticker does not Exist for this application"
          );
        } else {
          return Appex;
        }
      }
    );
    const logResult = {
      element: req.params.elemId,
      message: "Ticker is Edited",
      ticker_id: video._id,
    };
    logger.info(JSON.stringify(logResult));
    res.send(video);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createTickerPage", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    const pageCount = await TickerPage.findOne({
      page: mongoose.Types.ObjectId(req.body.page),
    });
    //checking if Video Cloud account exists
    if (pageCount)
      throw createError(400, "A Ticker Already exist for this page");

    //Hashing the password
    //create New User
    const page = new TickerPage({
      application: AppId._id,
      ticker: mongoose.Types.ObjectId(req.body.ticker),
      page: mongoose.Types.ObjectId(req.body.page),
      draftStatus: true,
      publishStatus: false,
    });

    const savedPage = await page.save();
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});
router.get("/:Id/getTicker", verify, async (req, res, next) => {
  try {
    const appl = await Ticker.findOne({ _id: req.params.Id });
    if (!appl) throw createError(404, "No Ticker Exists for this id");
    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getAllTicker", verify, async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 20;
  var skip = parseInt(req.query.skip) || 0;
  var application = req.params.Id;
  try {
    const imageCount = await Ticker.countDocuments({
      application: req.params.Id,
    });
    const appl = await Ticker.find({ application: { $eq: application } })
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip);

    if (!appl) throw createError(400, "Invalid Application ID");
    const result = {
      limit: limit,
      skip: skip,
      tickers: appl,
      count: imageCount,
    };

    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getAllTickerPage", verify, async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 20;
  var skip = parseInt(req.query.skip) || 0;
  var application = req.params.Id;
  try {
    const imageCount = await TickerPage.countDocuments({
      application: req.params.Id,
    });
    const appl = await TickerPage.find({ application: { $eq: application } })
      .populate("ticker")
      .populate("page")
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip);

    if (!appl) throw createError(400, "Invalid Application ID");
    const result = {
      limit: limit,
      skip: skip,
      tickers: appl,
      count: imageCount,
    };

    res.send(result);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});
router.get("/:AppId/getfullTiCkerPage", async (req, res, next) => {
  TickerPage.find({ application: req.params.AppId })
    .populate("page") // key to populate
    .then((user) => {
      res.json(user);
    });
});

router.delete("/:Id/deleteTickerPage", verify, async (req, res, next) => {
  try {
    const SystemId = await TickerPage.findByIdAndDelete(
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

router.delete("/:Id/deleteElement", verify, async (req, res, next) => {
  try {
    const SystemId = await Element.findByIdAndDelete(
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

router.post("/:AppId/createSetting", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Color account exists

    const videoExist = await Setting.countDocuments({
      application: req.params.AppId,
    });
    if (videoExist > 0)
      throw createError(
        400,
        "A Setting Schema already Exist for this application"
      );

    //Hashing the password
    //create New User
    const page = new Setting({
      title: req.body.title,
      headData: req.body.headData,
      domainName: req.body.domainName,
      startPage: req.body.startPage,
      allowLogin: req.body.allowLogin,
      allowSubscription: req.body.allowSubscription,
      darkMode: req.body.darkMode,
      siteDescription: req.body.siteDescription,
      bingeWatching: req.body.bingeWatching,
      resumePlayback: req.body.resumePlayback,
      socialSharing: req.body.socialSharing,
      chromecastID: req.body.chromecastID,
      rtl: req.body.rtl,
      multiLanguage: req.body.multiLanguage,
      favourites: req.body.favourites,
      watchHistory: req.body.watchHistory,
      premiumIconVisibility: req.body.premiumIconVisibility,
      premiumIcon: req.body.premiumIcon,
      RFP: req.body.RFP || false,
      gdpr: req.body.gdpr,
      production: req.body.production || false,
      application: AppId._id,
    });

    const savedPage = await page.save();
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createWebSetting", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Color account exists

    const videoExist = await WebSetting.countDocuments({
      application: req.params.AppId,
    });
    if (videoExist > 0)
      throw createError(
        400,
        "A Web Setting Schema already Exist for this application"
      );

    //Hashing the password
    //create New User
    const page = new WebSetting({
      numberofMenuItem: req.body.numberofMenuItem,
      thumbnailAnimation: req.body.thumbnailAnimation,
      loadingSpinner: req.body.loadingSpinner,
      deepLink: req.body.deepLink,
      cookiePolicy: req.body.cookiePolicy,
      shading: req.body.shading,
      thumbnailDescription: req.body.thumbnailDescription,
      float: req.body.float,
      imageBorder: req.body.imageBorder,
      application: AppId._id,
    });

    const savedPage = await page.save();
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createMonetize", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Color account exists

    const videoExist = await Monetize.countDocuments({
      application: req.params.AppId,
    });
    if (videoExist > 0)
      throw createError(
        400,
        "A Monetize Schema already Exist for this application"
      );

    //Hashing the password
    //create New User
    const page = new Monetize({
      adTag: req.body.adTag,
      adsTxt: req.body.adsTxt,
      premiumAd: req.body.premiumAd,
      freemiumAd: req.body.freemiumAd,
      application: AppId._id,
    });

    const savedPage = await page.save();
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.put("/:AppId/editMonetize", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists
    const video = await Monetize.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
          adTag: req.body.adTag,
          adsTxt: req.body.adsTxt,
          premiumAd: req.body.premiumAd,
          freemiumAd: req.body.freemiumAd,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "Monetize Schema does not Exist for this application"
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

router.post("/:AppId/createAppSetting", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Color account exists

    const videoExist = await AppSetting.countDocuments({
      application: req.params.AppId,
    });
    if (videoExist > 0)
      throw createError(
        400,
        "An App Setting Schema already Exist for this application"
      );

    //Hashing the password
    //create New User
    const page = new AppSetting({
      actionBarStyle: req.body.actionBarStyle,
      androidMinVersion: req.body.androidMinVersion,
      iOSMinVersion: req.body.iOSMinVersion,
      androidTvMinVersion: req.body.androidTvMinVersion,
      appleTvMinVersion: req.body.appleTvMinVersion,
      fireTvMinVersion: req.body.fireTvMinVersion,
      rokuMinVersion: req.body.rokuMinVersion,
      SamsungMinVersion: req.body.SamsungMinVersion,
      LGMinVersion: req.body.LGMinVersion,
      loadingSpinner: req.body.loadingSpinner,
      landscapeOrientation: req.body.landscapeOrientation,
      Casting: req.body.Casting,
      pip: req.body.pip,
      subtitles: req.body.subtitles,
      playinSmallWindow: req.body.playinSmallWindow,
      imageBorder: req.body.imageBorder,
      application: AppId._id,
    });

    const savedPage = await page.save();
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});
router.put("/:AppId/editSetting", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");
    console.log(req.body);
    //checking if Video Cloud account exists
    const video = await Setting.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
          title: req.body.title,
          headData: req.body.headData,
          domainName: req.body.domainName,
          startPage: req.body.startPage,
          allowLogin: req.body.allowLogin,
          allowSubscription: req.body.allowSubscription,
          darkMode: req.body.darkMode,
          siteDescription: req.body.siteDescription,
          bingeWatching: req.body.bingeWatching,
          resumePlayback: req.body.resumePlayback,
          socialSharing: req.body.socialSharing,
          chromecastID: req.body.chromecastID,
          rtl: req.body.rtl,
          multiLanguage: req.body.multiLanguage,
          favourites: req.body.favourites,
          watchHistory: req.body.watchHistory,
          premiumIconVisibility: req.body.premiumIconVisibility,
          premiumIcon: req.body.premiumIcon,
          RFP: req.body.RFP || false,
          production: req.body.production || false,
          gdpr: req.body.gdpr,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "Setting Schema does not Exist for this application"
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

router.put("/:AppId/editWebSetting", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists
    const video = await WebSetting.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
          numberofMenuItem: req.body.numberofMenuItem,
          thumbnailAnimation: req.body.thumbnailAnimation,
          loadingSpinner: req.body.loadingSpinner,
          deepLink: req.body.deepLink,
          float: req.body.float,
          cookiePolicy: req.body.cookiePolicy,
          thumbnailDescription: req.body.thumbnailDescription,
          shading: req.body.shading,
          imageBorder: req.body.imageBorder,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "Setting Schema does not Exist for this application"
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

router.put("/:AppId/editAppSetting", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists
    const video = await AppSetting.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
          actionBarStyle: req.body.actionBarStyle,
          androidMinVersion: req.body.androidMinVersion,
          iOSMinVersion: req.body.iOSMinVersion,
          androidTvMinVersion: req.body.androidTvMinVersion,
          appleTvMinVersion: req.body.appleTvMinVersion,
          fireTvMinVersion: req.body.fireTvMinVersion,
          rokuMinVersion: req.body.rokuMinVersion,
          SamsungMinVersion: req.body.SamsungMinVersion,
          LGMinVersion: req.body.LGMinVersion,
          loadingSpinner: req.body.loadingSpinner,
          landscapeOrientation: req.body.landscapeOrientation,
          Casting: req.body.Casting,
          pip: req.body.pip,
          subtitles: req.body.subtitles,
          playinSmallWindow: req.body.playinSmallWindow,
          imageBorder: req.body.imageBorder,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "Setting Schema does not Exist for this application"
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

router.get("/:AppId/getSetting", verify, async (req, res, next) => {
  try {
    const appl = await Setting.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Setting Schema Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/isNecessary", verify, async (req, res, next) => {
  try {
    const appl = await Setting.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Setting Schema Exists");
    const is_necessary = { production: appl.production, RFP: appl.RFP };

    res.send(is_necessary);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getWebSetting", verify, async (req, res, next) => {
  try {
    const appl = await WebSetting.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Web Setting Schema Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getMonetize", verify, async (req, res, next) => {
  try {
    const appl = await Monetize.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Monetize Schema Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status || 500, error.message || "Server error"));
  }
});
router.post("/:AppId/createVast", verify, async (req, res, next) => {
  const date = new Date();
  date.setDate(date.getDate());
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    // Basic body validation
    const { type, adUrl, duration, timeOffset, createdBy, editedBy } = req.body;
    if (!type || !adUrl) {
      throw createError(400, "type and adUrl are required");
    }

    // Generate internal values
    const safeDuration = duration || "00:00:05";
    const adId = `${type}-${Date.now()}`;

    // Build VAST XML
    const vastXml = `
<VAST version="3.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Ad id="${adId}">
    <InLine>
      <AdSystem>Sample Ad Server</AdSystem>
      <AdTitle>${type} Ad</AdTitle>
      <Creatives>
        <Creative>
          <Linear>
            <Duration>${safeDuration}</Duration>
            <MediaFiles>
              <MediaFile delivery="progressive" type="video/mp4" width="640" height="360">
                ${adUrl.trim()}
              </MediaFile>
            </MediaFiles>
          </Linear>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>`.trim();

    // Create & save the document
    const vastDoc = new VastSchedule({
      type,
      adUrl,
      duration: safeDuration,
      adId,
      timeOffset,
      vastXml,
      application: AppId._id, // ↔ relation to Application
      createdBy,
      editedBy,
      editedDate: date,
    });

    await vastDoc.save();

    // Add the public XML link & save again
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    vastDoc.xmlLink = `${protocol}://${host}/api/layout/${
      AppId._id
    }/${vastDoc._id}.xml`;
    const savedVast = await vastDoc.save();
    // Return success
    res.send(savedVast);
    // res.status(201).json({
    //   message: "VAST XML created and linked",
    //   id: vastDoc._id,
    //   adId,
    //   xmlLink: vastDoc.xmlLink,
    //   vastAd: vastDoc,
    // });
  } catch (error) {
    next(
      createError(error.status || 500, error.message || "Internal server error")
    );
  }
});
// editVast
router.put("/:AppId/vast/:VastId/edit", verify, async (req, res, next) => {
  try {
    const { VastId } = req.params;
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");
    //  Find the specific VAST ad under this app

    const vast = await VastSchedule.findOne({
      _id: VastId,
      application: AppId,
    });
    if (!vast) {
      return res.status(404).json({
        success: false,
        message: "No VAST Ad found with the given ID for this application",
      });
    }

    //  Resolve final values
    const keep = (v, fallback) =>
      v === undefined || v === null || v === "" ? fallback : v;

    const finalType = keep(req.body.type, vast.type);
    const finalAdUrl = keep(req.body.adUrl, vast.adUrl);
    const finalDuration = keep(req.body.duration, vast.duration);
    const finalOffset = keep(req.body.timeOffset, vast.timeOffset);
    const finalEditedBy = keep(req.body.editedBy, vast.editedBy);

    //  Regenerate adId & VAST XML
    const newAdId = `${finalType}-${Date.now()}`;
    const vastXml = `
<VAST version="3.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Ad id="${newAdId}">
    <InLine>
      <AdSystem>Sample Ad Server</AdSystem>
      <AdTitle>${finalType} Ad</AdTitle>
      <Creatives>
        <Creative>
          <Linear>
            <Duration>${finalDuration}</Duration>
            <MediaFiles>
              <MediaFile delivery="progressive" type="video/mp4" width="640" height="360">
                ${finalAdUrl.trim()}
              </MediaFile>
            </MediaFiles>
          </Linear>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>`.trim();

    //  Update the VAST ad
    const updatedVast = await VastSchedule.findByIdAndUpdate(
      VastId,
      {
        $set: {
          type: finalType,
          adUrl: finalAdUrl,
          duration: finalDuration,
          timeOffset: finalOffset,
          adId: newAdId,
          vastXml: vastXml,
          editedBy: finalEditedBy,
          editedDate: new Date(),
          xmlLink: `${req.headers['x-forwarded-proto'] || req.protocol}://${req.headers['x-forwarded-host'] || req.get('host')}/api/layout/${
            AppId._id
          }/${vast._id}.xml`,
        },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "VAST Ad updated successfully",
      vastAd: updatedVast,
    });
  } catch (err) {
    next(createError(err.status || 500, err.message || "Server error"));
  }
});
router.get("/:AppId/getVast", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const app = await App.findById(req.params.AppId);
    if (!app) throw createError(400, "Invalid Application Id");

    const vastAds = await VastSchedule.find({
      application: app._id,
    }).sort({ updatedAt: -1 });

    if (vastAds.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No VAST ads found for this application",
      });
    }
    // Return success
    res.send(vastAds);
    // res.status(200).json({
    //   success: true,
    //   message: "VAST ads fetched successfully",
    //   data: vastAds,
    // });
  } catch (error) {
    next(createError(error.status || 500, error.message || "Server error"));
  }
});

router.get("/:AppId/:vastId.xml", async (req, res, next) => {
  try {
    const { AppId, vastId } = req.params;

    // Application Id Checking
    const app = await App.findById(AppId);
    if (!app) throw createError(400, "Invalid Application Id");

    // Look up VAST entry for this application
    const vast = await VastSchedule.findOne({
      _id: vastId,
      application: app._id,
    });

    if (!vast) throw createError(404, "No VAST XML found for this application");

    // Send XML response
    res.type("application/xml").status(200).send(vast.vastXml);
  } catch (err) {
    next(createError(err.status || 500, err.message || "Server error"));
  }
});

router.delete("/:AppId/:vastId/delete", verify, async (req, res, next) => {
  const { AppId, vastId } = req.params;

  try {
    //Application Id Checking
    const appExists = await App.findById(AppId);
    if (!appExists) throw createError(400, "Invalid Application Id");

    // Find and delete the VAST if it belongs to the AppId
    const deletedVast = await VastSchedule.findOneAndDelete({
      _id: vastId,
      application: appExists._id,
    });

    if (!deletedVast) {
      throw createError(404, "VAST entry not found for this application");
    }

    //  Success response
    //res.send(deletedVast);
    res.status(200).json({
      success: true,
      message: "VAST entry deleted successfully",
      data: deletedVast,
    });
  } catch (error) {
    console.error("Error deleting VAST entry:", error);
    next(
      createError(error.status || 500, error.message || "Internal Server Error")
    );
  }
});

router.post("/:AppId/createVmap", verify, async (req, res, next) => {
  const date = new Date();
  date.setDate(date.getDate());
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    // Validate body
    const { vastFiles } = req.body;
    if (!Array.isArray(vastFiles) || vastFiles.length === 0) {
      throw createError(400, "vastFiles array is required");
    }

    // Build VMAP XML
    let vmapXml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<vmap:VMAP xmlns:vmap="http://www.iab.net/videosuite/vmap" version="1.0">\n';

    function normalizeTimeOffset(offset) {
      if (offset === 'start' || offset === 'end') return offset;
      const parts = offset.split(':').slice(0, 3);
      const time = parts.map(p => p.padStart(2, '0')).join(':');
      return time + '.000';
    }

    const typeCounters = {};
    vastFiles.forEach(({ type, timeOffset, xmlLink, adId }) => {
      const count = typeCounters[type] = (typeCounters[type] || 0) + 1;
      const normalizedType = type.replace('-', '');
      const normalizedOffset = normalizeTimeOffset(timeOffset);
      const is2min = normalizedOffset === '00:02:00.000';
      const breakId = count === 1 ? normalizedType : is2min ? `${normalizedType}-2min` : `${normalizedType}-${count}`;
      const adSourceId = count === 1 ? `${normalizedType}-ad-1` : is2min ? `${normalizedType}-ad-2min` : `${normalizedType}-ad-${count}`;
      vmapXml +=
        `  <vmap:AdBreak timeOffset="${normalizedOffset}" breakType="linear" breakId="${breakId}">\n` +
        `    <vmap:AdSource id="${adSourceId}" allowMultipleAds="false" followRedirects="true">\n` +
        `      <vmap:AdTagURI templateType="vast3"><![CDATA[${xmlLink}]]></vmap:AdTagURI>\n` +
        `    </vmap:AdSource>\n` +
        `  </vmap:AdBreak>\n`;
    });

    vmapXml += "</vmap:VMAP>";

    // Persist to DB
    const fileName = `vmap-${Date.now()}.xml`;

    const vmapDoc = new VmapData({
      fileName,
      vmapXml,
      application: AppId._id,
      createdBy: req.body.createdBy,
      editedBy: req.body.editedBy,
      editedDate: date,
    });
    const xmlLink = `${req.headers['x-forwarded-proto'] || req.protocol}://${req.headers['x-forwarded-host'] || req.get('host')}/api/layout/vmap/${
      AppId._id
    }/${vmapDoc._id}.xml`;

    vmapDoc.xmlLink = xmlLink;
    await vmapDoc.save();

    // Generate public link & save again
    const savedVmap = await vmapDoc.save();

    //Success response
    res.send(savedVmap);
    // res.status(201).json({
    //   success : true,
    //   message : "✅ VMAP XML created",
    //   vmapId  : vmapDoc._id,
    //   fileName: vmapDoc.fileName,
    //   xmlLink : vmapDoc.xmlLink,
    // });
  } catch (err) {
    next(
      createError(err.status || 500, err.message || "Failed to create VMAP XML")
    );
  }
});
// GET all VMAP entries
router.get("/vmap/:AppId/getVmap", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const app = await App.findById(req.params.AppId);
    if (!app) throw createError(400, "Invalid Application Id");

    const vmapEntries = await VmapData.find({
      application: req.params.AppId,
    }).sort({ updatedAt: -1 });

    if (vmapEntries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No VMAP entries found for this application",
      });
    }

    res.send(vmapEntries);
    // res.status(200).json({
    //   success: true,
    //   message: "All VMAP entries retrieved",
    //   data: vmapEntries,
    // });
  } catch (error) {
    next(createError(error.status || 500, error.message || "Server error"));
  }
});
// GET /api/vmap-config/:id.xml
router.get("/vmap/:AppId/:vmapId.xml", async (req, res, next) => {
  try {
    const { AppId, vmapId } = req.params;
    //Application Id Checking
    const app = await App.findById(AppId);
    if (!app) throw createError(400, "Invalid Application Id");

    const vmap = await VmapData.findOne({
      _id: vmapId,
      application: AppId,
    });
    if (!vmap) {
      return res.status(404).send("VMAP XML not found");
    }
    res.set("Content-Type", "application/xml");
    // res.send(vmap.vmapXml);
    // Send XML response
    res.type("application/xml").status(200).send(vmap.vmapXml);
  } catch (err) {
    next(createError(err.status || 500, err.message || "Server error"));
  }
});
router.delete("/vmap/:AppId/:vmapId/delete", verify, async (req, res, next) => {
  const { AppId, vmapId } = req.params;

  try {
    //Application Id Checking
    const appExists = await App.findById(AppId);
    if (!appExists) throw createError(400, "Invalid Application Id");

    // Find and delete the VMAP if it belongs to the AppId
    const deletedVmap = await VmapData.findOneAndDelete({
      _id: vmapId,
      application: appExists._id,
    });

    if (!deletedVmap) {
      throw createError(404, "VMAP entry not found for this application");
    }

    //  Success response
    //res.send(deletedVmap);
    res.status(200).json({
      success: true,
      message: "VMAP entry deleted successfully",
      data: deletedVmap,
    });
  } catch (error) {
    console.error("Error deleting VMAP entry:", error);
    next(
      createError(error.status || 500, error.message || "Internal Server Error")
    );
  }
});
router.get("/:AppId/getAppSetting", verify, async (req, res, next) => {
  try {
    const appl = await AppSetting.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No App Setting Schema Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createFooter", verify, async (req, res, next) => {
  const date = new Date();
  date.setDate(date.getDate());

  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Color account exists

    const videoExist = await Footer.countDocuments({
      application: req.params.AppId,
    });
    if (videoExist > 0)
      throw createError(
        400,
        "A Footer Schema already Exist for this application"
      );

    //Hashing the password
    //create New User
    const page = new Footer({
      sectionHeader1: req.body.sectionHeader1,
      sectionHeader2: req.body.sectionHeader2,
      sectionHeader3: req.body.sectionHeader3,
      facebookLink: req.body.facebookLink,
      youtubeLink: req.body.youtubeLink,
      instagramLink: req.body.instagramLink,
      twitterLink: req.body.twitterLink,
      footDescription: req.body.footDescription,
      application: AppId._id,
      createdBy: req.body.createdBy,
      editedBy: req.body.editedBy,
      items: req.body.items || null,
      editedDate: date,
    });

    const savedPage = await page.save();
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.put("/:AppId/editFooter", verify, async (req, res, next) => {
  const date = new Date();
  date.setDate(date.getDate());

  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists
    const video = await Footer.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
          sectionHeader1: req.body.sectionHeader1,
          sectionHeader2: req.body.sectionHeader2,
          sectionHeader3: req.body.sectionHeader3,
          facebookLink: req.body.facebookLink,
          youtubeLink: req.body.youtubeLink,
          instagramLink: req.body.instagramLink,
          twitterLink: req.body.twitterLink,
          footDescription: req.body.footDescription,
          editedBy: req.body.editedBy,
          items: req.body.items,
          editedDate: date,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "Setting Schema does not Exist for this application"
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

router.get("/:AppId/getFooter", verify, async (req, res, next) => {
  try {
    const appl = await Footer.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Footer Schema Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createFont", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Color account exists

    const videoExist = await Font.countDocuments({
      application: req.params.AppId,
    });
    if (videoExist > 0)
      throw createError(
        400,
        "A Font Schema already Exist for this application"
      );

    //Hashing the password
    //create New User
    const page = new Font({
      selectedFont: req.body.selectedFont,
      application: AppId._id,
      items: req.body.items || null,
      urlItems: req.body.urlItems || null,
    });

    const savedPage = await page.save();
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.put("/:AppId/editFont", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists
    const video = await Font.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
          selectedFont: req.body.selectedFont,
          application: AppId._id,
          items: req.body.items || null,
          urlItems: req.body.urlItems || null,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "Font Schema does not Exist for this application"
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

router.get("/:AppId/getFont", verify, async (req, res, next) => {
  try {
    const appl = await Font.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Font Schema Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/createSubscribe", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Color account exists

    const videoExist = await Subscription.countDocuments({
      application: req.params.AppId,
    });
    if (videoExist > 0)
      throw createError(
        400,
        "A Font Schema already Exist for this application"
      );

    //Hashing the password
    //create New User
    const page = new Subscription({
      SRMName: req.body.SRMName,
      SRMKey: req.body.SRMKey,
      SRMSecret: req.body.SRMSecret,
      uuid: req.body.uuid,
      customPayment: req.body.customPayment,
      checkoutUrl: req.body.checkoutUrl,
      customLogin: req.body.customLogin,
      customLoginUrl: req.body.customLoginUrl,
      otp: req.body.otp,
      otpKey: req.body.otpKey,
      application: AppId._id,
      plans: req.body.plans || null,
    });

    const savedPage = await page.save();
    res.send(savedPage);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.put("/:AppId/editSubscribe", verify, async (req, res, next) => {
  try {
    //Application Id Checking
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");

    //checking if Video Cloud account exists
    const video = await Subscription.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: {
          SRMName: req.body.SRMName,
          SRMKey: req.body.SRMKey,
          SRMSecret: req.body.SRMSecret,
          uuid: req.body.uuid,
          customPayment: req.body.customPayment,
          checkoutUrl: req.body.checkoutUrl,
          customLogin: req.body.customLogin,
          customLoginUrl: req.body.customLoginUrl,
          otp: req.body.otp,
          otpKey: req.body.otpKey,
          application: AppId._id,
          plans: req.body.plans || null,
        },
      },
      { new: true, upsert: false },
      function (error, Appex) {
        if (error) {
          throw createError(
            400,
            "Subscription Schema does not Exist for this application"
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

router.get("/:AppId/getSubscribe", verify, async (req, res, next) => {
  try {
    const appl = await Subscription.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Subscription Schema Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getAllUsers", verify, async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });
  var limit = parseInt(req.query.limit) || 20;
  var skip = parseInt(req.query.skip) || 0;

  if (!user) throw createError(400, "Invalid Token");

  const imageCount = await User.countDocuments({
    application: req.params.AppId,
  });
  if (user.superAdmin) {
    const appl = await User.find({ application: { $eq: req.params.AppId } })
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip);
    if (!appl) throw createError(400, "Invalid APP ID");
    const result = {
      limit: limit,
      skip: skip,
      users: appl,
      count: imageCount,
    };
    res.send(result);
  } else if (user.admin) {
    const appl = await User.find({
      application: { $eq: req.params.AppId },
      superAdmin: false,
    })
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip);
    if (!appl) throw createError(400, "Invalid ID");
    const result = {
      limit: limit,
      skip: skip,
      users: appl,
      count: imageCount,
    };
    res.send(result);
  } else {
    next(
      createError(
        403,
        "The user does not have the necessary permissions for the resource"
      )
    );
  }
});
// User Deletion ...
router.delete("/:userId/deleteUser", async (req, res) => {
  //Master Id Checking
  const MasterId = await User.findByIdAndUpdate(
    req.params.userId,
    {
      active: false,
    },
    function (error, Appex) {
      if (error) {
        return res.status(400).send("Invalid ID - Unable to edit");
      } else {
        return Appex;
      }
    }
  );
  res.send("Deactivated User Successfully");
});

// Edit User Details
router.put("/:userId/editUser", verify, async (req, res) => {
  //Master Id Checking
  const MasterId = await User.findByIdAndUpdate(
    req.params.userId,
    {
      name: req.body.name,
      email: req.body.email,
      superAdmin: req.body.superAdmin,
      admin: req.body.admin,
      reader: req.body.reader,
    },
    function (error, Appex) {
      if (error) {
        return res.status(400).send("Invalid ID - Unable to edit");
      } else {
        return Appex;
      }
    }
  );
  res.send("Updated User Successfully");
});

// Edit User Password
router.put("/:userId/changePassword", verify, async (req, res) => {
  //validation
  const { error } = passwordValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Master Id Checking
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //checking if User exists

  const master = await User.findOne({ _id: req.params.userId });
  if (!master) return res.status(400).send("Invalid User ID");

  //checking if Current Password Matches

  const validPass = await bcrypt.compare(
    req.body.currentPassword,
    master.password
  );
  if (!validPass) return res.status(400).send("Invalid Current Password");

  const MasterId = await User.findByIdAndUpdate(
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

router.get("/:Id/getDashBoardElements", async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 5;
  var skip = parseInt(req.query.skip) || 0;
  var application = req.params.Id;
  try {
    const appl = await Element.find({ application: { $eq: application } })
      .sort({ editedDate: "descending" })
      .limit(limit)
      .skip(skip)
      .populate({
        path: "editedBy",
        model: "User",
        select: { _id: 1, name: 1 },
      });

    if (!appl) throw createError(400, "Invalid Application ID");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getDashBoardPages", verify, async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 5;
  var skip = parseInt(req.query.skip) || 0;
  var application = req.params.Id;
  try {
    const appl = await Page.find({ application: { $eq: application } })
      .sort({ editedDate: "descending" })
      .limit(limit)
      .skip(skip)
      .populate({
        path: "editedBy",
        model: "User",
        select: { _id: 1, name: 1 },
      });

    if (!appl) throw createError(400, "Invalid Application ID");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getLogs", verify, async (req, res, next) => {
  var limit = parseInt(req.query.limit) || 25;
  var skip = parseInt(req.query.skip) || 0;
  var application = req.params.Id;
  try {
    const appl = await Log.find({ application: { $eq: application } })
      .sort({ date: "descending" })
      .limit(limit)
      .skip(skip)
      .populate({
        path: " actionBy",
        model: "User",
        select: { _id: 1, name: 1 },
      });

    if (!appl) throw createError(400, "Invalid Application ID");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/getPageGroup/", verify, async (req, res, next) => {
  try {
    const appl = await Page.find(
      {
        _id: { $in: req.query.id },
      },
      function (err, docs) {
        if (!err) {
          return docs;
        }
      }
    ).select(
      "_id referenceName pageType displayName urlName draftStatus publishStatus republishStatus"
    );

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:pageId/getElementArray", verify, async (req, res, next) => {
  try {
    const appl = await Element.find(
      { items: { $elemMatch: { itemid: req.params.pageId } } },
      function (err, docs) {
        if (!err) {
          return docs;
        }
      }
    ).select(
      "_id referenceName elementType displayName urlName draftStatus publishStatus republishStatus"
    );

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:elemId/getTabArray", verify, async (req, res, next) => {
  try {
    const appl = await Element.find(
      { items: { $elemMatch: { itemid: req.params.elemId } } },
      function (err, docs) {
        if (!err) {
          return docs;
        }
      }
    ).select(
      "_id referenceName elementType displayName urlName draftStatus publishStatus republishStatus"
    );

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:elemId/getPageArray", verify, async (req, res, next) => {
  try {
    const appl = await Page.find(
      { items: { $elemMatch: { itemid: req.params.elemId } } },
      function (err, docs) {
        if (!err) {
          return docs;
        }
      }
    ).select(
      "_id referenceName pageType displayName urlName draftStatus publishStatus republishStatus"
    );

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/getElemGroup/", verify, async (req, res, next) => {
  try {
    const appl = await Element.find(
      {
        _id: { $in: req.query.id },
      },
      function (err, docs) {
        if (!err) {
          return docs;
        }
      }
    ).select(
      "_id referenceName elementType displayName urlName draftStatus publishStatus republishStatus"
    );

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

export default router;
