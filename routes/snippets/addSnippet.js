const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Snippet = require("../../models/Snippet");
const colors = require("colors");
const errorMessageAssembler = require("../../utils/errorMessageAssembler");

//@Desc       Adds a snippet to the database.
//@Route      POST /snippets
//@Access     Private
router.post("/", async (req, res) => {
  try {
    req.body.authorId = req.body.currentUser._id;
    req.body.authorName = req.body.currentUser.name;

    const newSnippet = await Snippet.create(req.body);

    res.status(201).json({
      success: true,
      data: newSnippet,
      currentUser: req.body.currentUser,
    });
  } catch (err) {
    const errorMessage = errorMessageAssembler(err);
    res.status(404).json({
      success: false,
      error: errorMessage,
    });
    console.error("Error: ".red, errorMessage.red);
  }
});

module.exports = router;
