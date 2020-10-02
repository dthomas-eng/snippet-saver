var express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const userId = jwt.verify(
        req.headers.authorization.replace("Bearer ", ""),
        process.env.JWT_SECRET
      ).data;
      req.body.currentUser = await User.findOne({ _id: userId });
      next();
    } else {
      throw {
        message: "Unauthorized",
      };
    }
  } catch (err) {
    const errorMessage = err.message;
    res.status(401).json({
      success: false,
      error: errorMessage,
    });
    console.error("Error: ".red, errorMessage.red);
  }
};

module.exports = auth;
