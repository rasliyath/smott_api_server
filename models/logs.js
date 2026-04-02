import mongoose from 'mongoose';



const logSchema= new mongoose.Schema({
    itemtype: {
        type: String,
        required: true,
        min :6,
        max:255
    },
    msgtype: {
        type: String,
        required: true,
        min :6,
        max:255
    },
    itemid : {
        type: String,
        required : false,
        max:2048,
        min:6
    },
    message : {
        type: String,
        required: true,
        min:6,
        max:3048
    },
    
    actionBy:
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      require:true
    },
    application:
    {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Application",
     required : false
    },
   
    date:{
        type: Date,
        default: Date.now
    }
  });
  export default mongoose.model('Log',logSchema);