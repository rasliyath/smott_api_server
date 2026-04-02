import mongoose from 'mongoose';

let connections = {};

export const getDatabaseConnection = (url,dbName) => {

    if(connections[dbName]) {
        //database connection already exist. Return connection object
        return connections[dbName];
    } else {
        connections[dbName] = mongoose.createConnection(url,{ useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false,});
        return connections[dbName];
    }       
}