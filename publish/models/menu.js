import mongoose from "mongoose";

const Item = new mongoose.Schema({
  menuPage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Page",
    required: false,
  },
  menuPageRef:
  {
    type: String,
    require: false,
  },
  menuPageType:
  {
    type: String,
    require: false,
  },
  menuUrlName: {
    type: String,
    require: false,
  },
  menuTitle: {
    type: String,
    require: false,
  },
  menuOrder: {
    type: String,
    require: false,
  },
  menuIcon: {
    type: String,
    require: false,
  },
});
const menuSchema = new mongoose.Schema({
  menuTitle: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  urlName: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  menuType: {
    type: String,
    required: false,
    min: 2,
    max: 255,
  },
  menuPage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Page",
    required: false,
  },
  externalUrl: {
    type: String,
    required: false,
    min: 6,
    max: 655,
  },
  internalUrl: {
    type: String,
    required: false,
    min: 2,
    max: 655,
  },
  menuIcon: {
    type: String,
    required: false,
  },
  menuOrder: {
    type: String,
    required: false,
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  items:[Item],

  date: {
    type: Date,
    default: Date.now,
  },
});
export default menuSchema;
