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

//@Desc       Compares supplied login with database. Returns JWT if success.
//@Route      POST /auth
//@Access     Public
router.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (email === undefined || password === undefined) {
      throw thrownErrorFormatter("Email and Password are required. ");
    }

    const user = await User.findOne({
      email,
    }).select("+password");
    if (!user) {
      throw thrownErrorFormatter("Invalid Credentials");
    }

    if (passwordMatches(password, user)) {
      const authorization = generateToken(user);
      res.status(200).json({
        success: true,
        authorization,
        data: {
          likes: user.likes,
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    } else {
      throw thrownErrorFormatter("Invalid Credentials");
    }
  } catch (err) {
    const errorMessage = errorMessageAssembler(err);
    res.status(401).json({
      success: false,
      error: errorMessage,
    });
    console.error("Error: ".red, errorMessage.red);
  }
});

const passwordMatches = (password, user) => {
  if (bcrypt.compareSync(password, user.password)) {
    return true;
  } else {
    return false;
  }
};

const generateToken = (user) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 6000 * 6000,
      data: user._id,
    },
    process.env.JWT_SECRET
  );
  return token;
};

module.exports = router;
