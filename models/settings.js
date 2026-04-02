import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  headData: {
    type: String,
    required: false,
    max: 4056,
    min: 6,
  },
  domainName: {
    type: String,
    required: false,
    min: 6,
    max: 2055,
  },
  startPage: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  allowLogin: {
    type: Boolean,
    required: false,
  },
  darkMode: {
    type: Boolean,
    required: false,
  },
  allowSubscription: {
    type: Boolean,
    required: false,
  },
  siteDescription: {
    type: String,
    required: false,
    min: 2,
    max: 8196,
  },
  bingeWatching: {
    type: Boolean,
    required: false,
  },
  resumePlayback: {
    type: Boolean,
    required: false,
  },
  socialSharing: {
    type: Boolean,
    required: false,
  },
  rtl: {
    type: Boolean,
    required: false,
  },
  RFP:
  {
    type:Boolean,
    required:false,
    default:false
  },
  multiLanguage: {
    type: Boolean,
    required: false,
  },
  favourites: {
    type: Boolean,
    required: false,
  },
  watchHistory: {
    type: Boolean,
    required: false,
  },
  gdpr: {
    type: Boolean,
    required: false,
  },
  chromecastID: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  premiumIcon: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  premiumIconVisibility: {
    type: Boolean,
    required: false,
  },
  production: {
    type: Boolean,
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
export default mongoose.model("Setting", userSchema);
