import express from 'express';
import {verify} from './verifyToken.js';
const router = express.Router();


router.get('/',verify,(req,res)=> {

    res.json({
         posts: {
                title : 'myFirstPost',
                 description: 'description'
            }
        });

});
export default router;
