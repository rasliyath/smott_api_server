import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


const featureSchema= new mongoose.Schema({
    featureName: {
        type: String,
        required: true,
        min :6,
        max:255
    },
    system: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "System",
        required : true
    },
    featureUid : {
        type: String,
        default:uuidv4()
    },

    createdBy :
    {
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now
    },
    path: {
        type: String,
        required: true,
        min:4
    }


});

export default mongoose.model('Feature',featureSchema);