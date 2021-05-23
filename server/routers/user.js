const express = require("express");
const User = require("../models/user");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const router = new express.Router();
const multer = require("multer");

// USER REGISTER
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    if (e.name === "ValidationError") {
      let errors = {};
      Object.keys(e.errors).forEach((key) => {
        errors[key] = e.errors[key].message;
      });
      console.log(errors);
      return res.status(422).send(errors);
    }
    res.status(400).send(e);
  }
});

// USER LOGIN
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// USER LOGOUT
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send("Successfully logged out");
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    req.send("Successfully logged out from all devices");
  } catch (e) {
    res.status(500).send();
  }
});

// USER PROFILE
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// USER UPDATE
router.put("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    updates.forEach((update) => {
      if (req.body[update] != "") req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    if (e.name === "ValidationError") {
      let errors = {};
      Object.keys(e.errors).forEach((key) => {
        errors[key] = e.errors[key].message;
      });
      console.log(errors);
      return res.status(422).send(errors);
    }
    res.status(422).send({ error: "Email is already taken" });
  }
});

// USER DELETE
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a JPG, JPEG or PNG image"));
    }
    cb(undefined, true);
  },
});

// UPLOAD AVATAR
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send({ message: "Upload completed" });
  },
  (error, req, res, next) => {
    res.status(400).send({ message: error.message });
  }
);

// DELETE AVATAR
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.sendStatus(200);
});

// GET AVATAR
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
     
    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.send("noAvatar");
  }
});

module.exports = router;
