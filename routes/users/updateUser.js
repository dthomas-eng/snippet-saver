const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/User");
const colors = require("colors");
const errorMessageAssembler = require("../../utils/errorMessageAssembler");
const thrownErrorFormatter = require("../../utils/thrownErrorFormatter");

//@Desc       Updates user info.
//@Route      PUT /users
//@Access     Private
router.put("/", async (req, res) => {
  try {
    const likes = req.body.likes;
    const currentUserId = req.body.currentUser._id;

    const newLikes = { likes };

    await User.findByIdAndUpdate(currentUserId, newLikes);
    const updatedUser = await User.findById(currentUserId);
    res.status(200).json({
      success: true,
      data: updatedUser,
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
