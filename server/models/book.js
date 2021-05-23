const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: String,
      default: 'neutral',
    },
    stars: {
      type: Number,
      default: 3,
      validate(value) {
        if (value < 1 && value > 5) {
          throw new Error("Invalid star selection");
        }
      },
    },
    category: {
      type: String,
      default: 'Miscellaneous',
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
