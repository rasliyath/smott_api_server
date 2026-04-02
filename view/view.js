import express from "express";
import App from "../models/app.js";
import jwt from "jsonwebtoken";
import { viewVerify } from "../routes/verifyToken.js";
import createError from "http-errors";
import Color from "../models/colorTypes.js";
import Menu from "../models/menu.js";
import Page from "../models/pages.js";
import Footer from "../models/footer.js";
import Branding from "../models/brandingTypes.js";
import Setting from "../models/settings.js";
import mongoose from "mongoose";
import api from "api";
import Element from "../models/elements.js";
import TickerPage from "../models/tickerRefer.js";
import fetch from "node-fetch";
import redis from "redis";
import dotenv from "dotenv";
import elements from "../models/elements.js";
import Font from "../models/fontTypes.js";
import WebSetting from "../models/webSettings.js";
import AppSetting from "../models/appSetting.js";
import Subscription from "../models/subscribe.js";
import VideoCloud from "../models/videocloud.js";
import Analytics from "../models/analytics.js";

const sdk = api("@jwplayer/v1#2pej7e31kq8cr6iy");
const router = express.Router();
// Access Token Creation ...
//const REDIS_PORT = process.env.REDIS_PORT || 6379;
//const client = redis.createClient(REDIS_PORT);

