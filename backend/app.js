const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

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
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

//parser the incoming request body as a json string instead of the standard stream
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended : false }));

//middleware for post requests
app.post('/api/posts', (req, res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  console.log('Post added:' + JSON.stringify(post));
  res.status(201).json({
    message : 'Post added successfully'
  }); //OK, a new resource has been created
});


//the next is not in this function so this is a final step f
// the first input is the filter for the incoming reqest url
app.get('/api/posts', (req, res,next) => {
  Post.find()
  .then(documents => {
    //no next() call
    return res.status(200).json({
      message : 'Posts fetched successfully!',
      posts : documents
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id : req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message : 'Post [' + req.params.id + '] deleted!'});
  })

});

//export the app object
module.exports = app;
