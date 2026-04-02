import mongoose from 'mongoose';
const monetizeSchema= new mongoose.Schema({
adTag: {
      type: String,
      required: false,
      min :6,
      max:4096
  },
premiumAd: {
    type: Boolean,
    required: false
},
freemiumAd: {
    type: Boolean,
    required: false
},
adsTxt: {
    type: String,
    required: false,
    min :6,
    max:4096
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
export default monetizeSchema;