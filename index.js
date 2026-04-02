import compression from 'compression';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/auth.js';
import testRoute from './routes/test.js';
import videoProcessingRoute from './routes/videoProcessing.js';
import qoeRoute from './routes/qoe.js';
import appRoute from './smottrgb/application.js';
import masterRoute from './smottrgb/rgb.js';
import awsRoute from "./aws/awsRoute.js";
import VCMSRoute from "./video_cloud/create.js";
import layoutRoute from "./layout/item.js";
import viewRoute from "./view/view.js"
import subscribeRoute from "./subscription/subscribe.js";
import publishRoute from "./publish/index.js";
import analyticRoute from "./analytics/alrayyan.js";
import statRoute from "./analytics/count.js";
import {getDatabaseConnection} from "./connections/connection.js";
import logger from './logger/index.js';
import { Server } from "socket.io";
import http from 'http';
import serverRoute from "./socket/server.js";
import {currentCpuUsage} from "./socket/function.js";
import googleAnalyticRoute from "./analytics/google_analytics.js";




const app = express();
const PORT = process.env.PORT || 6050;
const server = http.createServer(app)
const io = new Server(server, {
  transports:['polling'],
  cors:{
    cors: {
      origin: "*"
    }
  }
})

io.on('connection', (socket) => {
  console.log('A user is connected');

  socket.on('message', (message) => {
    console.log(`message from ${socket.id} : ${message}`);
  })
  

  socket.on('disconnect', () => {
    console.log(`socket ${socket.id} disconnected`);
  })
})

export {io};


//Environment Variable
dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false,},
() => logger.info('MAGNABASE DB CONNECTION ATTEMPT: DONE')
);


// Mongoose Error Checking 

var db = mongoose.connection;

// var db= getDatabaseConnection(process.env.DB_connect,"myFirstDatabase")
db.on('error', function (err) {
   logger.error('MAGNABASE DB CONNECTION STATUS : FAIL ');
   logger.error(err);
});
db.once('open', function() {
 // we're connected!
 logger.info("MAGNABASE DB CONNECTION STATUS : PASS");
});



// IMPORT ROUTES



var whitelist = ['http://localhost:3000', 'http://localhost:3001', 'http://10.10.11.240:3000']
/* var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


app.use(cors(corsOptions)); */

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // Will not compress responses, if this header is present
    return false;
  }
  else
  {
    return true;
  }
}
/* app.use(compression({
  // filter: Decide if the answer should be compressed or not,
  // depending on the 'shouldCompress' function above
  filter: shouldCompress,
  // threshold: It is the byte threshold for the response 
  // body size before considering compression, the default is 1 kB
  threshold: 0.01})); */
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ],
  credentials: true
};

app.options('*', cors(corsOptions)); // ✅ Handle preflight BEFORE all other middleware
app.use(cors(corsOptions));
// Compress all HTTP responses

app.use(express.json());




//ROUTE MIDDLEWARE
app.use('/api/user/',authRoute);
app.use('/api/posts/',testRoute);
app.use('/api/video-processing/',videoProcessingRoute);
app.use('/api/qoe/', qoeRoute);
app.use('/api/app/',appRoute);
app.use('/api/master',masterRoute);
app.use('/api/aws/',awsRoute);
app.use('/api/vcms/',VCMSRoute);
app.use('/api/layout/',layoutRoute);
app.use('/api/view/',viewRoute);
app.use('/api/subscribe/',subscribeRoute);
app.use('/api/publish/',publishRoute);
app.use('/api/alrayyan/',analyticRoute);
app.use('/api/analytics/',googleAnalyticRoute)
app.use('/api/realtime/',serverRoute);
app.use('/api/stats/',statRoute);
app.listen(PORT,() => {
  logger.info('MAGNABASE STARTED AND LISTENING ON PORT '+PORT);


} );

//Error Handling
app.use((err, req, res, next) => {
  logger.error("API ERROR: " + err.message);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: err.message || "Internal Server Error",
    },
  });
});
