const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Snippet = require("../../models/Snippet");
const colors = require("colors");
const thrownErrorFormatter = require("../../utils/thrownErrorFormatter");
const errorMessageAssembler = require("../../utils/errorMessageAssembler");

//@Desc       Updates a snippet.
//@Route      PUT /snippets/:id
//@Access     Private
router.put("/:id", async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (
      (snippet && belongsToCurrentUser(snippet, req)) ||
      (snippet && likesUpdate(req))
    ) {
      await Snippet.findByIdAndUpdate(req.params.id, req.body);
      const updatedSnippet = await Snippet.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: updatedSnippet,
      });
    } else if (snippet && !belongsToCurrentUser(snippet, req)) {
      throw thrownErrorFormatter(
        `Logged in user is not the original author of the snippet. Nothing updated.`
      );
    } else if (!snippet) {
      throw thrownErrorFormatter(
        `Snippet with Id of ${req.params.id} does not exist. Nothing updated.`
      );
    }
  } catch (err) {
    const errorMessage = errorMessageAssembler(err);
    res.status(400).json({
      success: false,
      error: errorMessage,
    });
    console.error("Error: ".red, errorMessage.red);
  }
});

const belongsToCurrentUser = (snippet, req) => {
  return snippet.authorId == req.body.currentUser._id;
};

const likesUpdate = (req) => {
  return (
    Object.keys(req.body).length === 2 &&
    Object.keys(req.body).includes("likes")
  );
};

module.exports = router;
