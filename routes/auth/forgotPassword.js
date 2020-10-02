const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/User");
const colors = require("colors");
const thrownErrorFormatter = require("../../utils/thrownErrorFormatter");
const errorMessageAssembler = require("../../utils/errorMessageAssembler");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/sendEmail");
require("dotenv").config();

//@Desc       Compares supplied email address with database. Emails JWT to that email address if found.
//@Route      POST /forgotPassword
//@Access     Public
router.post("/", async (req, res) => {
  try {
    const email = req.body.email;

    if (email === undefined) {
      throw thrownErrorFormatter("Email is required. ");
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw thrownErrorFormatter("User not found. ");
    }

    const passwordResetToken = generatePasswordResetToken(user._id);

    await User.updateOne(
      {
        email,
      },
      {
        passwordResetToken,
      }
    );

    sendEmail(
      email,
      "Password Reset",
      `Password reset link: localhost:3001/resetPassword/${passwordResetToken}`
    );

    res.status(200).json({
      success: true,
      email,
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

const generatePasswordResetToken = (id) => {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: id,
    },
    process.env.JWT_SECRET
  );
};

module.exports = router;
