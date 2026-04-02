import express from "express";
import createError from "http-errors";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const router = express.Router();

// Load credentials from env variable (Railway) or fall back to local file (dev)
const analyticsClientOptions = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  ? { credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) }
  : { keyFilename: "./vtott-app-firebase-adminsdk-fbsvc-3473700a30.json" };

const analyticsDataClient = new BetaAnalyticsDataClient(analyticsClientOptions);

router.get("/runPageReport", async (req, res, next) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/481620598`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "unifiedScreenName" }],
      metrics: [{ name: "activeUsers" }, { name: "totalUsers" }],
      orderBys: [{ desc: true, dimension: { dimensionName: "activeUsers" } }],
      limit: 5,
    });

    if (!response.rows || response.rows.length === 0) {
      return res.json({ message: "No data available" });
    }

    res.send(response.rows);
  } catch (error) {
    console.log(error);
    next(createError(400, "Error in Parameters Passed"));
  }
});

router.get("/rungraphReport", async (req, res, next) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/481620598`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
      limit: 5,
    });

    if (!response.rows || response.rows.length === 0) {
      return res.json({ message: "No data available" });
    }

    const data = response.rows.map((row) => ({
      name: row.dimensionValues[0].value,
      value: parseInt(row.metricValues[0].value),
    }));

    res.send(data);
  } catch (error) {
    console.log(error);
    next(createError(400, "Error in Parameters Passed"));
  }
});

router.get("/rungraphTopReport", async (req, res, next) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/481620598`,
      dateRanges: [{ startDate: "15daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "bounceRate" }, { name: "engagementRate" }],
      orderBys: [{ desc: true, dimension: { dimensionName: "date" } }],
      limit: 15,
    });

    if (!response.rows || response.rows.length === 0) {
      return res.json({ message: "No data available" });
    }

    const data = response.rows.map((row) => {
      const result = row.dimensionValues[0].value.match(/.{1,4}/g) ?? [];
      const broke = result[1]?.match(/.{1,2}/g) ?? [];
      const day = result[0] + "-" + (broke[0] || "00") + "-" + (broke[1] || "00");

      return {
        name: day,
        bounceRate: parseInt(parseFloat(row.metricValues[0].value) * 100),
        engagementRate: parseInt(parseFloat(row.metricValues[1].value) * 100),
      };
    });

    res.send(data);
  } catch (error) {
    console.log(error);
    next(createError(400, "Error in Parameters Passed"));
  }
});

router.get("/runRealScreenReport", async (req, res, next) => {
  try {
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/481620598`,
      dimensions: [{ name: "eventName" }, { name: "streamName" }],
      metrics: [{ name: "eventCount" }],
    });

    if (!response.rows || response.rows.length === 0) {
      return res.json({ message: "No data available" });
    }

    res.send(response);
  } catch (error) {
    console.log(error);
    next(createError(400, "Error in Parameters Passed"));
  }
});

export default router;
