import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


const masterSchema= new mongoose.Schema({
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
    admin:
    {
        type: Boolean,
        required : true
           
    },
    analytics:
    {
        type: Boolean,
        required : true
           
    },
    reader:
    {
        type: Boolean,
        required : true
           
    },
    rgbId: {
        type: String,
        required: true,
        min :6,
        max:255
    },
    apiToken : {
        type: String,
        default:uuidv4()
    },
    date:{
        type: Date,
        default: Date.now
    }
  });
  export default mongoose.model('Master',masterSchema);