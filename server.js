const createServer = require("./createServer");
const colors = require("colors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const express = require("express");

dotenv.config();

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    const app = createServer();
    const port = process.env.PORT;

    //Prod only stuff
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });

    //End

    app.listen(port, () => console.log(`Server running on port ${port}`.green));
  })
  .catch((err) => console.error(err));

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error: ".red)
);

mongoose.connection.once("open", function () {
  console.log(`Database Connected!`.green);
});

//in production, we need to serve the index.html.
//set static folder.