function cache(req, res, next) {
  const path = req.path;

  client.get(path, (err, data) => {
    if (err) createError(404, "issue in Server");

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
}

function pageCache(req, res, next) {
  let limit = parseInt(req.query.limit) || 10;
  let skip = parseInt(req.query.skip) || 0;
  let path = req.path + "?limit=" + limit + "&skip=" + skip;
  client.get(path, (err, data) => {
    if (err) createError(404, "issue in Server");

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
}

router.post("/:AppId/accessToken", async (req, res, next) => {
  try {
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");
    const token = jwt.sign({ _id: AppId }, process.env.TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    res.header("Authorization", token).send(token);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.post("/:AppId/refreshToken", viewVerify, async (req, res, next) => {
  try {
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");
    const token = jwt.sign({ _id: AppId }, process.env.TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    res.header("Authorization", token).send(token);
  } catch (error) {
    // next(createError(error.status,error.message));
    console.log(error);
  }
});

router.get("/:AppId/getColor", viewVerify, async (req, res, next) => {
  try {
    const appl = await Color.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Color Schema Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getBranding", viewVerify, async (req, res, next) => {
  try {
    const appl = await Branding.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Color Schema Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getMenu", viewVerify, async (req, res, next) => {
  try {
    const appl = await Menu.find({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Menu item Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getPage", viewVerify, async (req, res, next) => {
  try {
    const appl = await Page.findOne({ _id: req.params.Id });
    if (!appl) throw createError(404, "No Page Exists for this id");
    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getLastPage", viewVerify, async (req, res, next) => {
  try {
    const appl = await Page.findOne({ _id: req.params.Id })
      .populate("portraitThumbnail")
      .populate("landscapeThumbnail")
      .populate("bannerImage");
    if (!appl) throw createError(404, "No Page Exists for this id");
    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getElement", viewVerify, async (req, res, next) => {
  try {
    const appl = await Element.findOne({ _id: req.params.Id });
    if (!appl) throw createError(404, "No Elements Exists for this id");
    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getElemDetail", viewVerify, async (req, res, next) => {
  try {
    const appl = await Element.findOne({ _id: req.params.Id });
    if (!appl) throw createError(404, "No Page Exists for this id");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:videoId/getVideo", async (req, res) => {
  const url = "https://cdn.jwplayer.com/v2/media/" + req.params.videoId;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json; charset=utf-8",
    },
  };
  await fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      res.send(json);
    })
    .catch((err) => console.error("error:" + err));
});

router.get("/:playlistId/getPlaylist", async (req, res) => {
  /*  sdk.get('/v2/media/'+req.params.videoId, {Accept: 'application/json; charset=utf-8'})
   .then(rest => res.send(rest))
   .catch(err => console.error(err)); */
  var limit = parseInt(req.query.limit) || 30;

  /*  const results= await sdk.get('/v2/playlists/'+req.params.playlistId+"?page_limit="+limit, {page_limit:limit,Accept: 'application/json; charset=utf-8'}).then((result)=>{
     return result;   
   },(error)=>{
     return error;
 });
 
 res.send(results) */

  const url =
    "https://cdn.jwplayer.com/v2/playlists/" + req.params.playlistId + "?";

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json; charset=utf-8",
    },
  };

  const params = new URLSearchParams({
    page_limit: parseInt(limit),
  });

  await fetch(url + params, options)
    .then((res) => res.json())
    .then((json) => {
      res.send(json);
    })
    .catch((err) => console.error("error:" + err));
});

router.get("/getTestPlaylist", async (req, res) => {
  /*  sdk.get('/v2/media/'+req.params.videoId, {Accept: 'application/json; charset=utf-8'})
   .then(rest => res.send(rest))
   .catch(err => console.error(err)); */
  const url = "https://cdn.jwplayer.com/v2/playlists/PUlOkCRK?";

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json; charset=utf-8",
    },
  };

  const params = new URLSearchParams({
    page_limit: 10,
  });

  await fetch(url + params, options)
    .then((res) => res.json())
    .then((json) => {
      res.send(json);
    })
    .catch((err) => console.error("error:" + err));
});

router.get("/:AppId/getBranding", viewVerify, async (req, res, next) => {
  try {
    const appl = await Subscription.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Color Schema Exists");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get(
  "/:urlName/:AppId/getFullMenu",
  viewVerify,
  async (req, res, next) => {
    try {
      const result = await Menu.aggregate(
        [
          {
            $match: {
              application: mongoose.Types.ObjectId(req.params.AppId),
              urlName: req.params.urlName,
            },
          },
          {
            $lookup: {
              from: Page.collection.name, // collection to join
              localField: "menuPage", //field from the input documents
              foreignField: "_id", //field from the documents of the "from" collection
              as: "page", // output array field
            },
          },
        ],
        function (error, data) {
          if (error) throw createError(404, "No App Exists for this id");
          return data;
          //handle error case also
        }
      );

      if (result && result[0].page[0]?.pageType === "normalPage") {
        const appl = await Page.populate(result[0], {
          path: "items",
          populate: {
            path: "itemid",
            model: "Element",
          },
        });
        //client.setex(req.path, process.env.REDIS_TIME, JSON.stringify(appl));
        res.send(appl);
      } else {
        //client.setex(req.path, process.env.REDIS_TIME, JSON.stringify(result));
        res.send(result);
      }
    } catch (error) {
      next(createError(error.status, error.message));
    }
  }
);

router.get(
  "/:urlName/:AppId/getUrlPageItem",
  viewVerify,
  async (req, res, next) => {
    try {
      const result = await Page.aggregate(
        [
          {
            $match: {
              application: mongoose.Types.ObjectId(req.params.AppId),
              urlName: req.params.urlName,
            },
          },
          { $sort: { "items.itemOrder": 1 } },
          { $limit: 2 },
          { $skip: 0 },
        ],
        function (error, data) {
          if (error) throw createError(404, "No App Exists for this id");
          return data;
          //handle error case also
        }
      );

      if (result && result[0]?.pageType === "normalPage") {
        const appl = await Page.populate(result[0], [
          {
            path: "items",
            populate: {
              path: "itemid",
              model: "Element",

              populate: [
                {
                  path: "bannerImage",
                  model: "Image",
                },
                {
                  path: "landscapeThumbnail",
                  model: "Image",
                },
                {
                  path: "portraitThumbnail",
                  model: "Image",
                },
              ],
            },
          },
          {
            path: "bannerImage",
            model: "Image",
          },
          {
            path: "landscapeThumbnail",
            model: "Image",
          },
          {
            path: "portraitThumbnail",
            model: "Image",
          },
        ]);

        res.send(appl);
      } else {
        const appl = await Page.populate(result[0], [
          { path: "bannerImage", model: "Image" },
          { path: "landscapeThumbnail", model: "Image" },
          { path: "portraitThumbnail", model: "Image" },
        ]);
        res.send(appl);
      }
    } catch (error) {
      next(createError(error.status, error.message));
    }
  }
);

router.get("/:AppId/:Id/getPageItem", viewVerify, async (req, res, next) => {
  try {
    const result = await Page.aggregate(
      [
        {
          $match: {
            application: mongoose.Types.ObjectId(req.params.AppId),
            _id: mongoose.Types.ObjectId(req.params.Id),
          },
        },
      ],
      function (error, data) {
        if (error) throw createError(404, "No App Exists for this id");
        return data;
        //handle error case also
      }
    );

    if (result & (result[0]?.pageType === "normalPage")) {
      const appl = await Element.populate(result[0], [
        {
          path: "items",
          populate: {
            path: "itemid",
            model: "Element",

            populate: [
              {
                path: "bannerImage",
                model: "Image",
              },
              {
                path: "landscapeThumbnail",
                model: "Image",
              },
              {
                path: "portraitThumbnail",
                model: "Image",
              },
            ],
          },
        },
        {
          path: "bannerImage",
          model: "Image",
        },
        {
          path: "landscapeThumbnail",
          model: "Image",
        },
        {
          path: "portraitThumbnail",
          model: "Image",
        },
      ]);

      res.send(appl);
    } else {
      const appl = await Page.populate(result[0], {
        path: "bannerImage",
        model: "Image",
      });
      res.send(appl);
    }
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getFullPageDetails", viewVerify, async (req, res, next) => {
  try {
    const appl = await Page.findOne({ _id: req.params.Id }).populate({
      path: "items",
      populate: {
        path: "itemid",
        model: "Element",
      },
    });
    if (!appl) throw createError(404, "No Page Exists for this id");
    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get(
  "/:AppId/:Id/getFullURLPageDetails",
  viewVerify,
  async (req, res, next) => {
    try {
      const appl = await Page.findOne({
        urlName: req.params.Id,
        application: req.params.AppId,
      }).populate({
        path: "items",
        populate: {
          path: "itemid",
          model: "Element",
        },
      });
      if (!appl) throw createError(404, "No Page Exists for this id");
      res.send(appl);
    } catch (error) {
      next(createError(error.status, error.message));
    }
  }
);

router.get("/:Id/getElemFullDetail", viewVerify, async (req, res, next) => {
  try {
    const appl = await Element.findOne({ _id: req.params.Id })
      .populate({
        path: "items",
        populate: {
          path: "itemid",
          model: "Page",
          populate: [
            {
              path: "bannerImage",
              model: "Image",
            },
            {
              path: "landscapeThumbnail",
              model: "Image",
            },
            {
              path: "portraitThumbnail",
              model: "Image",
            },
          ],
        },
      })
      .populate("portraitThumbnail")
      .populate("landscapeThumbnail")
      .populate("bannerImage")
      .populate("tab1Container")
      .populate("tab2Container")
      .populate("tab3Container")
      .populate("viewAllPage");
    if (!appl) throw createError(404, "No Elements Exists for this id");

    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getTabFullDetail", viewVerify, async (req, res, next) => {
  try {
    const appl = await Element.findOne({ _id: req.params.Id });

    if (!appl) throw createError(404, "No Tab Exists for this id");

    const elem = await Element.populate(appl, [
      {
        path: "items",
        populate: {
          path: "itemid",
          model: "Element",

          populate: [
            {
              path: "bannerImage",
              model: "Image",
            },
            {
              path: "landscapeThumbnail",
              model: "Image",
            },

            {
              path: "portraitThumbnail",
              model: "Image",
            },
            {
              path: "viewAllPage",
              model: "Page",
            },

            {
              path: "items",

              populate: {
                path: "itemid",
                model: "Page",
                populate: [
                  {
                    path: "bannerImage",
                    model: "Image",
                  },
                  {
                    path: "landscapeThumbnail",
                    model: "Image",
                  },
                  {
                    path: "portraitThumbnail",
                    model: "Image",
                  },
                ],
              },
            },
          ],
        },
      },
      {
        path: "bannerImage",
        model: "Image",
      },
      {
        path: "landscapeThumbnail",
        model: "Image",
      },
      {
        path: "portraitThumbnail",
        model: "Image",
      },
    ]);
    //client.setex(req.path, process.env.REDIS_TIME, JSON.stringify(elem));

    res.send(elem);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/:Id/getPageTicker", viewVerify, async (req, res, next) => {
  try {
    const imageCount = await TickerPage.countDocuments({
      page: req.params.Id,
      application: req.params.AppId,
    });
    if (imageCount > 0) {
      const appl = await TickerPage.findOne({
        page: req.params.Id,
        application: req.params.AppId,
      }).populate("ticker");
      if (!appl) throw createError(404, "No Tickers Exists for this id");
      //client.setex(req.path, process.env.REDIS_TIME, JSON.stringify(appl));
      res.send(appl);
    } else {
      res.status(204).send("No Tickers Exists for this Page");
    }
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

//URL Name
router.get(
  "/:urlName/:AppId/getUrlFullItem",
  viewVerify,
  async (req, res, next) => {
    var limit = parseInt(req.query.limit) || 10;
    var skip = parseInt(req.query.skip) || 0;

    try {
      const result = await Page.aggregate(
        [
          {
            $match: {
              application: mongoose.Types.ObjectId(req.params.AppId),
              urlName: req.params.urlName,
              draftStatus: true,
            },
          },
          {
            $addFields: {
              itemCount: { $size: "$items" },
              items: { $slice: ["$items", skip, limit] },
            },
          },
          {
            $project: {
              referenceName: 0,
              editedBy: 0,
              editedDate: 0,
            },
          },
          { $sort: { "items.itemOrder": 1 } },
          /*  { "$limit": 2 },
             { "$skip": 0 } */
        ],
        function (error, data) {
          if (error) throw createError(404, "No App Exists for this id");
          return data;
          //handle error case also
        }
      );

      console.log("geturlfullitem");
      console.log(result);

      if (result && result && result[0]?.pageType === "normalPage") {
        const appl = await Page.populate(result[0], [
          {
            path: "items",
            match: { elementType: { $ne: "tabItem" } },
            populate: {
              path: "itemid",
              model: "Element",

              populate: [
                {
                  path: "bannerImage",
                  model: "Image",
                },
                {
                  path: "landscapeThumbnail",
                  model: "Image",
                },

                {
                  path: "portraitThumbnail",
                  model: "Image",
                },
                {
                  path: "viewAllPage",
                  model: "Page",
                },

                {
                  path: "items",

                  populate: {
                    path: "itemid",
                    model: "Page",
                    populate: [
                      {
                        path: "bannerImage",
                        model: "Image",
                      },
                      {
                        path: "landscapeThumbnail",
                        model: "Image",
                      },
                      {
                        path: "portraitThumbnail",
                        model: "Image",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            path: "bannerImage",
            model: "Image",
          },
          {
            path: "landscapeThumbnail",
            model: "Image",
          },
          {
            path: "portraitThumbnail",
            model: "Image",
          },
        ]);

        //client.setex(req.path+"?limit="+limit+"&skip="+skip, process.env.REDIS_TIME, JSON.stringify(appl));
        //res.setHeader('cache-control', 'max-age=100, max-stale=180');
        res.send(appl);
      } else if (
        result &&
        ((result && result[0]?.pageType === "seasonPage") ||
          result[0]?.pageType === "articlePage")
      ) {
        const appl = await Page.populate(result[0], [
          { path: "bannerImage", model: "Image" },
          { path: "landscapeThumbnail", model: "Image" },
          { path: "portraitThumbnail", model: "Image" },
          {
            path: "recommendation",
            model: "Element",

            populate: [
              {
                path: "bannerImage",
                model: "Image",
              },
              {
                path: "landscapeThumbnail",
                model: "Image",
              },

              {
                path: "portraitThumbnail",
                model: "Image",
              },
              {
                path: "viewAllPage",
                model: "Page",
              },

              {
                path: "items",

                populate: {
                  path: "itemid",
                  model: "Page",
                  populate: [
                    {
                      path: "bannerImage",
                      model: "Image",
                    },
                    {
                      path: "landscapeThumbnail",
                      model: "Image",
                    },
                    {
                      path: "portraitThumbnail",
                      model: "Image",
                    },
                  ],
                },
              },
            ],
          },
        ]);
        //client.setex(req.path+"?limit="+limit+"&skip="+skip, process.env.REDIS_TIME, JSON.stringify(appl));
        //res.setHeader('cache-control', 'max-age=100, max-stale=180');
        res.send(appl);
      } else {
        const appl = await Page.populate(result[0], [
          { path: "bannerImage", model: "Image" },
          { path: "landscapeThumbnail", model: "Image" },
          { path: "portraitThumbnail", model: "Image" },
        ]);
        //client.setex(req.path+"?limit="+limit+"&skip="+skip, process.env.REDIS_TIME, JSON.stringify(appl));
        //res.setHeader('cache-control', 'max-age=100, max-stale=180');
        res.send(appl);
      }
    } catch (error) {
      next(createError(error.status, error.message));
    }
  }
);

router.get(
  "/:urlName/:AppId/getUrlLazyItem",
  viewVerify,
  async (req, res, next) => {
    var limit = parseInt(req.query.limit) || 10;
    var skip = parseInt(req.query.skip) || 0;

    try {
      const result = await Page.aggregate(
        [
          {
            $match: {
              application: mongoose.Types.ObjectId(req.params.AppId),
              urlName: req.params.urlName,
            },
          },
          {
            $addFields: {
              itemCount: { $size: "$items" },
              items: { $slice: ["$items", skip, limit] },
            },
          },
          {
            $project: {
              referenceName: 0,
              portraitThumbnail: 0,
              landscapeThumbnail: 0,
              editedBy: 0,
              editedDate: 0,
              bannerImage: 0,
              genre: 0,
              starring: 0,
              tag: 0,
              rating: 0,
              description: 0,
              author: 0,
              mainHeader: 0,
              externalPage: 0,
              livePage: 0,
              internalPage: 0,
              blockQuote: 0,
              sectionHeader1: 0,
              sectionHeader2: 0,
              introduction: 0,
              sectionDescription1: 0,
              sectionDescription2: 0,
              contentType: 0,
              videoId: 0,
              audio: 0,
              director: 0,
              producer: 0,
              studio: 0,
              writer: 0,
              cite: 0,
              recommendation: 0,
              devices: 0,
              draftStatus: 0,
              publishStatus: 0,
              publishDate: 0,
              displayName: 0,
            },
          },
          { $sort: { "items.itemOrder": 1 } },
          /*  { "$limit": 2 },
             { "$skip": 0 } */
        ],
        function (error, data) {
          if (error) throw createError(404, "No App Exists for this id");
          return data;
          //handle error case also
        }
      );

      if (result && result && result[0]?.pageType === "normalPage") {
        const appl = await Page.populate(result[0], [
          {
            path: "items",
            match: { elementType: { $ne: "tabItem" } },
            populate: {
              path: "itemid",
              model: "Element",

              populate: [
                {
                  path: "bannerImage",
                  model: "Image",
                },
                {
                  path: "landscapeThumbnail",
                  model: "Image",
                },

                {
                  path: "portraitThumbnail",
                  model: "Image",
                },
                {
                  path: "viewAllPage",
                  model: "Page",
                },

                {
                  path: "items",

                  populate: {
                    path: "itemid",
                    model: "Page",
                    populate: [
                      {
                        path: "bannerImage",
                        model: "Image",
                      },
                      {
                        path: "landscapeThumbnail",
                        model: "Image",
                      },
                      {
                        path: "portraitThumbnail",
                        model: "Image",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            path: "bannerImage",
            model: "Image",
          },
          {
            path: "landscapeThumbnail",
            model: "Image",
          },
          {
            path: "portraitThumbnail",
            model: "Image",
          },
        ]);

        //client.setex(req.path+"?limit="+limit+"&skip="+skip, process.env.REDIS_TIME, JSON.stringify(appl));

        // res.setHeader('cache-control', 'max-age=100, max-stale=180');
        res.send(appl);
      } else {
        const appl = await Page.populate(result[0], {
          path: "bannerImage",
          model: "Image",
        });
        //client.setex(req.path+"limit="+limit+"&skip="+skip, process.env.REDIS_TIME, JSON.stringify(appl));
        // res.setHeader('cache-control', 'max-age=100, max-stale=180');
        res.send(appl);
      }
    } catch (error) {
      next(createError(error.status, error.message));
    }
  }
);

router.get(
  "/:AppId/:Id/getPageFullItem",
  viewVerify,
  async (req, res, next) => {
    var limit = parseInt(req.query.limit) || 10;
    var skip = parseInt(req.query.skip) || 0;

    try {
      const result = await Page.aggregate(
        [
          {
            $match: {
              application: mongoose.Types.ObjectId(req.params.AppId),
              _id: mongoose.Types.ObjectId(req.params.Id),
              draftStatus: true,
            },
          },
          {
            $addFields: {
              itemCount: { $size: "$items" },
              items: { $slice: ["$items", skip, limit] },
            },
          },
          {
            $project: {
              referenceName: 0,
              editedBy: 0,
              editedDate: 0,
            },
          },
          { $sort: { "items.itemOrder": 1 } },
          /*  { "$limit": 2 },
             { "$skip": 0 } */
        ],
        function (error, data) {
          if (error) throw createError(404, "No App Exists for this id");
          return data;
          //handle error case also
        }
      );

      if (result && result[0]?.pageType === "normalPage") {
        const appl = await Page.populate(result[0], [
          {
            path: "items",
            match: { elementType: { $ne: "tabItem" } },
            populate: {
              path: "itemid",
              model: "Element",

              populate: [
                {
                  path: "bannerImage",
                  model: "Image",
                },
                {
                  path: "landscapeThumbnail",
                  model: "Image",
                },

                {
                  path: "portraitThumbnail",
                  model: "Image",
                },
                {
                  path: "viewAllPage",
                  model: "Page",
                },

                {
                  path: "items",

                  populate: {
                    path: "itemid",
                    model: "Page",
                    populate: [
                      {
                        path: "bannerImage",
                        model: "Image",
                      },
                      {
                        path: "landscapeThumbnail",
                        model: "Image",
                      },
                      {
                        path: "portraitThumbnail",
                        model: "Image",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            path: "bannerImage",
            model: "Image",
          },
          {
            path: "landscapeThumbnail",
            model: "Image",
          },
          {
            path: "portraitThumbnail",
            model: "Image",
          },
        ]);

        //client.setex(req.path+"?limit="+limit+"&skip="+skip, process.env.REDIS_TIME, JSON.stringify(appl));

        // res.setHeader('cache-control', 'max-age=100, max-stale=180');
        res.send(appl);
      } else if (
        result &&
        (result[0]?.pageType === "seasonPage" ||
          result[0]?.pageType === "articlePage")
      ) {
        const appl = await Page.populate(result[0], [
          { path: "bannerImage", model: "Image" },
          { path: "landscapeThumbnail", model: "Image" },
          { path: "portraitThumbnail", model: "Image" },
          {
            path: "recommendation",
            model: "Element",

            populate: [
              {
                path: "bannerImage",
                model: "Image",
              },
              {
                path: "landscapeThumbnail",
                model: "Image",
              },

              {
                path: "portraitThumbnail",
                model: "Image",
              },
              {
                path: "viewAllPage",
                model: "Page",
              },

              {
                path: "items",

                populate: {
                  path: "itemid",
                  model: "Page",
                  populate: [
                    {
                      path: "bannerImage",
                      model: "Image",
                    },
                    {
                      path: "landscapeThumbnail",
                      model: "Image",
                    },
                    {
                      path: "portraitThumbnail",
                      model: "Image",
                    },
                  ],
                },
              },
            ],
          },
        ]);
        //client.setex(req.path+"?limit="+limit+"&skip="+skip, process.env.REDIS_TIME, JSON.stringify(appl));
        // res.setHeader('cache-control', 'max-age=100, max-stale=180');
        res.send(appl);
      } else {
        const appl = await Page.populate(result[0], [
          { path: "bannerImage", model: "Image" },
          { path: "landscapeThumbnail", model: "Image" },
          { path: "portraitThumbnail", model: "Image" },
        ]);
        //client.setex(req.path+"?limit="+limit+"&skip="+skip, process.env.REDIS_TIME, JSON.stringify(appl));
        // res.setHeader('cache-control', 'max-age=100, max-stale=180');
        res.send(appl);
      }
    } catch (error) {
      next(createError(error.status, error.message));
    }
  }
);

router.get("/:Id/getSharePage", async (req, res, next) => {
  try {
    const appl = await Page.findOne(
      { _id: req.params.Id, draftStatus: true },
      {
        description: 1,
        displayName: 1,
        landscapeThumbnail: 1,
        bannerImage: 1,
        _id: 1,
        urlName: 1,
        pageType: 1,
        introduction: 1,
      }
    )
      .populate("landscapeThumbnail")
      .populate("bannerImage");
    if (!appl) throw createError(404, "No Page Exists for this id");
    res.setHeader("cache-control", "max-age=200, max-stale=180");
    res.send(appl);
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getTestSetup", async (req, res, next) => {
  var resources = {
    _id: "$_id",
  };
  try {
    App.aggregate(
      [
        {
          $match: { _id: mongoose.Types.ObjectId(req.params.AppId) },
        },
        {
          $lookup: {
            from: Color.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: "color", // output array field
          },
        },
        {
          $lookup: {
            from: Branding.collection.name, // from collection name
            localField: "_id",
            foreignField: "application",
            as: "branding",
          },
        },
        {
          $lookup: {
            from: Menu.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: "menu", // output array field
          },
        },
        {
          $lookup: {
            from: Setting.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: "setting", // output array field
          },
        },
      ],
      function (error, data) {
        if (error) {
          throw createError(404, "No App Exists for this id");
        }
        //client.setex(req.path, process.env.REDIS_TIME, JSON.stringify(data));
        return res.json(data);
        //handle error case also
      }
    );
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:AppId/getAppSetup", viewVerify, async (req, res, next) => {
  var device = req.query.device === "app" ? "appsetting" : "websetting";

  var resources = {
    _id: "$_id",
  };
  try {
    App.aggregate(
      [
        {
          $match: { _id: mongoose.Types.ObjectId(req.params.AppId) },
        },
        {
          $lookup: {
            from: Color.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: "color", // output array field
          },
        },
        {
          $lookup: {
            from: Branding.collection.name, // from collection name
            localField: "_id",
            foreignField: "application",
            as: "branding",
          },
        },
        {
          $lookup: {
            from: Menu.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: "menu", // output array field
          },
        },
        {
          $lookup: {
            from: Footer.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: "footer", // output array field
          },
        },
        {
          $lookup: {
            from: Font.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: "font", // output array field
          },
        },

        {
          $lookup: {
            from: Setting.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: "setting", // output array field
          },
        },
        {
          $lookup: {
            from: VideoCloud.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: "videocloud", // output array field
          },
        },
        {
          $lookup: {
            from: Subscription.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: "subscription", // output array field
          },
        },
        {
          $lookup: {
            from: Analytics.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: "analytics", // output array field
          },
        },
        {
          $lookup: {
            from:
              req.query.device === "app"
                ? AppSetting.collection.name
                : WebSetting.collection.name, // collection to join
            localField: "_id", //field from the input documents
            foreignField: "application", //field from the documents of the "from" collection
            as: device, // output array field
          },
        },
      ],
      function (error, data) {
        if (error) {
          throw createError(404, "No App Exists for this id");
        }
        //client.setex(req.path,process.env.REDIS_MAX_TIME, JSON.stringify(data));
        //res.setHeader('cache-control', 'max-age=200, max-stale=180');
        return res.json(data);
        //handle error case also
      }
    );
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

export default router;
