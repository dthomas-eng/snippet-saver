const mongoose = require("mongoose");
const createServer = require("../../server");
const request = require("supertest");
const User = require("../../models/User");
const initBeforeAndAfterEach = require("../testUtils/initBeforeAndAfterEach");

initBeforeAndAfterEach();

const app = createServer();

describe("POST tests:", () => {
  test("POST /forgotPassowrd - Make a request for reset password token using a valid email.", async () => {
    const user = {
      email: "test@test.com",
    };

    await request(app)
      .post("/forgotPassword")
      .send(user)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.email).toBe(user.email);
      });
  });

  test("POST /forgotPassowrd - Error - Make a request missing the email.", async () => {
    const email = {};

    await request(app)
      .post("/forgotPassword")
      .send(email)
      .expect(404)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/Email is required./);
      });
  });

  test("POST /forgotPassowrd - Error - Make a request with an email not in databse.", async () => {
    const email = {
      email: "tom@test.com",
    };

    await request(app)
      .post("/forgotPassword")
      .send(email)
      .expect(404)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/User not found./);
      });
  });
});
