import data_obj from "./data/data.js";
import express, { application } from "express";
import { verify } from "../routes/verifyToken.js";
import createError from "http-errors";
import { passwordValidation } from "../validation.js";
import logger from '../logger/index.js';
import App from "../models/app.js";
import Image from "../models/images.js"
import imageSchema from "./models/images.js";
import fileSchema from "./models/files.js";
import pageSchema from "./models/pages.js";
import elementSchema from "./models/elements.js";
import colorSchema from "./models/colorTypes.js";
import fontSchema from "./models/fontTypes.js";
import menuSchema from "./models/menu.js";
import footerSchema from "./models/footer.js";
import brandingSchema from "./models/brandingTypes.js";
import videoCloudSchema from "./models/videocloud.js";
import webSettingSchema from "./models/webSettings.js";
import appSettingSchema from "./models/appSetting.js";
import settingSchema from "./models/settings.js";
import monetizeSchema from "./models/monetize.js";
import subscribeSchema from "./models/subscribe.js";
import analyticsSchema from "./models/analytics.js";
import tickerSchema from "./models/ticker.js";
import tickerRefSchema from "./models/tickerRefer.js";
import File from "../models/files.js";
import mongoose from 'mongoose';
import {getDatabaseConnection} from "../connections/connection.js";
import Page from "../models/pages.js";
import Element from "../models/elements.js";
import Color from "../models/colorTypes.js";
import Branding from "../models/brandingTypes.js";
import Menu from "../models/menu.js";
import Ticker from "../models/ticker.js";
import TickerPage from "../models/tickerRefer.js";
import Setting from "../models/settings.js";
import Analytics from "../models/analytics.js";
import WebSetting from "../models/webSettings.js";
import AppSetting from "../models/appSetting.js";
import Monetize from "../models/monetize.js";
import Footer from "../models/footer.js";
import Font from "../models/fontTypes.js";
import Subscription from "../models/subscribe.js";
import Videocloud from "../models/videocloud.js";


const router = express.Router();
let pub_con = null;


router.param('AppId', function(req, res, next, AppId) {

  const db_name =data_obj.filter(function(app) {
    return app.application == AppId;
  });
   //pub_con= db_name[0].same_cluster?mongoose.connection.useDb(db_name[0].db_name):getDatabaseConnection(db_name[0].url_name,db_name[0].db_name);

   pub_con = getDatabaseConnection(db_name[0].url_name,db_name[0].db_name);

  
  next();

  
 



});

router.get('/:AppId/getImages', async function(req, res) {

 
  
  try
  {
      const appl= await Image.find({application:req.params.AppId});
      //const appl= await image_model.find();
      if(!appl) throw createError(404,"No Image Exists for this id");
      res.send(appl);
  }

  catch(error)
  {
      next(createError(error.status,error.message));
  }
 
});


router.get('/:AppId/getData', async function(req, res) {

  const image_model = pub_con.model('Image', imageSchema);
  
  try
  {
      const appl= await image_model.find({application:req.params.AppId});
      //const appl= await image_model.find();
      if(!appl) throw createError(404,"No Image Exists for this id");
      res.send(appl);
  }

  catch(error)
  {
      next(createError(error.status,error.message));
  }
 
});


