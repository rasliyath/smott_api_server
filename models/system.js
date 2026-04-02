import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const systemsSchema= new mongoose.Schema({
    systemName: {
        type: String,
        required: true,
        min :6,
        max:255
    },
    systemUid : {
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
    }


});

export default mongoose.model('System',systemsSchema);