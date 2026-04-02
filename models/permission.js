import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const access= new mongoose.Schema({
    systemId:{
        type:String,
        require:true
    },
    featureId: 
    {
        type:String,
        require:true
    },
    available:{
        type:Boolean,
        require:true
    }

});
const permissionSchema= new mongoose.Schema({

    applicationId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Application",
        required : true
    },
    permission_details : [access]
    

});


export default mongoose.model('Permission',permissionSchema);