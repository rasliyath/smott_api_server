import mongoose from 'mongoose';


const access= new mongoose.Schema({

    itemName: 
    {
        type:String,
        require:false
    },
    itemSize:
    {
        type:String,
        require:false
    },
    itemVisibility:
    {
        type:Boolean,
        require:false
    }
    

});

const Item= new mongoose.Schema({
  
    itemid:
    {
        type:String, 
        require:false
    },
    itemRef:
    {
        type:String,
        require:false
    },
    itemOrder:
    {
        type:String,
        require:false
    }

    

});
const userSchema= new mongoose.Schema({

  referenceName : {
      type: String,
      required : false,
      max:255,
      min:6
  },
  application:
  {
   type: mongoose.Schema.Types.ObjectId, 
   ref: "Application",
   required : true
  },
  
  devices : [access],
  items:[Item],
  date:{
      type: Date,
      default: Date.now
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
export default mongoose.model('Ticker',userSchema);