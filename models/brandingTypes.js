import mongoose from 'mongoose';
const userSchema= new mongoose.Schema({
  pageTitle: {
      type: String,
      required: false,
      min :6,
      max:255
  },
  mainLogo : {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Image",
      required : false,
     
  },
  footerLogo : {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Image",
    required : false,
  },
  iconLogo : {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Image",
    required : false,
  },
  footerDescription : {
    type: String,
    required: false,
    min:6,
    max:655
},
appIcon: {
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Image",
  required : false,
},
marketingLogo: {
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Image",
  required : false,
},
tvLogo: {
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Image",
  required : false,
},
chromeCastLogo: {
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Image",
  required : false,
},
mobileLogo:
{
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Image",
  required : false,
},
mainDarkLogo : {
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Image",
  required : false,
 
},
footerDarkLogo : {
type: mongoose.Schema.Types.ObjectId, 
ref: "Image",
required : false,
},
mobileDarkLogo:
{
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Image",
  required : false,
},
tvDarkLogo: {
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Image",
  required : false,
},
chromeCastDarkLogo: {
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Image",
  required : false,
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
export default mongoose.model('Branding',userSchema);