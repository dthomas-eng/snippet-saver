const mongoose = require("mongoose");

const SnippetSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: [150, "Title must be < 150 characters. "],
    required: [true, "Title is required. "],
  },
  notes: {
    type: String,
    maxlength: [500, "Notes must be < 500 characters. "],
  },
  code: {
    value: {
      type: String,
      maxlength: [1000, "Code must be < 1000 characters. "],
      required: [true, "Code is required. "],
    },
  },
  language: {
    type: String,
    required: [true, "Language is required. "],
  },
  dateUpdated: {
    type: Date,
    required: [true, "Date is required. "],
  },
  authorId: {
    type: String,
    required: [true, "AuthorId is required. "],
  },
  authorName: {
    type: String,
    maxlength: [150, "Author name must be < 150 characters. "],
    required: [true, "Author name is required. "],
  },
  isPrivate: {
    type: Boolean,
    required: [true, "Public or private designation is required. "],
  },
  likes: {
    type: Number,
    required: [true, "Number of likes is required. "],
  },
});

module.exports = mongoose.model("Snippet", SnippetSchema);
