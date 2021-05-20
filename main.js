const express = require("express");
const { uuid } = require("uuidv4");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");
const SECRET = process.env.SECRET;
const { User, Article, Comment, Role } = require("./schema");
const app = express();
const port = 5000;
////////////////////////////
const articles = [
  {
    id: 1,
    title: "How I learn coding?",
    description: "Lorem, Quam, mollitia.",
    author: "Jouza",
  },
  {
    id: 2,
    title: "Coding Best Practices",
    description: "Lorem, ipsum dolor sit, Quam, mollitia.",
    author: "Besslan",
  },
  {
    id: 3,
    title: "Debugging",
    description: "Lorem, Quam, mollitia.",
    author: "Jouza",
  },
];
app.use(express.json());
////////////////////////////////////////////////////////

const getAllArticles = (req, res) => {
  Article.find({})
    .then((result) => {
      res.status(200);
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
app.get("/articles", getAllArticles);
/////////////////////////////////////////////////

const getAnArticleById = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Article.find({ author: id })
    .populate("users")
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200);
      res.json(result);
    })
    .catch((err) => {
      res.status(404);
      res.json("not found");
    });
};
///////////////////////////////////////////////////////////////
const getArticlesByAuthor = async (req, res) => {
  const author = req.query.author;
  let id;
  await User.findOne({ firstName: author })
    .then((result) => {
      id = result._id;
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(id, "id");
  Article.find({ author: id })
    .then((result) => {
      console.log(result);
      res.status(200);
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(404);
      res.json("not found");
    });
};

app.get(`/articles/search_1`, getArticlesByAuthor);
app.get(`/articles/:id`, getAnArticleById);
//////////////////////////////////////////////////////////////////////
const createNewArticle = (req, res) => {
  const { title, description, author } = req.body;
  const newArticle = new Article({ title, description, author });

  newArticle
    .save()
    .then((result) => {
      res.json(result);
      res.status(201);
    })
    .catch((err) => {
      console.log(err);
    });
};
app.post("/articles", createNewArticle);
/////////////////////////////////////////////////////////////////////////
const updateAnArticleById = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Article.findOneAndUpdate({ author: id }, req.body)
    .then((result) => {
      console.log(result);
      res.status(200);
      res.json(result);
    })
    .catch((err) => {
      res.status(404);
      res.json(err);
    });
};

app.put("/articles/:id", updateAnArticleById);
///////////////////////////////////////////////////////////////////
const deleteArticleById = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Article.deleteOne({ _id: id })
    .then((result) => {
      console.log(result);
      res.status(200);
      res.json(result);
    })
    .catch((err) => {
      res.status(404);
      res.json(err);
    });
};
app.delete("/articles/:id", deleteArticleById);
////////////////////////////////////////////////////////////////////
const deleteArticlesByAuthor = async (req, res) => {
  const author = req.body.author;
  console.log(author);

  let id;
  await User.findOne({ firstName: author })
    .then((result) => {
      id = result._id;
    })
    .catch((err) => {
      console.log(err);
    });
  Article.deleteMany({ author: id })
    .then((result) => {
      console.log(result);
      res.status(200);
      res.json(result);
    })
    .catch((err) => {
      res.status(404);
      res.json(err);
    });
};
app.delete("/articles", deleteArticlesByAuthor);
////////////////////////////////////////////////////////////////////
const createNewAuthor = (req, res) => {
  const { firstName, lastName, age, country, email, password } = req.body;
  const user1 = new User({
    firstName,
    lastName,
    age,
    country,
    email,
    password,
  });
  user1
    .save()
    .then((result) => {
      res.json(result);
      res.status(201);
    })
    .catch((err) => {
      console.log(err);
    });
};

app.post("/users", createNewAuthor);
////////////////////////////////////////////////////////////////
const login = async (req, res) => {
  const { email, password } = req.body;

  await User.findOne({ email: email })
    .then((result) => {
      if (result) {
        // console.log(result);
        console.log(result.password);
        console.log(password);
        bcrypt.compare(password, result.password, (err, result_1) => {
          console.log(result_1, "were");
          if (result_1) {
            const payload = { userId: result._id, country: result.country };
            const options = { expiresIn: "60m" };
            console.log(secret);
            const token = jwt.sign(payload, SECRET, options);
            res.json(token);
          } else {
            console.log(result_1);

            res.json({
              message: "The password you’ve entered is incorrect",
              status: 403,
            });
          }
        });
      } else {
        res.json({ message: "The email doesn't exist", status: 404 });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

app.post("/login", login);
///////////////////////////////////////////
const authentication = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(404);
    res.json("no token");
  }
  console.log(req.headers.authorization);
  const token = req.headers.authorization.split(" ")[1];
  console.log();
  try {
    const ver = jwt.verify(token, SECRET);
    if (ver) {
      req.token = ver;
      next();
    }
  } catch (err) {
    res.status(403);
    return res.json({
      message: "the token is invalid or expired",
      status: 403,
    });
  }
};
const createNewComment = (req, res) => {
  const { comment, commenter } = req.body;
  const newComment = new Comment({ comment, commenter });
  newComment
    .save()
    .then((result) => {
      res.json(result);
      res.status(201);
      Article.update(
        { _id: req.params.id },
        { $push: { comments: result._id } }
      ).exec();
    })
    .catch((err) => {
      console.log(err);
    });
};
app.post("/articles/:id/comments", authentication, createNewComment);
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
