const express = require('express');

//creates an express app
const app = express();

//use a middlewere function with the request or the response
//the next function is to continue to the next middleware
app.use((req, res,next) => {
  console.log('First middleware');
  next();
});



//the next is not in this function so this is a final step f
app.use('/api/posts', (req, res,next) => {
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
