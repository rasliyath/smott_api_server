import mongoose from 'mongoose';


const Item= new mongoose.Schema({
  
    itemid:
    {
        type: String,
        require:false
    },
    itemRef:
    {
        type:String,
        require:false
    },
    itemFile:
    {
        type:String,
        require:false
    },
    itemFontType:
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

    application:
    {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Application",
     required : true
    },
    selectedFont : {
     type: String,
     required : false,
    },
    items:[Item],
    urlItems:[Item],
    date:{
        type: Date,
        default: Date.now
    }
  });
  export default mongoose.model('Font',userSchema);