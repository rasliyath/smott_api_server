import mongoose from 'mongoose';


const imageSchema= new mongoose.Schema({
    imageName: {
        type: String,
        required: true,
        min :2,
        max:2048
    },
    application: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Application",
        required : true
    },
    imagekey: {
        type: String,
        required: true,
        min :6,
        max:2048
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

});

export default mongoose.model('Image',imageSchema);