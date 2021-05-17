const mongoose = require("mongoose");

const users = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  email: { type: String },
  password: { type: String },
});

const article = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  author: { type: mongoose.Schema.ObjectId, ref: "users" },
});

const User = mongoose.model("User", users);
const Article = mongoose.model("Article", article);

module.exports.User = User;
module.exports.Article = Article;
