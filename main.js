const express = require("express");
const { uuid } = require("uuidv4");
const db = require("./db");
const { User, Article, Comment } = require("./schema");
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

  await User.findOne({ email: email, password: password })
    .then((result) => {
      if (result) {
        res.status(200);
        res.json("Valid login credentials");
      } else {
        res.json("Invalid login credentials");
        res.status(401);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

app.post("/login", login);
///////////////////////////////////////////
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
app.post("/articles/:id/comments", createNewComment);
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
