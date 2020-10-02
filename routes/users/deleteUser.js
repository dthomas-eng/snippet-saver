const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Snippet = require("../../models/Snippet");
const User = require("../../models/User");
const colors = require("colors");
const errorMessageAssembler = require("../../utils/errorMessageAssembler");

//@Desc       Deletes logged in user and associated snippets.
//@Route      DELETE /users
//@Access     Private
router.delete("/", async (req, res) => {
  try {
    await User.findOneAndRemove({ _id: req.body.currentUser._id });
    await Snippet.deleteMany({ authorId: req.body.currentUser._id });
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    const errorMessage = errorMessageAssembler(err);
    res.status(400).json({
      success: false,
      error: errorMessage,
    });
    console.error("Error: ".red, errorMessage.red);
  }
});

module.exports = router;
