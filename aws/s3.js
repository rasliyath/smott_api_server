import express from 'express';
import aws from 'aws-sdk'
import dotenv from 'dotenv';
import crypto from "crypto";
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes)

const region ='us-east-2';
const bucket = 'smottstorage';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const s3 = new aws.S3({
region,
accessKeyId,
secretAccessKey,
signatureVersion: 'v4'

});

//uploads image to s3
export const generateUploadURL = async(file) =>
{
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')+"."+file;
    
  
    const params = ({
      Bucket: bucket,
      Key: imageName,
      Expires: 900
    })
    
    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    const data ={
      url :uploadURL,
      key :imageName
    }
    return data;
}



//downloads from s3