import mongoose from 'mongoose';


const testSchema= new mongoose.Schema({
    test: {
        type: String,
        required: true,
        min :2,
        max:2048
    },
    pot: {
        type: String,
        required: true,
        min :2,
        max:2048
    }
   
   
});

export default testSchema;