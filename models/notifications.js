import mongoose from 'mongoose';



const notSchema= new mongoose.Schema({
    itemtype: {
        type: String,
        required: false,
        min :6,
        max:255
    },
    redirect:
    {
        type: String,
        required:false,
        min:6,
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
        required: false,
        min:6,
        max:3048
    },
    read:
    {
        type: Boolean,
        required : false
           
    },
    sendBy:
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      require:true
    },
    actionBy:
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      require:false
    },
    approval:
    {
        type: Boolean,
        required : false
           
    },
    approvalDate:
   {
    
    type: Date,
    required:false
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
  export default mongoose.model('Notification',notSchema);