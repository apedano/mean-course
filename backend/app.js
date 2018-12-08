const express = require('express');
const bodyParser = require('body-parser');

//creates an express app
const app = express();

//use a middlewere function with the request or the response
//the next function is to continue to the next middleware
app.use((req, res,next) => {
  console.log('First middleware');
  next();
});

//
app.use((req, res,next) => {
  //Cross Origing Resource Sharing
  console.log('Adding CORS header');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATH, DELETE, OPTIONS'
    );
  next();
});
//7yUenK2ZCOHrCXUw
//parser the incoming request body as a json string instead of the standard stream
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended : false }));

//middleware for post requests
app.post('/api/posts', (req, res,next) => {
  const post = req.body;
  console.log('Post added:' + JSON.stringify(post));
  res.status(201).json({
    message : 'Post added successfully'
  }); //OK, a new resource has been created
});


//the next is not in this function so this is a final step f
// the first input is the filter for the incoming reqest url
app.get('/api/posts', (req, res,next) => {
  const posts = [
    {
      id: "saduhasd",
      title : "First server-side post",
      content : "This is coming from the server"
    },
    {
      id: "sdiuhsefdv",
      title : "Second server-side post",
      content : "This is coming from the server too!"
    }
  ];
  //no next() call
  return res.status(200).json({
    message : 'Posts fetched successfully!',
    posts : posts
  });
});



//export the app object
module.exports = app;
