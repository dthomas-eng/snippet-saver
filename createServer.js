const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./middleware/auth");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

function createServer() {
  const app = express();

  app.use(bodyParser.json());

  const rateLimiter = rateLimit({
    windowMS: 10 * 60 * 1000,
    max: 100,
  });

  app.use(rateLimiter);
  app.use(mongoSanitize());
  //app.use(helmet());
  //app.use(xss());
  app.use(hpp());
  app.use(cors());

  app.use("/snippets", require("./routes/snippets/getPublicSnippets"));
  app.use("/snippets", auth, require("./routes/snippets/getPrivateSnippets"));
  app.use("/snippets", auth, require("./routes/snippets/updateSnippet"));
  app.use("/snippets", auth, require("./routes/snippets/deleteSnippet"));
  app.use("/snippets", auth, require("./routes/snippets/addSnippet"));

  app.use("/users", require("./routes/users/addUser"));
  app.use("/users", auth, require("./routes/users/getUser"));
  app.use("/users", auth, require("./routes/users/updateUser"));
  app.use("/users", auth, require("./routes/users/deleteUser"));

  app.use("/auth", require("./routes/auth/login"));

  app.use("/forgotPassword", require("./routes/auth/forgotPassword"));
  app.use("/resetPassword", require("./routes/auth/resetPassword"));

  return app;
}

module.exports = createServer;
