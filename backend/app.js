const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); //for constructiong paths correctly

const postsRoutes = require('./routes/posts');

//creates an express app
const app = express();

mongoose.connect("mongodb+srv://apedano:4CyDwqQfjZPwPLpN@apcluster-mxnfb.azure.mongodb.net/node-angular?retryWrites=true")
.then(() => {
  console.log('Connected to MongpDb');
})
.catch(() => {
  console.error('Connection failed!');
});

//use a middlewere function with the request or the response
//the next function is to continue to the next middleware
app.use((req, res,next) => {
  console.log('First middleware');
  next();
});

//
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//parser the incoming request body as a json string instead of the standard stream
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended : false }));

//express built-in middleware for accessing static resources
app.use("/images", express.static(path.join('backend/images'))); //maps the local path in the beckend with the exposed /images path

app.use("/api/posts", postsRoutes);


//export the app object
module.exports = app;
