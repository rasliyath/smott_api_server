import mongoose from 'mongoose';


const Item= new mongoose.Schema({
  
    attachmentId:
    {
        type:String,
        require:false,
        max:2048,
        min:1
    },
    attachmentRef:
    {
        type:String,
        require:false,
        max:2048,
        min:1
    },
    attachmentOrder:
    {
        type:String,
        require:false
    }
    

});


const Reply= new mongoose.Schema({
  
    replyId:
    {
        type:String,
        require:false,
        max:2048,
        min:1
    },
    replyBy:
    {
        type:String,
        require:false,
        max:2048,
        min:1
    },
    replyOrder:
    {
        type:String,
        require:false
    }
    

});
const userSchema= new mongoose.Schema({
subject: {
      type: String,
      required: true,
      min :3,
      max:4096
  },
priority: {
    type: String,
    required: true,
    min :3,
    max:4096
},
description: {
    type: String,
    required: true,
    min :3,
    max:40000
},

applicationType: {
    type: String,
    required: true,
    min :3,
    max:4096
},

resolveStatus: {
    type: String,
    required: true,
    min :3,
    max:4096
},
attachment:[Item],
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
export default mongoose.model('Ticket',userSchema);