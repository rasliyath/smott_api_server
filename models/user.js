import mongoose from 'mongoose';
const userSchema= new mongoose.Schema({
  name: {
      type: String,
      required: true,
      min :6,
      max:255
  },
  email : {
      type: String,
      required : true,
      max:255,
      min:6
  },
  password : {
      type: String,
      required: true,
      min:6,
      max:3048
  },
  superAdmin:
  {
      type: Boolean,
      required : true
         
  },
  admin:
  {
      type: Boolean,
      required : true
         
  },
  editor:
  {
      type: Boolean,
      required : true
         
  },
  reader:
  {
      type: Boolean,
      required : true
         
  },
  active:
  {
      type: Boolean,
     default : true,
     required: false
         
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
export default mongoose.model('User',userSchema);