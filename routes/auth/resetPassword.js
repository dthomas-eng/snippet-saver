const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const colors = require("colors");
const thrownErrorFormatter = require("../../utils/thrownErrorFormatter");
const errorMessageAssembler = require("../../utils/errorMessageAssembler");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//@Desc       Route including token is hit - allows reset of password.
//@Route      PUT /resetPassword
//@Access     Public
router.put("/", async (req, res) => {
  try {
    const password = req.body.password;
    const token = req.body.token;

    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: tokenPayload.data }).select(
      "+passwordResetToken"
    );
    if (!user) {
      throw thrownErrorFormatter("User not found. ");
    }
    if (token !== user.passwordResetToken) {
      throw thrownErrorFormatter("Bad reset link. ");
    }
    if (password === undefined) {
      throw thrownErrorFormatter("Password is required. ");
    } else if (!passwordIsValid(password)) {
      throw thrownErrorFormatter(
        "Password must be at least 8 characters long with at least one number and one letter. "
      );
    } else {
      const hash = bcrypt.hashSync(password, 10);
      await User.findByIdAndUpdate(user._id, {
        password: hash,
        passwordResetToken: null,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    const errorMessage = errorMessageAssembler(err);
    res.status(401).json({
      success: false,
      error: errorMessage,
    });
    console.error("Error: ".red, errorMessage.red);
  }
});

const passwordIsValid = (password) => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
};

module.exports = router;
