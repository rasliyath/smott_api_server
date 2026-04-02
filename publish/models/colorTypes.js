import mongoose from "mongoose";


const colorSchema = new mongoose.Schema({
  primaryBackgroundColor: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  secondaryBackgroundColor: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  primaryTextColor: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  secondaryTextColor: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  primaryHighlightColor: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  secondaryHighlightColor: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  menuBackgroundColor: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  elementBackgroundColor: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  elementForegroundColor: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  buttonBackgroundColor: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  buttonForegroundColor: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  menuForegroundColor: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  textShadow: {
    type: Boolean,
    required: false,
    default: true,
  },
  dark:
  {
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
export default colorSchema;
