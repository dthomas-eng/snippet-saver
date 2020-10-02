const mongoose = require("mongoose");
const createServer = require("../../server");
const request = require("supertest");
const User = require("../../models/User");
const initBeforeAndAfterEach = require("../testUtils/initBeforeAndAfterEach");

initBeforeAndAfterEach();

const app = createServer();

describe("PUT tests:", () => {
  test("PUT /resetPassword/:token - Make a request to reset password token using a valid email.", async () => {
    const user = {
      email: "test@test.com",
      password: "test1234",
    };

    let email = null;

    await request(app)
      .post("/forgotPassword")
      .send(user)
      .expect(200)
      .then((response) => {
        email = response.body.email;
        expect(response.body.success).toBe(true);
      });

    const foundUser = await User.findOne({ email }).select(
      "+passwordResetToken"
    );

    const updatedUser = {
      email: "test@test.com",
      password: "asdjfl8392794jk",
    };

    await request(app)
      .put(`/resetPassword/${foundUser.passwordResetToken}`)
      .send(updatedUser)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
      });

    await request(app)
      .post(`/auth`)
      .send(user)
      .expect(401)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Invalid Credentials");
      });

    await request(app)
      .post(`/auth`)
      .send(updatedUser)
      .expect(200)
      .then(async (response) => {
        const token = response.header.token;
        expect(response.body.success).toBe(true);
        expect(response.body.authorization).toMatch(
          /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/
        );
      });

    const tokenCheck = await User.findOne({ email }).select(
      "+passwordResetToken"
    );
    expect(tokenCheck.passwordResetToken).toBe(null);
  });

  test("PUT /resetPassword/:token - Error - bad new password supplied.", async () => {
    const user = {
      email: "test@test.com",
      password: "test1234",
    };

    let email = null;

    await request(app)
      .post("/forgotPassword")
      .send(user)
      .expect(200)
      .then((response) => {
        email = response.body.email;
        expect(response.body.success).toBe(true);
      });

    const foundUser = await User.findOne({ email }).select(
      "+passwordResetToken"
    );

    const updatedUser = {
      email: "test@test.com",
      password: "ab12",
    };

    await request(app)
      .put(`/resetPassword/${foundUser.passwordResetToken}`)
      .send(updatedUser)
      .expect(401)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/Password must be at least/);
      });
  });
  test("PUT /resetPassword/:token - Error - no password supplied.", async () => {
    const user = {
      email: "test@test.com",
      password: "test1234",
    };

    let email = null;

    await request(app)
      .post("/forgotPassword")
      .send(user)
      .expect(200)
      .then((response) => {
        email = response.body.email;
        expect(response.body.success).toBe(true);
      });

    const foundUser = await User.findOne({ email }).select(
      "+passwordResetToken"
    );

    const updatedUser = {
      email: "test@test.com",
    };

    await request(app)
      .put(`/resetPassword/${foundUser.passwordResetToken}`)
      .send(updatedUser)
      .expect(401)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/Password is required./);
      });
  });
  test("PUT /resetPassword/:token - Error - non existant user.", async () => {
    const user = {
      email: "test@test.com",
      password: "test1234",
    };

    let email = null;

    await request(app)
      .post("/forgotPassword")
      .send(user)
      .expect(200)
      .then((response) => {
        email = response.body.email;
        expect(response.body.success).toBe(true);
      });

    const foundUser = await User.findOne({ email }).select(
      "+passwordResetToken"
    );

    await User.findOneAndRemove({ email });

    const updatedUser = {
      email: "test1@test.com",
      password: "ab12hjkgkj8",
    };

    await request(app)
      .put(`/resetPassword/${foundUser.passwordResetToken}`)
      .send(updatedUser)
      .expect(401)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/User not found./);
      });
  });

  test("PUT /resetPassword/:token - Error - bad token.", async () => {
    const user = {
      email: "test@test.com",
      password: "test1234",
    };

    let email = null;

    await request(app)
      .post("/forgotPassword")
      .send(user)
      .expect(200)
      .then((response) => {
        email = response.body.email;
        expect(response.body.success).toBe(true);
      });

    const foundUser = await User.findOne({ email }).select(
      "+passwordResetToken"
    );

    const updatedUser = {
      email: "test1@test.com",
      password: "ab12hjkgkj8",
    };

    await request(app)
      .put(`/resetPassword/notarealpasswordresett0ken`)
      .send(updatedUser)
      .expect(401)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/JsonWebTokenError/);
      });
  });
});
