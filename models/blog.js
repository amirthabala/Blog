const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
  Name:{ type: String, required: true },
  Email:{ type: String, required: true},
  Blogimg:{ type: String, required: true},
  Photo:{ type: String, required: true},
  Type:{ type: String, required: true},
  Like:{ type: Number, required: true},
  Dislike:{ type: Number, required: true},
  Title:{ type: String, required: true },
  Description:{ type: String, required: true },
});

const blog = mongoose.model('blog', blogSchema);

module.exports = blog;