import mongoose from "mongoose";
const webSettingSchema = new mongoose.Schema({
  numberofMenuItem: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  thumbnailAnimation: {
    type: String,
    required: false,
    max: 255,
    min: 6,
  },
  imageBorder: {
    type: Boolean,
    required: false,
    default: true,
  },

  loadingSpinner: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  thumbnailDescription: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  deepLink: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  cookiePolicy: {
    type: Boolean,
    required: false,
  },
  shading: {
    type: Boolean,
    default: true,
    required: false,
  },
  float: {
    type: String,
    required: false,
  },

  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});
export default webSettingSchema;
