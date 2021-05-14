const express = require("express");
const { uuid } = require("uuidv4");
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
  const id = req.params.id;
  const found = articles.find((element, i) => {
    return element.id == id;
  });
  if (found) {
    res.status(200);
    res.json(found);
  } else {
    res.status(404);
    res.json("not found");
  }
};

const getArticlesByAuthor = (req, res) => {
  const author = req.query.author;
  console.log(author);
  const found = articles.filter((element, i) => {
    // console.log(element.author, author);
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
app.get(`/articles/:id`, getAnArticleById);

const createNewArticle = (req, res) => {
  const newArticle = {
    id: uuid(),
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
  };
  articles.push(newArticle);
  res.status(201);
  res.json(newArticle);
};
app.post("/articles", createNewArticle);

const updateAnArticleById = (req, res) => {
  const id = req.params.id;
  let index;
  const found = articles.find((element, i) => {
    index = i;
    return element.id == id;
  });

  if (found) {
    articles[index] = {
      id: id,
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
    };
    res.status(200);
    res.json(articles[index]);
  } else {
    res.status(404);
    res.json("not found");
  }
};

app.put("/articles/:id", updateAnArticleById);

const deleteArticleById = (req, res) => {
  const id = req.params.id;
  const message = {
    success: true,
    massage: `Success Delete article with id => ${id}`,
  };
  let index;
  const found = articles.filter((element, i) => {
    index = i;
    return element.id == id;
  });

  if (found) {
    articles.splice(index, 1);
    res.status(200);
    res.json(message);
  } else {
    res.status(404);
    res.json("not found");
  }
};
app.delete("/articles/:id", deleteArticleById);

const deleteArticlesByAuthor = (req, res) => {
  const author = req.body.author;
  const message = {
    success: true,
    massage: `Success Delete article with id => ${author}`,
  };
  const found = articles.filter((element, i) => {
    return element.author === author;
  });

  if (found) {
    articles.map((element, index) => {
      if (element.author === author) {
        articles.splice(index, 1);
      }
    });
    res.status(200);
    res.json(message);
  } else {
    res.status(404);
    res.json("not found");
  }
};
app.delete("/articles", deleteArticlesByAuthor);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
