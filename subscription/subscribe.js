import express from "express";
import App from "../models/app.js";
import jwt from "jsonwebtoken";
import { viewVerify } from "../routes/verifyToken.js";
import fetch from "node-fetch";
import redis from "redis";
import mongoose from "mongoose";
import api from "api";
import Subscription from "../models/subscribe.js";
import createError from "http-errors";
import axios from "axios";

const router = express.Router();
// Access Token Creation ...
//const REDIS_PORT = process.env.REDIS_PORT || 6379;
//const client = redis.createClient(REDIS_PORT);
const api_v2_url = "https://staging-v2.inplayer.com/v2/";
const api_v1_url = "https://staging-v2.inplayer.com/";

router.post("/:AppId/getOfferDetails", async (req, res, next) => {
  try {
    const access_token = "";
    const appl = await Subscription.findOne({ application: req.params.AppId });
    if (!appl) throw createError(404, "No Subscription Schema Exists");
    inPlayerAccessToken(appl.SRMKey, appl.SRMSecret)
      .then((data) => {})
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

const inPlayerToken = async (client_id, client_secret) => {
  const accessToken = "";
  const endpoint = "accounts/authenticate";
  const url = api_v1_url + endpoint;
  const form_data = new URLSearchParams();
  form_data.append("client_id", client_id);
  form_data.append("client_secret", client_secret);
  form_data.append("grant_type", "client_credentials");

  const options = {
    method: "POST",
    headers: {
      Accept: "application/x-www-form-urlencoded",
    },
    body: form_data,
  };
  await fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      accessToken = json.access_token;
    })
    .catch((err) => {
      throw createError(400, err);
    });
  return accessToken;
};

const inPlayerAccessToken = async (client_id, client_secret) => {
  const endpoint = "accounts/authenticate";
  const url = api_v1_url + endpoint;
  const form_data = new URLSearchParams();
  form_data.append("client_id", client_id);
  form_data.append("client_secret", client_secret);
  form_data.append("grant_type", "client_credentials");

  const token_set = await axios
    .post(url, form_data, {
      headers: { Accept: "application/x-www-form-urlencoded" },
    })
    .then(
      (response) => {
        return response;
      },
      (error) => {
        throw createError(400, "Invalid Crdentials or UNresponsive API");
      }
    );

  return token_set;
};

export default router;
