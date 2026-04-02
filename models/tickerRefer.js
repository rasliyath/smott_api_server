import mongoose from 'mongoose';



const userSchema= new mongoose.Schema({

  
  application:
  {
   type: mongoose.Schema.Types.ObjectId, 
   ref: "Application",
   required : true
  },
  ticker:
  {
   type: mongoose.Schema.Types.ObjectId, 
   ref: "Ticker",
   required : true
  },
  page:
  {
   type: mongoose.Schema.Types.ObjectId, 
   ref: "Page",
   required : true
  },
  draftStatus:
  {
      type:Boolean,
      required:true

  },
  publishStatus:
  {
      type:Boolean,
      required:true

  }

  
  
});
export default mongoose.model('TickerPage',userSchema);