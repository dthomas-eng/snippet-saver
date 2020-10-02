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

//@Desc       Adds a user to the database.
//@Route      POST /user
//@Access     Public
router.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    if (email === undefined || name === undefined || password === undefined) {
      throw thrownErrorFormatter("Name, Email, and Password are required. ");
    }

    if (!passwordIsValid(password)) {
      throw thrownErrorFormatter(
        "Password must be at least 8 characters long with at least one number and one letter. "
      );
    }

    let userAlreadyInDatabase = await User.findOne({
      $or: [{ email }, { name }],
    });
    if (userAlreadyInDatabase) {
      throw thrownErrorFormatter(
        "A user with that email or name already exists. "
      );
    }

    const hash = bcrypt.hashSync(password, 10);
    const newUser = {
      email,
      name,
      password: hash,
    };

    const newUserInDatabase = await User.create(newUser);
    const authorization = generateToken(newUserInDatabase);

    res.status(201).json({
      success: true,
      authorization,
      data: {
        likes: newUserInDatabase.likes,
        _id: newUserInDatabase._id,
        email: newUserInDatabase.email,
        name: newUserInDatabase.name,
      },
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

const passwordIsValid = (password) => {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/.test(password);
};

const generateToken = (user) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: user._id,
    },
    process.env.JWT_SECRET
  );
  return token;
};

module.exports = router;
