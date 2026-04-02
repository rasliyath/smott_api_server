import mongoose from 'mongoose';


const Item= new mongoose.Schema({
  
    itemid:
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Page",
        require:false
    },
    itemRef:
    {
        type:String,
        require:false
    },
    itemSection:
    {
        type:String,
        require:false
    },
    itemOrder:
    {
        type:String,
        require:false
    },
    itemHeader:
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
    sectionHeader1 : {
      type: String,
      required : false,
      max:255,
      min:6
  },
  sectionHeader2 : {
    type: String,
    required : false,
    max:255,
    min:6
},
sectionHeader3 : {
  type: String,
  required : false,
  max:255,
  min:6
},
facebookLink : {
  type: String,
  required : false,
  max:255,
  min:6
},
instagramLink : {
  type: String,
  required : false,
  max:255,
  min:6
},
twitterLink : {
  type: String,
  required : false,
  max:255,
  min:6
},
youtubeLink : {
  type: String,
  required : false,
  max:255,
  min:6
},
footDescription:{
  type: String,
  required : false,
  max:2048,
  min:6
},
    items:[Item],
    date:{
        type: Date,
        default: Date.now
    },
    createdBy:
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      require:true
    },
    editedBy:
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      require:true
    },
    createdDate:
    {
      
      type: Date,
      default: Date.now
    },
    editedDate:
    {
      
      type: Date,
      required:false
    }
  });
  export default mongoose.model('Footer',userSchema);