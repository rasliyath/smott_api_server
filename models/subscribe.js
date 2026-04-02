import mongoose from 'mongoose';

const Item= new mongoose.Schema({
  
    planid:
    {
        type:String,
        require:false,
        max:2048,
        min:1
    },
    planRef:
    {
        type:String,
        require:false,
        max:2048,
        min:1
    },
    planOrder:
    {
        type:String,
        require:false
    }
    

});
const userSchema= new mongoose.Schema({
  SRMName: {
      type: String,
      required: true,
      min :6,
      max:255
  },
  SRMKey : {
      type: String,
      required : false,
      max:3048,
      min:6
  },
  SRMSecret : {
      type: String,
      required: false,
      min:6,
      max:3048
  },
  uuid : {
    type: String,
    required : false,
    max:3048,
    min:6
},
customPayment : {
    type: Boolean,
    required: false,
   
},
checkoutUrl: {
    type: String,
    required: false,
    min :6,
    max:2048
},
customLogin:{
    type:Boolean,
    required:false

},
customLoginUrl:
{
    type: String,
    required:false,
    min:6,
    max:2048

},
otp:
{
    type:Boolean,
    required:false
},
otpKey:
{
    type: String,
    required:false,
    min:6,
    max:2048
},
plans:[Item],

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
export default mongoose.model('Subscription',userSchema);