import express from "express";
import createError from "http-errors";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const router = express.Router();

// propertyId = process.env.PROPERTY_ID;
// GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const analyticsDataClient = new BetaAnalyticsDataClient();

router.get("/runReport", async (req, res, next) => {
  // const date = new Date();
  // date.setDate(date.getDate());

  try {
    //Application Id Checking

    const [response] = await analyticsDataClient.runReport({
      property: `properties/350502404`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        
        {
          name:"platform"
        },
        
       
      ],
      metrics: [
        {
          name: "activeUsers",
        },
        {
          name: "totalUsers",
        },
      
      ],
    });
    res.send(response);
  } catch (error) {
    console.log(error);
    next(createError(400,"Error in Parameters Passed"));
    
  }
});


router.get("/getMetadata", async (req, res, next) => {
  // const date = new Date();
  // date.setDate(date.getDate());

  try {
    //Application Id Checking

    const [response] = await analyticsDataClient.getMetadata({
      name: `properties/350502404/metadata`
    });
    res.send(response);
  } catch (error) {
    console.log(error);
    next(createError(400,"Error in Parameters Passed"));
    
  }
});


router.post("/runTestReport", async (req, res, next) => {
  // const date = new Date();
  // date.setDate(date.getDate());

  try {
    //Application Id Checking

    const [response] = await analyticsDataClient.runReport({
      property: `properties/350502404`,
      dateRanges: [
        {
          startDate: req.body.startDate,
          endDate: req.body.endDate,
        },
      ],
      dimensions: req.body.dimensions,
      metrics: req.body.metrics,
      orderBys:req.body.orderBys,
      limit: req.body.limit



    });
    res.send(response);
  } catch (error) {
    console.log(error);
    next(createError(400,"Error in Parameters Passed"));
    
  }
});

router.get("/runPageReport", async (req, res, next) => {
  // const date = new Date();
  // date.setDate(date.getDate());

  try {
    //Application Id Checking

    const [response] = await analyticsDataClient.runReport({
      property: `properties/350502404`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        
        {
          name:"unifiedScreenName"
        },
        
       
      ],
      metrics: [
        {
          name: "activeUsers",
        },
        {
          name: "totalUsers",
        },
      
      ],
      orderBys: [
        {
          desc: true,
          dimension: {
            dimensionName: "activeUsers",
          },
        }
      ],
      limit:5

    });
    res.send(response.rows);
  } catch (error) {
    console.log(error);
    next(createError(400,"Error in Parameters Passed"));
    
  }
});




router.get("/rungraphReport", async (req, res, next) => {
  // const date = new Date();
  // date.setDate(date.getDate());

  try {
    //Application Id Checking

    const [response] = await analyticsDataClient.runReport({
      property: `properties/350502404`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name:"country"
        }
       
      ],
      metrics: [
        {
          name: "activeUsers",
        }
      ],
      limit:5
    });

    const data =[];
    response.rows.forEach(row => {

            const item = {name:row.dimensionValues[0].value,value:parseInt(row.metricValues[0].value)}
           data.push(item);
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(createError(400,"Error in Parameters Passed"));
    
  }
});

router.get("/rungraphTopReport", async (req, res, next) => {
  // const date = new Date();
  // date.setDate(date.getDate());

  try {
    //Application Id Checking
    const year = new Date().getFullYear()-1;
    const day = new Date().getDate();
    const [response] = await analyticsDataClient.runReport({
      property: `properties/350502404`,
      dateRanges: [
        {
          startDate:"15daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name:"date"
        }
       
      ],
      metrics: [
        {
          name: "bounceRate",
        },
        {
          name: "engagementRate",
        }
      ],
      orderBys: [
        {
          desc: true,
          dimension: {
            dimensionName: "date",
          },
        }
      ],
      limit:15
    });

    const data =[];
    response.rows.forEach(row => {

      const result = row.dimensionValues[0].value.match(/.{1,4}/g) ?? [];
       const broke = result[1].match(/.{1,2}/g) ?? [];
       const day = result[0]+"-"+broke[0]+"-"+broke[1];

            const item = {name:day,bounceRate:parseInt(parseFloat(row.metricValues[0].value)*100),engagementRate:parseInt(parseFloat(row.metricValues[1].value)*100)}
           data.push(item);
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(createError(400,"Error in Parameters Passed"));
    
  }
});



router.get("/runRealPlatformReport", async (req, res, next) => {
    // const date = new Date();
    // date.setDate(date.getDate());
  
    try {
      //Application Id Checking
  
      const [response] = await analyticsDataClient.runRealtimeReport({
        property: `properties/350502404`,
        dimensions: [
          {
            name: 'platform',
          },
        ],
        metrics: [
          {
            name: 'activeUsers',
          },
        ],
      });
      res.send(response);
    } catch (error) {
      console.log(error);
      next(createError(400,"Error in Parameters Passed"));
      
    }
  });


  
router.get("/runRealCityReport", async (req, res, next) => {
    // const date = new Date();
    // date.setDate(date.getDate());
  
    try {
      //Application Id Checking
  
      const [response] = await analyticsDataClient.runRealtimeReport({
        property: `properties/350502404`,
        dimensions: [
          {
            name: 'city',
          },
        ],
        metrics: [
          {
            name: 'activeUsers',
          },
        ],
      });
      res.send(response);
    } catch (error) {
      console.log(error);
      next(createError(400,"Error in Parameters Passed"));
      
    }
  });


  router.get("/runRealStreamReport", async (req, res, next) => {
    // const date = new Date();
    // date.setDate(date.getDate());
  
    try {
      //Application Id Checking
  
      const [response] = await analyticsDataClient.runRealtimeReport({
        property: `properties/350502404`,
        dimensions: [
          {
            name: 'streamName',
          },
        ],
        metrics: [
          {
            name: 'activeUsers',
          },
          {
            name: 'screenPageViews',
          },
        ],
      });
      res.send(response);
    } catch (error) {
      console.log(error);
      next(createError(400,"Error in Parameters Passed"));
      
    }
  });


  router.get("/runRealScreenReport", async (req, res, next) => {
    // const date = new Date();
    // date.setDate(date.getDate());
  
    try {
      //Application Id Checking
  
      const [response] = await analyticsDataClient.runRealtimeReport({
        property: `properties/350502404`,
        dimensions: [
          {
            name: 'eventName',
          },
          {
            name: 'streamName',
          },
        ],
        metrics: [
          {
            name: 'eventCount',
          },
         
          
        ],
      });
      res.send(response);
    } catch (error) {
      console.log(error);
      next(createError(400,"Error in Parameters Passed"));
      
    }
  });

export default router;
