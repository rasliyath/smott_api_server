import Joi from '@hapi/joi';


//Register Validation
export const registerValidation= (data)=>{
    const schema =Joi.object({
        name : Joi.string().min(6).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        admin: Joi.boolean().required(),
        reader: Joi.boolean().required(),
        editor: Joi.boolean().required(),
        superAdmin: Joi.boolean().required()
    });
    return schema.validate(data);
}
export const loginValidation= (data)=>{
    const schema =Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    
    });
    return schema.validate(data);
}

//Password Validation
export const passwordValidation= (data)=>{
    const schema =Joi.object({
        password: Joi.string().min(6).required()
        
    });
    return schema.validate(data);
}

//Master Validation
export const masterValidation= (data)=>{
    const schema =Joi.object({
        name : Joi.string().min(6).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        analytics: Joi.boolean().required(),
        admin: Joi.boolean().required(),
        reader: Joi.boolean().required(),
        rgbId : Joi.string().required()
    
    });
    return schema.validate(data);
}