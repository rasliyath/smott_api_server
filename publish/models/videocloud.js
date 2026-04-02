import mongoose from 'mongoose';
const videoCloudSchema= new mongoose.Schema({
  cloudName: {
      type: String,
      required: true,
      min :2,
      max:255
  },
  liveCloudName: {
    type: String,
    required: false,
    min :2,
    max:255
},
  cloudKey : {
      type: String,
      required : true,
      max:3048,
      min:2
  },
  cloudSecret : {
      type: String,
      required: true,
      min:2,
      max:3048
  },
  cloudKeyV2 : {
    type: String,
    required : false,
    max:3048,
    min:2
},
cloudSecretV2 : {
    type: String,
    required: false,
    min:2,
    max:3048
},
mainAccountId: {
    type: String,
    required: false,
    min :2,
    max:255
},
secondAccountId: {
    type: String,
    required: false,
    min :2,
    max:255
},
firstPlayer: {
    type: String,
    required: false,
    min :2,
    max:255
},
secondPlayer: {
    type: String,
    required: false,
    min :2,
    max:255
},
premiumPlayer: {
    type: String,
    required: false,
    min :2,
    max:255
},
licenseKey: {
    type: String,
    required: false,
    min :2,
    max:2048
},
iosLicenseKey: {
    type: String,
    required: false,
    min :2,
    max:2048
},
premLicenseKey: {
    type: String,
    required: false,
    min :2,
    max:2048
},
iosPremLicenseKey: {
    type: String,
    required: false,
    min :2,
    max:2048
},
secLicenseKey: {
    type: String,
    required: false,
    min :2,
    max:2048
},
iosSecLicenseKey: {
    type: String,
    required: false,
    min :2,
    max:2048
},


searchPlaylist: {
    type: String,
    required: false,
    min :2,
    max:255
},
recommendedPlaylist: {
    type: String,
    required: false,
    min :2,
    max:255
},
watchPlaylist: {
    type: String,
    required: false,
    min :2,
    max:255
},

drmKey: {
    type: String,
    required: false,
    min :2,
    max:255
},
drmMobileKey: {
    type: String,
    required: false,
    min :2,
    max:255
},
drmTVKey: {
    type: String,
    required: false,
    min :2,
    max:255
},
  application:
  {
   type: mongoose.Schema.Types.ObjectId, 
   ref: "Application",
   required : true
  },
  
  date:{
      type: Date,
      default: Date.now
  }
});
export default videoCloudSchema;