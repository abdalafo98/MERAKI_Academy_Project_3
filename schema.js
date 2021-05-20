const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const users = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  country: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: mongoose.Schema.ObjectId, ref: "Role" },
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
const role = new mongoose.Schema({
  role: { type: String },
  permissions: [{ type: String }],
});

users.pre("save", async function () {
  this.email = this.email.toLowerCase();
  this.password = await bcrypt.hash(this.password, 10);
});
const User = mongoose.model("User", users);
const Article = mongoose.model("Article", article);
const Comment = mongoose.model("Comment", comments);
const Role = mongoose.model("Role", role);

module.exports.User = User;
module.exports.Article = Article;
module.exports.Comment = Comment;
module.exports.Role = Role;
