const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/User");
const colors = require("colors");
const errorMessageAssembler = require("../../utils/errorMessageAssembler");

//@Desc       Gets username, email, and id of logged in user.
//@Route      GET /users
//@Access     Private
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.currentUser._id });
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (caughtError) {
    const errorMessage = errorMessageAssembler(caughtError);
    res.status(404).json({
      success: false,
      error: errorMessage,
    });
  }
});

module.exports = router;