router.post("/:AppId/migrateImages", verify, async (req, res, next) => {

  try {
      const appObject= await Image.find({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const image_model = pub_con.model('Image', imageSchema);
      //const file_model = pub_con.model('File',fileSchema);

     const result = await image_model.insertMany(appObject);
    
      logger.info(JSON.stringify(result));
      res.send("successfully Done"); 
      
      //const fileRes = await file_model.insertMany(appObject);
      //res.send(JSON.stringify(fileRes,'','\t'));





  }
  catch(error)
  {
    next(createError(error.status, error.message));
  }

});

router.post("/:AppId/migrateFile", verify, async (req, res, next) => {

  try {
      const appObject= await File.find({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const image_model = pub_con.model('Image', imageSchema);
      const file_model = pub_con.model('File',fileSchema);

     /*  const result = await image_model.insertMany(appObject);
      res.send(JSON.stringify(result,'','\t')); */
      
      const fileRes = await file_model.insertMany(appObject);
      res.send("Successfully Migrated Files");


  }
  catch(error)
  {
    next(createError(error.status, error.message));
  }

});


router.post("/:AppId/publishColors", verify, async (req, res, next) => {

  try {
      const appObject= await Color.findOne({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const color_model = pub_con.model('Color',colorSchema);

     /*  const result = await image_model.insertMany(appObject);
      res.send(JSON.stringify(result,'','\t')); */
      const color_res = await color_model.findOneAndUpdate(
        { application: mongoose.Types.ObjectId(req.params.AppId) },
        {
          $set: appObject,
        },
        {upsert: true },
        function (error) {
          if (error) {
            throw createError(
              400,
              "Color Schema does not Exist for this application"
            );
          } else {
            res.send("Successfully Published Color");
          }
        }
      );
    
      
      
     


  }
  catch(error)
  {
    next(createError(error.status, error.message));
  }

});

router.post("/:AppId/publishFonts", verify, async (req, res, next) => {

  try {
      const appObject= await Font.findOne({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const font_model = pub_con.model('Font',fontSchema);

     /*  const result = await image_model.insertMany(appObject);
      res.send(JSON.stringify(result,'','\t')); */
      const font_res = await font_model.findOneAndUpdate(
        { application: mongoose.Types.ObjectId(req.params.AppId) },
        {
          $set: appObject,
        },
        {upsert: true },
        function (error) {
          if (error) {
            throw createError(
              400,
              "Font Schema does not Exist for this application"
            );
          } else {
            res.send("Successfully Published Font");
          }
        }
      );
    
      
      
     


  }
  catch(error)
  {
    
    next(createError(error.status, error.message));
  }

});


router.post("/:AppId/publishBranding", verify, async (req, res, next) => {

  try {
      const appObject= await Branding.findOne({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const branding_model = pub_con.model('Branding',brandingSchema);

     /*  const result = await image_model.insertMany(appObject);
      res.send(JSON.stringify(result,'','\t')); */
      const font_res = await branding_model.findOneAndUpdate(
        { application: mongoose.Types.ObjectId(req.params.AppId) },
        {
          $set: appObject,
        },
        {upsert: true },
        function (error) {
          if (error) {
            throw createError(
              400,
              "Branding Schema does not Exist for this application"
            );
          } else {
            res.send("Successfully Published Branding");
          }
        }
      );
    
      
      
     


  }
  catch(error)
  {
    next(createError(error.status, error.message));
  }

});

router.post("/:AppId/publishMenu",verify, async (req, res, next) => {

  try {
      const appObject= await Menu.find({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const menu_model = pub_con.model('Menu',menuSchema);

     /*  let bulkUpdate = menu_model.collection.initializeUnorderedBulkOp();

      //myItems is your array of items
      _.forEach(appObject, (item) => {
          if (item !== null) {
              let newItem = new menu_model(item);
              bulkUpdate.find({ _id: newItem.yyy }).upsert().updateOne(newItem);
          }
      });

      await bulkUpdate.execute(); */

      const font_res = await menu_model.collection.bulkWrite(appObject.map(doc => ({
        updateOne: {
            filter: {'_id': doc._id},
            update: {
              $set: doc,
            },
            upsert: true,
        }
    })))

     /*  const result = await image_model.insertMany(appObject);
      res.send(JSON.stringify(result,'','\t')); */

         res.send("Successfully Published Menu");
        
    /* 
      const font_res = await menu_model.findOneAndUpdate(
        { application: mongoose.Types.ObjectId(req.params.AppId) },
        {
          $set: appObject,
        },
        {upsert: true },
        function (error) {
          if (error) {
            throw createError(
              400,
              "Menu Schema does not Exist for this application"
            );
          } else {
            res.send("Successfully Published Menu");
          }
        }
      );
     */
      
      
     


  }
  catch(error)
  {
    next(createError(error.status, error.message));
  }

});

router.post("/:AppId/publishFooter", verify, async (req, res, next) => {

  try {
      const appObject= await Footer.findOne({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const footer_model = pub_con.model('Footer',footerSchema);

     /*  const result = await image_model.insertMany(appObject);
      res.send(JSON.stringify(result,'','\t')); */
      const footer_res = await footer_model.findOneAndUpdate(
        { application: mongoose.Types.ObjectId(req.params.AppId) },
        {
          $set: appObject,
        },
        {upsert: true },
        function (error) {
          if (error) {
            throw createError(
              400,
              "Footer Schema does not Exist for this application"
            );
          } else {
            res.send("Successfully Published Footer");
          }
        }
      );
    
      
      
     


  }
  catch(error)
  {
    next(createError(error.status, error.message));  
  }

});


router.post("/:AppId/publishWebSetting", verify, async (req, res, next) => {

  try {
      const appObject= await WebSetting.findOne({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const webSetting_model = pub_con.model('WebSetting',webSettingSchema);

     /*  const result = await image_model.insertMany(appObject);
      res.send(JSON.stringify(result,'','\t')); */
      const footer_res = await webSetting_model.findOneAndUpdate(
        { application: mongoose.Types.ObjectId(req.params.AppId) },
        {
          $set: appObject,
        },
        {upsert: true },
        function (error) {
          if (error) {
            throw createError(
              400,
              "Web Setting Schema does not Exist for this application"
            );
          } else {
            res.send("Successfully Published Web Setting");
          }
        }
      );
    
      
      
     


  }
  catch(error)
  {
    next(createError(error.status, error.message)); 
  }

});

router.post("/:AppId/publishSetting", verify, async (req, res, next) => {

  try {
      const appObject= await Setting.findOne({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const setting_model = pub_con.model('Setting',settingSchema);

     /*  const result = await image_model.insertMany(appObject);
      res.send(JSON.stringify(result,'','\t')); */
      const footer_res = await setting_model.findOneAndUpdate(
        { application: mongoose.Types.ObjectId(req.params.AppId) },
        {
          $set: appObject,
        },
        {upsert: true },
        function (error) {
          if (error) {
            throw createError(
              400,
              "Setting Schema does not Exist for this application"
            );
          } else {
            res.send("Successfully Published  Setting");
          }
        }
      );
    
      
      
     


  }
  catch(error)
  {
    next(createError(error.status, error.message)); 
  }

});



router.post("/:AppId/publishappSetting", verify, async (req, res, next) => {

  try {
      const appObject= await AppSetting.findOne({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const appSetting_model = pub_con.model('AppSetting',appSettingSchema);

     /*  const result = await image_model.insertMany(appObject);
      res.send(JSON.stringify(result,'','\t')); */
      const footer_res = await appSetting_model.findOneAndUpdate(
        { application: mongoose.Types.ObjectId(req.params.AppId) },
        {
          $set: appObject,
        },
        {upsert: true },
        function (error) {
          if (error) {
            throw createError(
              400,
              "App Setting Schema does not Exist for this application"
            );
          } else {
            res.send("Successfully Published App Setting");
          }
        }
      );
    
      
      
     


  }
  catch(error)
  {
    next(createError(error.status, error.message));  
  }

});

router.post("/:AppId/publishVideoCloud", verify, async (req, res, next) => {

  try {
      const appObject= await Videocloud.findOne({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const vc_model = pub_con.model('VideoCloud',videoCloudSchema);

     /*  const result = await image_model.insertMany(appObject);
      res.send(JSON.stringify(result,'','\t')); */
      const font_res = await vc_model.findOneAndUpdate(
        { application: mongoose.Types.ObjectId(req.params.AppId) },
        {
          $set: appObject,
        },
        {upsert: true },
        function (error) {
          if (error) {
            throw createError(
              400,
              "Video Cloud Schema does not Exist for this application"
            );
          } else {
            res.send("Video Cloud Published Menu");
          }
        }
      );
    
      
      
     


  }
  catch(error)
  {
    next(createError(error.status, error.message)); 
  }

});



router.post("/:AppId/publishMonetize", verify, async (req, res, next) => {

  try {
      const appObject= await Monetize.findOne({application:req.params.AppId});
      if(!appObject) throw createError(400,"Invalid Application Id");
      const monetize_model = pub_con.model('Monetize',monetizeSchema);

     /*  const result = await image_model.insertMany(appObject);
      res.send(JSON.stringify(result,'','\t')); */
      const font_res = await monetize_model.findOneAndUpdate(
        { application: mongoose.Types.ObjectId(req.params.AppId) },
        {
          $set: appObject,
        },
        {upsert: true },
        function (error) {
          if (error) {
            throw createError(
              400,
              "Monetize Schema does not Exist for this application"
            );
          } else {
            res.send("Successfully Published Monetize Schema");
          }
        }
      );
    
      
      
     


  }
  catch(error)
  {
    next(createError(error.status, error.message));
  }

});



router.post("/:AppId/publishSubscribe", verify, async (req, res, next) => {

  
  try {
    const appObject= await Subscription.findOne({application:req.params.AppId});
    if(!appObject) throw createError(400,"Invalid Application Id");
    const subscribe_model = pub_con.model('Subscription',subscribeSchema);

   /*  const result = await image_model.insertMany(appObject);
    res.send(JSON.stringify(result,'','\t')); */
    const font_res = await subscribe_model.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: appObject,
      },
      {upsert: true },
      function (error) {
        if (error) {
          throw createError(
            400,
            "Subscription Schema does not Exist for this application"
          );
        } else {
          res.send("Successfully Published Subscription");
        }
      }
    );
  
    
    
   


}
catch(error)
{
  next(createError(error.status, error.message)); 
}

});



router.post("/:AppId/publishAnalytics", verify, async (req, res, next) => {

  
  try {
    const appObject= await Analytics.findOne({application:req.params.AppId});
    if(!appObject) throw createError(400,"Invalid Application Id");
    const analytics_model = pub_con.model('Analytics',analyticsSchema);

   /*  const result = await image_model.insertMany(appObject);
    res.send(JSON.stringify(result,'','\t')); */
    const font_res = await analytics_model.findOneAndUpdate(
      { application: mongoose.Types.ObjectId(req.params.AppId) },
      {
        $set: appObject,
      },
      {upsert: true },
      function (error) {
        if (error) {
          throw createError(
            400,
            "Analytics Schema does not Exist for this application"
          );
        } else {
          res.send("Successfully Published Analytics");
        }
      }
    );
  
    
    
   


}
catch(error)
{
  next(createError(error.status, error.message));
}

});


router.post("/:AppId/:pageId/publishPage", verify,async (req, res, next) => {

  try {
      const pageObject = await Page.findOne({_id:req.params.pageId,application:req.params.AppId});
      if(!pageObject) throw createError(400,"Invalid Page Id");

     
      const page_model = pub_con.model('Page',pageSchema);

      const pageObj = pageObject;
      pageObj.publishStatus = true;
      pageObj.republishStatus = false;
      pageObj.publishedDate = Date.now();

      const video = await Page.findByIdAndUpdate(
        { _id: req.params.pageId },
        {
          $set: pageObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            console.log(error);
            throw createError(400, "This Page does not Exist");
          } else {
            return Appex;
          }
        }
      );


      const page_res = await page_model.findByIdAndUpdate(
        { _id: req.params.pageId },
        {
          $set: pageObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            console.log(error);
            throw createError(400, "This Page does not Exist");
          } else {
            return Appex;
          }
        }
      );

      res.send(page_res);



  }
  catch(error)
  {
    console.log(error);
    next(createError(error.status, error.message));
  }

});


router.post("/:AppId/:pageId/rePublishPage", verify, async (req, res, next) => {

  try {
      const pageObject = await Page.findOne({_id:req.params.pageId,application:req.params.AppId});
      if(!pageObject) throw createError(400,"Invalid Page Id");
      const page_model = pub_con.model('Page',pageSchema);

      const pageObj = pageObject;
      pageObj.publishStatus = true;
      pageObj.republishStatus = false;
      pageObj.publishedDate =  Date.now();

      const video = await Page.findByIdAndUpdate(
        { _id: req.params.pageId },
        {
          $set: pageObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            throw createError(400, "This Page does not Exist");
          } else {
            return Appex;
          }
        }
      );


      const page_res = await page_model.findByIdAndUpdate(
        { _id: req.params.pageId },
        {
          $set: pageObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            throw createError(400, "This Page does not Exist");
          } else {
            return Appex;
          }
        }
      );

      res.send(page_res);



  }
  catch(error)
  {
    next(createError(error.status, error.message));
  }

});

router.post("/:AppId/:elemId/publishElement", verify, async (req, res, next) => {

  try {
      const elemObject = await Element.findOne({_id:req.params.elemId,application:req.params.AppId});
      if(!elemObject) throw createError(400,"Invalid Element Id");
      const elem_model = pub_con.model('Element',elementSchema);

      const elemObj = elemObject;
      elemObj.publishStatus = true;
      elemObj.republishStatus = false;
      elemObj.publishedDate =  Date.now();
      const video = await Element.findByIdAndUpdate(
        { _id: req.params.elemId },
        {
          $set: elemObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            throw createError(400, "This Element does not Exist");
          } else {
            return Appex;
          }
        }
      );


      const page_res = await elem_model.findByIdAndUpdate(
        { _id: req.params.elemId },
        {
          $set: elemObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            throw createError(400, "This Element does not Exist");
          } else {
            return Appex;
          }
        }
      );

      res.send(page_res);



  }
  catch(error)
  {
    next(createError(error.status, error.message));
  }

});

router.post("/:AppId/:elemId/rePublishElement", verify, async (req, res, next) => {

  try {
      const elemObject = await Element.findOne({_id:req.params.elemId,application:req.params.AppId});
      if(!elemObject) throw createError(400,"Invalid Element Id");
      const elem_model = pub_con.model('Element',elementSchema);

      const elemObj = elemObject;
      elemObj.publishStatus = true;
      elemObj.republishStatus = false;
      elemObj.publishedDate =  Date.now();

      const video = await Element.findByIdAndUpdate(
        { _id: req.params.elemId },
        {
          $set: elemObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            throw createError(400, "This Element does not Exist");
          } else {
            return Appex;
          }
        }
      );


      const page_res = await elem_model.findByIdAndUpdate(
        { _id: req.params.elemId },
        {
          $set: elemObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            throw createError(400, "This Element does not Exist");
          } else {
            return Appex;
          }
        }
      );

      res.send(page_res);



  }
  catch(error)
  {
    next(createError(error.status, error.message));
  }

});



router.post("/:AppId/:pageId/unPublishPage", verify, async (req, res, next) => {

  try {
      const pageObject = await Page.findOne({_id:req.params.pageId,application:req.params.AppId});
      if(!pageObject) throw createError(400,"Invalid Page Id");
      const page_model = pub_con.model('Page',pageSchema);

      const pageObj = pageObject;
      pageObj.publishStatus = false;
      pageObj.republishStatus = false;
      const video = await Page.findByIdAndUpdate(
        { _id: req.params.pageId },
        {
          $set: pageObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            throw createError(400, "This Page does not Exist");
          } else {
            return Appex;
          }
        }
      );


      const page_res = await page_model.findByIdAndUpdate(
        { _id: req.params.pageId },
        {
          $set: pageObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            throw createError(400, "This Page does not Exist");
          } else {
            return Appex;
          }
        }
      );

      res.send(page_res);



  }
  catch(error)
  {
    next(createError(error.status, error.message));
  }

});

router.post("/:AppId/:elemId/unPublishElement", verify, async (req, res, next) => {

  try {
      const elemObject = await Element.findOne({_id:req.params.elemId,application:req.params.AppId});
      if(!elemObject) throw createError(400,"Invalid Element Id");
      const elem_model = pub_con.model('Element',elementSchema);

      const elemObj = elemObject;
      elemObj.publishStatus = false;
      elemObj.republishStatus = false;
      const video = await Element.findByIdAndUpdate(
        { _id: req.params.elemId },
        {
          $set: elemObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            throw createError(400, "This Element does not Exist");
          } else {
            return Appex;
          }
        }
      );


      const page_res = await elem_model.findByIdAndUpdate(
        { _id: req.params.elemId },
        {
          $set: elemObj,
        },
        {upsert: true,new:true },
        function (error, Appex) {
          if (error) {
            throw createError(400, "This Element does not Exist");
          } else {
            return Appex;
          }
        }
      );

      res.send(page_res);



  }
  catch(error)
  {
    next(createError(error.status, error.message));
  }

});




router.post("/:AppId/:page/:ticker/publishTicker", verify, async (req, res, next) => {

  try {
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");
    const page_res = await Page.findOne({ _id: req.params.page });
    if (!page_res) throw createError(400, "Invalid Page Id");

    const ticker_res = await Ticker.findOne({ _id: req.params.ticker });
    if (!ticker_res) throw createError(400, "Invalid Ticker Id");
    const tickObj = ticker_res;
    tickObj.publishStatus = true;

    const ticker_page_res = await TickerPage.findOne({ ticker: req.params.ticker,page:req.params.page });
    if (!ticker_page_res) throw createError(400, "Unable to find any information for this Ticker & Page");
    const tickPageObj = ticker_page_res;
    tickPageObj.publishStatus =true;
    const ticker_model = pub_con.model('Ticker',tickerSchema);
    const ticker_page_model = pub_con.model('TickerPage',tickerRefSchema);




    const tick_res = await ticker_model.findByIdAndUpdate(
      { _id: req.params.ticker },
      {
        $set: tickObj,
      },
      {upsert: true,new:true },
      function (error, Appex) {
        if (error) {
          throw createError(400, "Ticker Failed to Insert");
        } else {
          return Appex;
        }
      }
    );


    const tick_old_res = await Ticker.findByIdAndUpdate(
      { _id: req.params.ticker },
      {
        $set: tickObj,
      },
      {upsert: true,new:true },
      function (error, Appex) {
        if (error) {
          throw createError(400, "Ticker Failed to be Published");
        } else {
          return Appex;
        }
      }
    );

    

    
    const tick_page_res = await ticker_page_model.findByIdAndUpdate(
      { _id: ticker_page_res._id },
      {
        $set: tickPageObj,
      },
      {upsert: true,new:true },
      function (error, Appex) {
        if (error) {
          throw createError(400, "Ticker Page Failed to Publish");
        } else {
          return Appex;
        }
      }
    );


    const tick_page_res_old = await TickerPage.findByIdAndUpdate(
      { _id: ticker_page_res._id },
      {
        $set: tickPageObj,
      },
      {upsert: true,new:true },
      function (error, Appex) {
        if (error) {
          throw createError(400, "Ticker Page Failed to Publish");
        } else {
          return Appex;
        }
      }
    );

     const objs = [{page:tick_page_res,ticker:tick_res}]

    res.send(objs);


  }
  catch(error)
  {
    console.log(error);
    next(createError(error.status, error.message));
  }

});


router.post("/:AppId/:page/:ticker/unpublishTicker", verify, async (req, res, next) => {

  try {
    const AppId = await App.findOne({ _id: req.params.AppId });
    if (!AppId) throw createError(400, "Invalid Application Id");
    const page_res = await Page.findOne({ _id: req.params.page });
    if (!page_res) throw createError(400, "Invalid Page Id");

    const ticker_res = await Ticker.findOne({ _id: req.params.ticker });
    if (!ticker_res) throw createError(400, "Invalid Ticker Id");
    const tickObj = ticker_res;
    tickObj.publishStatus = false;

    const ticker_page_res = await TickerPage.findOne({ ticker: req.params.ticker,page:req.params.page });
    if (!ticker_page_res) throw createError(400, "Unable to find any information for this Ticker & Page");
    const tickPageObj = ticker_page_res;
    tickPageObj.publishStatus =false;
    const ticker_model = pub_con.model('Ticker',tickerSchema);
    const ticker_page_model = pub_con.model('TickerPage',tickerRefSchema);



    const tick_res = await ticker_model.findByIdAndUpdate(
      { _id: req.params.ticker },
      {
        $set: tickObj,
      },
      {upsert: true,new:true },
      function (error, Appex) {
        if (error) {
          throw createError(400, "Ticker Failed to Insert");
        } else {
          return Appex;
        }
      }
    );


    const tick_old_res = await Ticker.findByIdAndUpdate(
      { _id: req.params.ticker },
      {
        $set: tickObj,
      },
      {upsert: true,new:true },
      function (error, Appex) {
        if (error) {
          throw createError(400, "Ticker Failed to be Published");
        } else {
          return Appex;
        }
      }
    );

  


    const SystemId = await ticker_page_model.findByIdAndDelete(
      ticker_page_res._id,
      function (error, Appex) {
        if (error) {
          throw createError(400, "Invalid ID");
        } else {
          return Appex;
        }
      }
    );

       
    const tick_page_res = await TickerPage.findByIdAndUpdate(
      { _id: ticker_page_res._id },
      {
        $set: tickPageObj,
      },
      {upsert: true,new:true },
      function (error, Appex) {
        if (error) {
          throw createError(400, "Ticker Page Failed to Publish");
        } else {
          return Appex;
        }
      }
    );
 

    res.send("Successfully unpublished");


  }
  catch(error)
  {
    console.log(error);
    next(createError(error.status, error.message));
  }

});







/* 


  router.post("/:AppId/migrateImages", verify, async (req, res, next) => {

    try {
        const appObject= await App.findOne({_id:req.params.AppId});
        if(!appObject) throw createError(400,"Invalid Application Id");
  

    }
    catch(error)
    {

    }
  
  });


  router.post("/:AppId/:pageId/unpublishPage", verify, async (req, res, next) => {
  
});



router.post("/:AppId/:elemId/unpublishElement", verify, async (req, res, next) => {
  
});

router.post("/:AppId/:elemId/publishElement", verify, async (req, res, next) => {
  
});




router.post("/:AppId/publishApp", verify, async (req, res, next) => {
  
});



router.post("/:AppId/unpublishApp", verify, async (req, res, next) => {
  
});

 */






  










export default router;
