import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


const language = new mongoose.Schema({
    languageid: {
      type: String,
      require: false,
      max: 2048,
      min: 1,
    },
    languageRef: {
      type: String,
      require: false,
      max: 2048,
      min: 1,
    },
    landefault: {
      type: Boolean,
      require: false,
    },
    lanUrl: {
      type: String,
      require: false,
    },
  });


const applicationSchema= new mongoose.Schema({
    appName: {
        type: String,
        required: true,
        min :6,
        max:255
    },
    appType : {
        type: String,
        required : true,
        max:255,
        min:6
    },
    menuType : {
        type: String,
        required : true,
        max:255,
        min:6
    },
    owner_type:
    {
        type: String,
        required : false,
        max:255,
        min:6
    },
    
    web:
    {
        type: Boolean,
        required : true
           
    },
    android:
    {
        type: Boolean,
        required : true
           
    },
    iOS:
    {
        type: Boolean,
        required : true
           
    },
    androidTv:
    {
        type: Boolean,
        required : true
           
    },
    appleTv:
    {
        type: Boolean,
        required : true
           
    },
    fireTv:
    {
        type: Boolean,
        required : true
           
    },
    roku:
    {
        type: Boolean,
        required : true
           
    },
    samsungTizen:
    {
        type: Boolean,
        required : true
           
    },
    lgWebOs:
    {
        type: Boolean,
        required : true
           
    },
    chromecast:
    {
        type: Boolean,
        required : true
    },
    licensetype : {
        type: String,
        required : true,
        max:255,
        min:6
    },
    licensedays : {
        type: Number,
        required : true
    },
    languages: [language],
    apiToken : {
        type: String,
        default:uuidv4()
    },
    expireStatus:
    {
        type: Boolean,
        required : true
           
    },
    expiresOn:
    {
        type:Date,
        required : true
    },
    date:{
        type: Date,
        default: Date.now
    }
    
  });
  export default mongoose.model('Application',applicationSchema);