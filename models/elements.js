import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Page",
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
    },
    itemElem:
    {
        type:String,
        require:false
    },
    itemType:
    {
        type:String,
        require:false
    },
     itemDraft: {
        type: Boolean,
        require: false,
        default:true
      },
      itemPublish: {
        type: Boolean,
        require: false,
        default:false
      },
      itemRepublish: {
        type: Boolean,
        require: false,
        default:false
      }

    

});

const channel = new mongoose.Schema({
uuid:{
  type: String,
  default:uuidv4()
},
type: {
  type: String,
  required: true,
  min :2,
  max:255
},
title: {
  type: String,
  required: true,
  min :2,
  max:255
},
logo: {
  type: String,
  required: true,
  min :2,
  max:655
},
year: {
  type: String,
  required: false,
  min :2,
  max:255
},

});

const epg = new mongoose.Schema({
  id:{
    type: String,
    default:uuidv4()
  },
  channelUuid:{
    type: String,
    required: true,
    max: 2048,
    min: 2,
  },
  description: {
    type: String,
    required: false,
    max: 4096,
    min: 2,
  },
  title: {
    type: String,
    required: true,
    min :2,
    max:255
  },
  image: {
    type: String,
    required: true,
    min :2,
    max:655
  },
  Year: {
    type: String,
    required: false,
    min :2,
    max:255
  },
  Director: {
    type: String,
    required: false,
    min :2,
    max:255
  },
  Actors: {
    type: String,
    required: false,
    min :2,
    max:655
  },
  Genre: {
    type: String,
    required: false,
    min :2,
    max:655
  },
  Rated: {
    type: String,
    required: false,
    min :2,
    max:255
  },
  Released: {
    type: String,
    required: false,
    min :2,
    max:255
  },
  Language: {
    type: String,
    required: false,
    min :2,
    max:255
  },
  since:
  {
    type: Date,
    required:false,
  },
  till:
  { type: Date,
    required:false,
  }
  
  });
  

const trans = new mongoose.Schema({
    transid: {
      type: String,
      require: false,
    },
    transLang: {
      type: String,
      require: false,
    },
    displayName: {
      type: String,
      required: false,
      max: 255,
      min: 2,
    },
    urlName: {
      type: String,
      required: false,
      max: 255,
      min: 2,
    },
    viewAllText : {
        type: String,
        required : false,
        max:255,
        min:2
    },
    items:[Item]
   
  });
  
const userSchema= new mongoose.Schema({
  elementType: {
      type: String,
      required: true,
      min :6,
      max:255
  },
  referenceName : {
      type: String,
      required : false,
      max:255,
      min:6
  },
  displayName : {
    type: String,
    required : false,
    max:255,
    min:2
},
displayNameVisibility : {
    type: String,
    required : false,
    max:255,
    min:2
},
viewAllText : {
    type: String,
    required : false,
    max:255,
    min:2
},
viewAllVisibility : {
    type: Boolean,
    required : false
},
viewAllPage:
  {
   type: mongoose.Schema.Types.ObjectId, 
   ref: "Page",
   required : false
  },
urlName : {
    type: String,
    required : false,
    max:255,
    min:2
},
urlPage : {
  type: String,
  required : false,
  max:2048,
  min:2
},
portraitThumbnail : {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Image",
      required : false,
},
landscapeThumbnail : {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Image",
    required : false,
},
bannerImage : {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Image",
    required : false,
},

playlistId : {
    type: String,
    required : false,
    max:255,
    min:2
},
tabType : {
    type: String,
    required : false,
    max:255,
    min:2
},
tab1Name : {
    type: String,
    required : false,
    max:255,
    min:2
},
tab2Name : {
    type: String,
    required : false,
    max:255,
    min:2
},
tab3Name : {
    type: String,
    required : false,
    max:255,
    min:2
},
tab1Container:
  {
   type: mongoose.Schema.Types.ObjectId, 
   ref: "Element",
   required : false
  },
  tab2Container:
  {
   type: mongoose.Schema.Types.ObjectId, 
   ref: "Element",
   required : false
  },
  tab3Container:
  {
   type: mongoose.Schema.Types.ObjectId, 
   ref: "Element",
   required : false
  },
  application:
  {
   type: mongoose.Schema.Types.ObjectId, 
   ref: "Application",
   required : true
  },
  devices : [access],
  items:[Item],
  languages:[trans],
  channels:[channel],
  epg:[epg],
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

  },
  republishStatus: {
    type: Boolean,
    required: false,
  },
  RFP: {
    type: Boolean,
    required: false,
    default:false
  },
  autoPlay:
  {
      type:Boolean,
      required:false,
      default:false

  },
  autoPlayTimer:
  {
    type:String,
    required:false,
    default:"5"
  },
  createdBy:
  {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    require:true
  },
  publishedDate: {
    type: Date,
    required: false,
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
export default mongoose.model('Element',userSchema);