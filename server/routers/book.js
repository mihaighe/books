const express = require("express");
const Book = require("../models/book");
const auth = require("../middleware/auth");
const router = new express.Router();

// title, author, description, rating, stars, category, owner

//CREATE BOOK
router.post("/books", auth, async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    category: req.body.category,
    rating: req.body.rating,
    stars: req.body.stars,
    owner: req.user._id,
  });
  try {
    await book.save();
    res.status(201).send(book);
  } catch (e) {
    console.log(e);
    if (e.name === "ValidationError") {
      let errors = {};
      Object.keys(e.errors).forEach((key) => {
        errors[key] = e.errors[key].message;
      });
      return res.status(422).send(errors);
    }
    res.status(400).send(e);
  }
});


// GET /books?sortBy=title:asc
// GET /books?sortBy=author:asc
router.get("/books", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    console.log(sort)
  }
  // options: { limit: parseInt(req.query.limit) }
  try {
    await req.user
      .populate({
        path: "books",
        match,
        options: {
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.books);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/books/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const book = await Book.findOne({ _id, owner: req.user._id });

    if (!book) {
      return res.status(404).send();
    }

    res.send(book);
  } catch (e) {
    res.status(500).send();
  }
});

//UPDATE BOOK
router.put("/book/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "author",
    "description",
    "rating",
    "stars",
    "category",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const book = await Book.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!book) {
      return res.status(404).send();
    }

    updates.forEach((update) => (book[update] = req.body[update]));
    await book.save();

    res.send(book);
  } catch (e) {
    res.status(400).send();
  }
});

// DELETE BOOK
router.delete("/books/:id", auth, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!book) {
      return res.status(404).send();
    }

    res.status(200).send(book);
  } catch (e) {
    res.status(500).send();
  }
});



module.exports = router;


// Book.find({ title: { $regex: "ut", $options: "i" } }, function(err, docs) {
//   console.log("Partial Search Begins");
//   console.log(docs);
//   });