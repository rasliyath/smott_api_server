import express from "express";
import { verify } from "../routes/verifyToken.js";
import App from "../models/app.js";
import Page from "../models/pages.js";
import Element from "../models/elements.js";
import createError from "http-errors";
import gplay from "google-play-scraper";
import store  from "app-store-scraper";



const router = express.Router();

router.get("/:Id/getGeneralMonthStats", async (req, res, next) => {
  try {
    const appl = await App.findOne({ _id: req.params.Id });
    if (!appl) throw createError(404, "No APP Exists for this id");

    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);

    const startOfNextMonth = new Date();
    startOfNextMonth.setDate(1);
    startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);

    const page_count = await Page.find({
      $and: [
        {
          application: appl._id,
        },
        {
        createdDate: {
            $gte: startOfCurrentMonth,
            $lt: startOfNextMonth,
          },
        },
      ],
    }).countDocuments();

    const element_count = await Element.find({
        $and: [
          {
            application: appl._id,
          },
          {
          createdDate: {
              $gte: startOfCurrentMonth,
              $lt: startOfNextMonth,
            },
          },
        ],
      }).countDocuments();

      const page_pub_count = await Page.find({
        $and: [
          {
            application: appl._id,
            publishStatus:true
          },
          {
          editedDate: {
              $gte: startOfCurrentMonth,
              $lt: startOfNextMonth,
            },
          },
        ],
      }).countDocuments();

      const elem_pub_count = await Element.find({
        $and: [
          {
            application: appl._id,
            publishStatus:true
          },
          {
          editedDate: {
              $gte: startOfCurrentMonth,
              $lt: startOfNextMonth,
            },
          },
        ],
      }).countDocuments();



    res.send({pageCount:page_count,elemCount:element_count,publishedPageCount:page_pub_count,elemPageCount:elem_pub_count});
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getThreeMonthStats", async (req, res, next) => {
  try {
    const appl = await App.findOne({ _id: req.params.Id });
    if (!appl) throw createError(404, "No APP Exists for this id");

    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);



    const startOfNextMonth = new Date();
    startOfNextMonth.setDate(1);
    startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
    startOfCurrentMonth.setMonth(startOfNextMonth.getMonth() - 4)

    const page_count = await Page.find({
      $and: [
        {
          application: appl._id,
        },
        {
        createdDate: {
            $gte: startOfCurrentMonth,
            $lt: startOfNextMonth,
          },
        },
      ],
    }).countDocuments();

    const element_count = await Element.find({
        $and: [
          {
            application: appl._id,
          },
          {
          createdDate: {
              $gte: startOfCurrentMonth,
              $lt: startOfNextMonth,
            },
          },
        ],
      }).countDocuments();

      const page_pub_count = await Page.find({
        $and: [
          {
            application: appl._id,
            publishStatus:true
          },
          {
          editedDate: {
              $gte: startOfCurrentMonth,
              $lt: startOfNextMonth,
            },
          },
        ],
      }).countDocuments();

      const elem_pub_count = await Element.find({
        $and: [
          {
            application: appl._id,
            publishStatus:true
          },
          {
          editedDate: {
              $gte: startOfCurrentMonth,
              $lt: startOfNextMonth,
            },
          },
        ],
      }).countDocuments();



    res.send({pageCount:page_count,elemCount:element_count,publishedPageCount:page_pub_count,publishedElemCount:elem_pub_count});
  } catch (error) {
    next(createError(error.status, error.message));
  }
});


router.get("/:Id/getTotalStats", async (req, res, next) => {
  try {
    const appl = await App.findOne({ _id: req.params.Id });
    if (!appl) throw createError(404, "No APP Exists for this id");

    

    const page_count = await Page.find({
      $and: [
        {
          application: appl._id,
        }
      ],
    }).countDocuments();

    const element_count = await Element.find({
        $and: [
          {
            application: appl._id,
          }
        ],
      }).countDocuments();

      const page_pub_count = await Page.find({
        $and: [
          {
            application: appl._id,
            publishStatus:true
          }
        ],
      }).countDocuments();

      const elem_pub_count = await Element.find({
        $and: [
          {
            application: appl._id,
            publishStatus:true
          },
        ],
      }).countDocuments();



    res.send({pageCount:page_count,elemCount:element_count,publishedPageCount:page_pub_count,publishedElemCount:elem_pub_count});
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

router.get("/:Id/getAppdownloads", async (req, res, next) => {
    try {
      const appl = await gplay.app({appId: 'com.netflix.mediaclient'}).then((result)=>{
        const {minInstalls,maxInstalls,installs,score,scoreText} =result
        return {minInstalls,maxInstalls,installs,score,scoreText};
      });
      if (!appl) throw createError(404, "No APP Exists for this id");
  
      const apps = await store.app({id: '363590051',ratings: true}).then((result)=>{
        const {score,reviews,currentVersionReviews,ratings} = result;
        return {score,reviews,currentVersionReviews,ratings};
      });
      if (!apps) throw createError(404, "No APP Exists for this id");

      const apptv = await gplay.app({appId: 'com.netflix.ninja'}).then((result)=>{
        const {minInstalls,maxInstalls,installs,score,scoreText} =result
        return {minInstalls,maxInstalls,installs,score,scoreText};
      });
      if (!apptv) throw createError(404, "No APP Exists for this id");

      
  
  
      res.send({google:appl,apple:apps,androidTv:apptv});
    } catch (error) {
      next(createError(error.status, error.message));
    }
  });
  

export default router;
