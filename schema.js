const mongoose = require("mongoose");

const users = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  country: { type: String },
  email: { type: String },
  password: { type: String },
});

const article = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  author: { type: mongoose.Schema.ObjectId, ref: "User" },
  comments: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

const comments = new mongoose.Schema({
  comment: { type: String },
  commenter: { type: mongoose.Schema.ObjectId, ref: "User" },
});
const User = mongoose.model("User", users);
const Article = mongoose.model("Article", article);
const Comment = mongoose.model("Comment", comments);

module.exports.User = User;
module.exports.Article = Article;
module.exports.Comment = Comment;
