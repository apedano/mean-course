const express = require("express");
const multer = require('multer');
const Post = require('../models/post');

const router = express.Router();

const ALLOWED_MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

//where multer should put files from incoming requests
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = ALLOWED_MIME_TYPE_MAP[file.mimetype]; // if the mimetype is one of the allowed ones in the map
    let error = new Error("Mime type [" + file.mimetype + "] is invalid");
    if (isValid) {
      error = null;
    }
    callback(error, "backend/images"); //error, path for saving files (relative to server.js path)
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = ALLOWED_MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + extension);
  }
});

//middleware for post requests
//first param the assigned path, the following are a list of request handler
//multer with the storage configured, expect a single file on the "image" property of the reqeust body
router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
  console.log("Save posts");
  const serverUrl = req.protocol + '://' + req.get('host');
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: serverUrl + '/images/' + req.file.filename // not beckend because the images folder will be accessible after our domanin name
  });
  post.save(post).then(createdPost => { //the created posted is the one stored in MongoDb
    console.log('Post added:' + JSON.stringify(createdPost));
    res.status(201).json({
      message : 'Post added successfully',
      post : {
        id: createdPost._id, // we add/overwrite this field
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    }); //OK, a new resource has been created
  });

});

router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath; //part of the body (postData in the posts.service for updatePost logic)
  //if the req contains a file, a new file has been uploaded
  if(req.file) {
    const serverUrl = req.protocol + '://' + req.get('host');
    imagePath = serverUrl + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({ _id: req.params.id}, post).then(result => {
    res.status(200).json({messge: "Update successfull!"});
  });
});


//the next is not in this function so this is a final step f
// the first input is the filter for the incoming reqest url
router.get('', (req, res,next) => {
  console.log("Get posts");
  // req.query; // query string of the request
  const pageSize = +req.query.pagesize; //with the + is parsed as a number
  const currentPage = req.query.page;
  const postQuery = Post.find();
  if(pageSize && currentPage) {
    console.log("Page:" + pageSize + "-" + currentPage);
    //select a slice of posts
    postQuery
      .skip(pageSize * (currentPage - 1)) // mooongoose - not all posts but after a certain amount
      .limit(pageSize); // moongoose - number of posts retrieved
  }
  //fetch all posts
  postQuery
  .then(documents => {
    //no next() call
    return res.status(200).json({
      message : 'Posts fetched successfully!',
      posts : documents
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "Post not found!"})
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id : req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message : 'Post [' + req.params.id + '] deleted!'});
  })

});

module.exports = router;
