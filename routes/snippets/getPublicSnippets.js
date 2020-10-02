const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Snippet = require("../../models/Snippet");
const colors = require("colors");
const thrownErrorFormatter = require("../../utils/thrownErrorFormatter");
const errorMessageAssembler = require("../../utils/errorMessageAssembler");

//@Desc       Gets all public snippets in the database.
//@Route      GET /snippets
//@Access     Public
router.get("/", async (req, res) => {
  try {
    const snippets = await Snippet.find({ isPrivate: false });
    if (snippets.length > 0) {
      res.status(200).json({
        success: true,
        data: snippets,
      });
    } else {
      throw thrownErrorFormatter(`Databse is empty!`);
    }
  } catch (err) {
    const errorMessage = errorMessageAssembler(err);
    res.status(404).json({
      success: false,
      error: errorMessage,
    });
  }
});

module.exports = router;
