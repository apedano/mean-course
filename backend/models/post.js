const mongoose = require('mongoose');

//blueprint
const postSchema = mongoose.Schema({
  title: { type: String, require: true },
  content: { type: String, require: true},
  imagePath: { type: String, require: true}
});

//model
module.exports = mongoose.model('Post', postSchema);
