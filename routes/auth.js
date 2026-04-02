import express from 'express';
import User from '../models/user.js';
import {registerValidation, loginValidation} from '../validation.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import App from '../models/app.js';
import {verify} from './verifyToken.js';
import createError from "http-errors";
import mongoose from "mongoose";



const router = express.Router();




router.post('/:AppId/register',verify, async (req,res) => {
    

    
    //Application Id Checking
    const AppId= await App.findOne({_id:req.params.AppId},function (error,Appex) {
        if(error) { return res.status(400).send('Application Id wrong or Missing') }
        else{ return Appex; }   
    });

    //validation
    const {error}  = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //checking if user exists
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email Already Exists');


    //checking if super admin exists
    //const superAdminExist = User.count({email:req.body.email});
    //if(emailExist > 0) return res.status(400).send('Email Already Exists');


    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);


    

    //create New User
    const user= new User({
     name: req.body.name,
     email: req.body.email,
     password:hashPassword,
     superAdmin:false,
     admin:req.body.admin,
     reader:req.body.reader,
     editor:req.body.editor,
     application:AppId._id
 }); 
 try
 {
     const savedUser =await user.save();
     res.send(savedUser);


 } catch(error) {
     res.status(400).send(error);
  }
 

});



router.post('/login', async (req,res,next) => {
     //validation
     try
     {
        const {error}  = loginValidation(req.body);
        if(error) throw createError(400,error.details[0].message);
    
         //checking if email exists
         //console.log(req.body.email);
         //const salt = await bcrypt.genSalt(10);
         //const hashPassword = await bcrypt.hash("jijithjv@123#",salt);
         //console.log(hashPassword);

         const user = await User.findOne({email: req.body.email}, function(err, result){
          if (err) {
            console.log(err);
          }
          if (result) {
            console.log(result);
          }
          console.log('findone output');
          
         });
         //console.log('user credentials');
         //console.log(req.body.password);
         //console.log(user.password);

         if(!user) throw createError(400,"Invalid Login Credentials");
         if(!user.active) throw createError(400,"Deactivated User Account");
    
         const validPass = await bcrypt.compare(req.body.password,user.password);                  
         if(!validPass) throw createError(400,"Invalid User Credentials");

         if(!user.superAdmin && !user.admin && !user.editor) throw createError(400,"Unauthorized Access");
    
         //JWT Token Creation
         const token = jwt.sign({_id : user._id,application:user.application },process.env.TOKEN_SECRET,{expiresIn :60 * 60 * 24});
         res.header('Authorization',token).send({token:token,application:user.application,user:user._id});
     }
     catch(error)
     {
        next(createError(error.status,error.message));
     }
    
});

router.get('/:AppId/getAppUser',verify,async (req,res,next) => {
    try
    {
        const master= await User.findOne({_id: req.user._id},function (error,Appex) {
            if(error) { throw createError(400,"Unknown Token ID"); }
            else{ return Appex; }   
        });
        const token = jwt.sign({_id : master._id},process.env.TOKEN_SECRET,{expiresIn :60 * 60 * 24});
    
        const master_raw= {
            name: master.name,
            email: master.email,
            superAdmin:master.superAdmin,
            admin:master.admin,
            editor:master.editor,
            reader:master.reader,
            _id:master._id,
            token:token
        }; 
    
        res.header('Authorization',token).send(master_raw);
    }

    catch(error)
    {
        next(createError(error.status,error.message));
    }

});


router.post('/changePassword',verify, async (req,res,next) => {
    //validation
    try
    {
       
        //checking if email exists
        const user = await User.findOne({_id: req.user._id},function (error,Appex) {
            if(error) { throw createError(400,"Unknown Token ID"); }
            else{ return Appex; }   
        });
        if(!user) throw createError(400,"Invalid user Account");
        if(!user.active) throw createError(400,"Deactivated User Account");
   
        const validPass = await bcrypt.compare(req.body.oldPassword,user.password);
        if(!validPass) throw createError(400,"Invalid Old Password");
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.newPassword,salt);
        const video = await User.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(user._id) },
            {
              $set: {
                password: hashPassword,
               
              },
            },
            { new: true, upsert: false },
            function (error, Appex) {
              if (error) {
                throw createError(
                  400,
                  "User does not Exist"
                );
              } else {
                res.send(Appex);
              }
            }
          );

         
         
    }
    catch(error)
    {
       next(createError(error.status,error.message));
    }
   
});


router.post(':Id/changeSuperPassword',verify, async (req,res,next) => {
  //validation
  try
  {
     
      //checking if email exists
      const user = await User.findOne({_id:req.params.AppId},function (error,Appex) {
          if(error) { throw createError(400,"Unknown User"); }
          else{ return Appex; }   
      });

      if(!user) throw createError(400,"Invalid user Account");
      if(!user.active) throw createError(400,"Deactivated User Account");
 
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.newPassword,salt);
      const video = await User.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(user._id) },
          {
            $set: {
              password: hashPassword,
             
            },
          },
          { new: true, upsert: false },
          function (error, Appex) {
            if (error) {
              throw createError(
                400,
                "User does not Exist"
              );
            } else {
              res.send(Appex);
            }
          }
        );

       
       
  }
  catch(error)
  {
     next(createError(error.status,error.message));
  }
 
});



export default router;