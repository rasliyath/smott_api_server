import mongoose from 'mongoose';


const applicationSchema= new mongoose.Schema({
   
    web:
    {
        type: String,
        required : false
           
    },
    android:
    {
        type: String,
        required : false
           
    },
    iOS:
    {
        type: String,
        required : false
           
    },
    androidTv:
    {
        type: String,
        required : false
           
    },
    appleTv:
    {
        type: String,
        required : false
           
    },
    fireTv:
    {
        type: String,
        required : false
           
    },
    roku:
    {
        type: String,
        required : false
           
    },
    samsungTizen:
    {
        type: String,
        required : false
           
    },
    lgWebOs:
    {
        type: String,
        required : false
           
    },
    chromecast:
    {
        type: String,
        required : false
    },
    
    application:
    {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Application",
     required : true
    },

    
   
    
  });
  export default mongoose.model('Analytics',applicationSchema);