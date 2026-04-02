import mongoose from "mongoose";

const access = new mongoose.Schema({
  itemName: {
    type: String,
    require: false,
  },
  itemSize: {
    type: String,
    require: false,
  },
  itemVisibility: {
    type: Boolean,
    require: false,
  },
});

const Item = new mongoose.Schema({
  itemid: {
    type: String,
    require: false,
    max: 20048,
    min: 1,
  },
  itemRef: {
    type: String,
    require: false,
    max: 2048,
    min: 1,
  },
  itemOrder: {
    type: String,
    require: false,
  },
  itemType: {
    type: String,
    require: false,
  },
  itemDraft: {
    type: Boolean,
    require: false,
    default:true
  },
  itemPublish: {
    type: Boolean,
    require: false,
    default:false
  },
  itemRepublish: {
    type: Boolean,
    require: false,
    default:false
  },
});
const trans = new mongoose.Schema({
  transid: {
    type: String,
    require: false,
  },
  transLang: {
    type: String,
    require: false,
  },
  displayName: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  urlName: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  genre: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  starring: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  rating: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  description: {
    type: String,
    required: false,
    max: 4096,
    min: 2,
  },
  author: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  blockQuote: {
    type: String,
    required: false,
    max: 2048,
    min: 2,
  },
  sectionHeader1: {
    type: String,
    required: false,
    max: 2048,
    min: 2,
  },
  sectionHeader2: {
    type: String,
    required: false,
    max: 2048,
    min: 2,
  },
  introduction: {
    type: String,
    required: false,
    max: 4096,
    min: 6,
  },
  sectionDescription1: {
    type: String,
    required: false,
    max: 8192,
    min: 6,
  },
  sectionDescription2: {
    type: String,
    required: false,
    max: 8192,
    min: 6,
  },
  director: {
    type: String,
    required: false,
    max: 455,
    min: 2,
  },
  cite: {
    type: String,
    required: false,
    max: 455,
    min: 2,
  },
  producer: {
    type: String,
    required: false,
    max: 455,
    min: 2,
  },
  studio: {
    type: String,
    required: false,
    max: 655,
    min: 2,
  },
  writer: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  tag: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
});

const userSchema = new mongoose.Schema({
  pageType: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  referenceName: {
    type: String,
    required: false,
    max: 255,
    min: 6,
  },
  displayName: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  urlName: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  portraitThumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: false,
  },
  landscapeThumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: false,
  },
  bannerImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: false,
  },
  genre: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  starring: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  rating: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  ageRating: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  description: {
    type: String,
    required: false,
    max: 4096,
    min: 2,
  },
  author: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  publishDate: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  publishedDate: {
    type: Date,
    required: false,
  },
  mainHeader: {
    type: String,
    required: false,
    max: 1024,
    min: 2,
  },
  externalPage: {
    type: String,
    required: false,
    max: 1024,
    min: 2,
  },
  livePage: {
    type: String,
    required: false,
    max: 1024,
    min: 2,
  },
  internalPage: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  blockQuote: {
    type: String,
    required: false,
    max: 2048,
    min: 2,
  },
  sectionHeader1: {
    type: String,
    required: false,
    max: 2048,
    min: 2,
  },
  sectionHeader2: {
    type: String,
    required: false,
    max: 2048,
    min: 2,
  },
  introduction: {
    type: String,
    required: false,
    max: 4096,
    min: 6,
  },
  sectionDescription1: {
    type: String,
    required: false,
    max: 8192,
    min: 6,
  },
  sectionDescription2: {
    type: String,
    required: false,
    max: 8192,
    min: 6,
  },

  contentType: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  videoId: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  audio: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  tag: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  firstTag: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  secondTag: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },

  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  devices: [access],
  items: [Item],
  languages:[trans],
  date: {
    type: Date,
    default: Date.now,
  },
  draftStatus: {
    type: Boolean,
    required: true,
  },
  publishStatus: {
    type: Boolean,
    required: true,
  },
  republishStatus: {
    type: Boolean,
    required: false,
  },
  RFP: {
    type: Boolean,
    required: false,
    default:false
  },
  director: {
    type: String,
    required: false,
    max: 455,
    min: 2,
  },
  cite: {
    type: String,
    required: false,
    max: 455,
    min: 2,
  },
  premiumType:
  {
    type: String,
    required: false,
    max: 455,
    min: 2,
  },
  
  producer: {
    type: String,
    required: false,
    max: 455,
    min: 2,
  },
  studio: {
    type: String,
    required: false,
    max: 655,
    min: 2,
  },
  writer: {
    type: String,
    required: false,
    max: 255,
    min: 2,
  },
  recommendation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Element",
    require: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  editedDate: {
    type: Date,
    required: false,
  },
});
export default mongoose.model("Page", userSchema);
