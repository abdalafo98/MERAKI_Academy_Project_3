const express = require("express");
const app = express();
const port = 5000;

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

const getAllArticles = (req, res) => {
  res.status(200);
  res.json(articles);
};
app.get("/articles", getAllArticles);

const getAnArticleById = (req, res) => {
  const id = req.query.id;
  const found = articles.find((element, i) => {
    console.log(element.id, element.id === id);
    return element.id === Number(id);
  });
  if (found) {
    res.status(200);
    res.json(found);
  } else {
    res.status(404);
    res.json("not found");
  }
};

app.get(`/articles/:id`, getAnArticleById);

const getArticlesByAuthor = (req, res) => {
  const author = req.query.author;
  const found = articles.find((element, i) => {
    console.log(element.author, author);
    return element.author === author;
  });
  if (found) {
    res.status(200);
    res.json(found);
  } else {
    res.status(404);
    res.json("not found");
  }
};

app.get(`/articles/search_1`, getArticlesByAuthor);

const createNewArticle = (req, res) => {
  const newArticle = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
  };
  articles.push(newArticle);
  res.status(201);
  res.json(newArticle);
};
app.post("/articles", createNewArticle);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
