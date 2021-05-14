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

const getAllArticles = () => {
  app.get("/articles", (req, res) => {
    res.status(200);
    res.json(articles);
  });
};

const getAnArticleById = () => {
  app.get(`/articles/:id`, (req, res) => {
    const id = req.params.id;
    const found = articles.find((element, i) => {
      console.log(element.id, element.id === id);
      return element.id == id;
    });
    if (found) {
      res.status(200);
      res.json(found);
    } else {
      res.status(404);
      res.json("not found");
    }
  });
};

// getAllArticles();
getAnArticleById();
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
