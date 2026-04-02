import jwt from 'jsonwebtoken';
import createError from "http-errors";

export const verify= (req,res,next) =>{
    const token = req.header('Authorization');
    if(!token) return next(createError(401,'Access Denied'));

    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user=verified;
        next();
    }
    catch(err)
    {
       next(createError(400,'Invalid Token'));
    }
    
}

export const masterVerify= (req,res,next) =>{
    const token = req.header('Authorization');
    if(!token) return next(createError(401,'Access Denied'));

    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.master=verified;
        next();
    }
    catch(err)
    {
       next(createError(400,'Invalid Token'));
    }
    
}

export const viewVerify= (req,res,next) =>{
    const token = req.header('Authorization');
    if(!token) return next(createError(401,'Access Denied'));

    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.app=verified;
        next();
    }
    catch(err)
    {
       next(createError(400,'Invalid Token'));
    }
    
}
