import mongoose from 'mongoose';
const appsettingSchema= new mongoose.Schema({
actionBarStyle: {
      type: String,
      required: false,
      min :6,
      max:255
  },
androidMinVersion: {
      type: String,
      required : false,
      max:255,
      min:6
  },
iOSMinVersion: {
    type: String,
    required : false,
    max:255,
    min:6
},
androidTvMinVersion: {
    type: String,
    required : false,
    max:255,
    min:6
},
appleTvMinVersion: {
    type: String,
    required : false,
    max:255,
    min:6
},
fireTvMinVersion: {
    type: String,
    required : false,
    max:255,
    min:6
},
 rokuMinVersion: {
    type: String,
    required : false,
    max:255,
    min:6
},
SamsungMinVersion: {
    type: String,
    required : false,
    max:255,
    min:6
},
LGMinVersion: {
    type: String,
    required : false,
    max:255,
    min:6
},
loadingSpinner : {
      type: String,
      required: false,
      min:6,
      max:255
  },
landscapeOrientation : {
    type: Boolean,
    required: false
  },
Casting: {
    type: Boolean,
    required: false
},
pip: {
    type: Boolean,
    required: false
},
subtitles: {
    type: Boolean,
    required: false
},
playinSmallWindow: {
    type: Boolean,
    required: false
},
application:
  {
   type: mongoose.Schema.Types.ObjectId, 
   ref: "Application",
   required : true
  },
  imageBorder : {
    type: Boolean,
    required : false,
    default:true
},
  
date:{
      type: Date,
      default: Date.now
  }
});
export default appsettingSchema