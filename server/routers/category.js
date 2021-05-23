const express = require("express");
const Category = require("../models/category");
const auth = require("../middleware/auth");
const router = new express.Router();

//CREATE CATEGORY
router.post("/categories", auth, async (req, res) => {
  const category = new Category({
    type: req.body.type,
    owner: req.user._id,
  });
  try {
    await category.save();
    res.status(201).send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

// READ CATEGORY
router.get("/categories", auth, async (req, res) => {
  const match = {};
  const sort = {};

  try {
    await req.user
    .populate({
      path: "categories",
      match,
      options: {
        skip: parseInt(req.query.skip),
        sort,
      },
    })
    .execPopulate();
  res.send(req.user.categories);
  } catch (e) {
    res.status(500).send();
  }
});

//UPDATE CATEGORY
router.put("/categories/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["type"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const category = await Category.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!category) {
      return res.status(404).send();
    }

    updates.forEach((update) => (category[update] = req.body[update]));
    await category.save();

    res.send(category);
  } catch (e) {
    res.status(400).send();
  }
});

// DELETE CATEGORY
router.delete("/categories/:id", auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!category) {
      return res.status(404).send();
    }

    res.status(200).send(category);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;

// GET /categories?sortBy=createdAt:desc
// GET /categories?completed=true
router.get("/categories", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "categories",
        match,
        options: {
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.categories);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/categories/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const category = await Category.findOne({ _id, owner: req.user._id });

    if (!category) {
      return res.status(404).send();
    }

    res.send(category);
  } catch (e) {
    res.status(500).send();
  }
});

//UPDATE CATEGORY
router.put("/category/:id", auth, async (req, res) => {
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
    const category = await Category.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!category) {
      return res.status(404).send();
    }

    updates.forEach((update) => (category[update] = req.body[update]));
    await category.save();

    res.send(category);
  } catch (e) {
    res.status(400).send();
  }
});

// DELETE CATEGORY
router.delete("/categories/:id", auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!category) {
      return res.status(404).send();
    }

    res.status(200).send(category);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
