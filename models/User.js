const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [50, "Name must be less than 50 characters long. "],
    required: [true, "Name is required. "],
  },
  email: {
    type: String,
    maxlength: [50, "Email must be less than 50 characters long. "],
    required: [true, "Email is required. "],
    validate: {
      validator: function (v) {
        return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid email address `,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required. "],
    select: false,
  },
  passwordResetToken: {
    type: String,
    default: null,
    select: false,
  },
  likes: [String],
});

module.exports = mongoose.model("User", UserSchema);
