const mongoose = require("mongoose");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

const initBeforeAndAfterEach = () => {
  beforeEach(async (done) => {
    mongoose.connect(
      process.env.TEST_DB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      () => done()
    );

    const hash = bcrypt.hashSync("test1234", 10);
    const testUser = {
      _id: "5f5a799991da955334fdcfb8",
      email: "test@test.com",
      name: "Test User",
      password: hash,
    };

    await User.create(testUser);
  });

  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });
};

module.exports = initBeforeAndAfterEach;
