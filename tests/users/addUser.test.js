const mongoose = require("mongoose");
const createServer = require("../../server");
const request = require("supertest");
const User = require("../../models/User");
const initBeforeAndAfterEach = require("../testUtils/initBeforeAndAfterEach");

initBeforeAndAfterEach();

const app = createServer();

describe("POST tests:", () => {
  test("POST /users - Register a new User.", async () => {
    const newUser = {
      name: "Testing Teddy",
      email: "ted@test.com",
      password: "AAasdf1234dD",
    };

    await request(app)
      .post("/users")
      .send(newUser)
      .expect(201)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.authorization).toMatch(
          /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/
        );
      });
  });

  test("POST /users - Error - missing all required fields.", async () => {
    const newUser = {};

    await request(app)
      .post("/users")
      .send(newUser)
      .expect(404)
      .then(async (response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/are required/);
      });
  });

  test("POST /users - Error - Name and email too long.", async () => {
    const newUser = {
      name: "Testing Teddy Testing Teddy Testing Teddy Testing Teddy",
      email: "tedtedtedtedtedtedtedtedtedtedtedtedtedtedted@test.com",
      password: "asdf12345",
    };

    await request(app)
      .post("/users")
      .send(newUser)
      .expect(404)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/must be less than/);
      });
  });

  test("POST /users - Error - Duplicate email and name.", async () => {
    const newUser1 = {
      name: "Testing Teddy",
      email: "notted@test.com",
      password: "AAasdf1234d",
    };
    await User.create(newUser1);

    const newUser2 = {
      name: "NotTesting Teddy",
      email: "ted@test.com",
      password: "AAasdf1234d",
    };
    await User.create(newUser2);

    const newUser = {
      name: "Testing Teddy",
      email: "ted@test.com",
      password: "AAasdf1234d",
    };

    await request(app)
      .post("/users")
      .send(newUser)
      .expect(404)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/already exists/);
      });
  });

  test("POST /users - Error - invalid email.", async () => {
    const newUser = {
      name: "Testing Teddy",
      email: "nottedtestcom",
      password: "AAasdf1234d",
    };
    await request(app)
      .post("/users")
      .send(newUser)
      .expect(404)
      .then(async (response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/not a valid email/);
      });
  });

  test("POST /users - Error - invalid password.", async () => {
    const newUser = {
      name: "Testing Teddy",
      email: "ted@test.com",
      password: "aaa",
    };
    await request(app)
      .post("/users")
      .send(newUser)
      .expect(404)
      .then(async (response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/must be at least 8 characters/);
      });
  });
});
