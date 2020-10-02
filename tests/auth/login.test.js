const mongoose = require("mongoose");
const createServer = require("../../server");
const request = require("supertest");
const User = require("../../models/User");
const initBeforeAndAfterEach = require("../testUtils/initBeforeAndAfterEach");

initBeforeAndAfterEach();

const app = createServer();

describe("POST tests:", () => {
  test("POST /auth - Login user and get JWT token.", async () => {
    const user = {
      name: "Testing Ted",
      email: "ted@test.com",
      password: "AAasdf1234dD",
    };

    await request(app).post("/users").send(user);

    await request(app)
      .post("/auth")
      .send(user)
      .expect(200)
      .then(async (response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.authorization).toMatch(
          /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/
        );
      });
  });

  test("POST /auth - Error - Invalid password.", async () => {
    const user = {
      name: "Testing Ted",
      email: "ted@test.com",
      password: "AAasdf1234dD",
    };

    await request(app).post("/users").send(user);

    user.password = "n0tTherightPa55word";

    await request(app)
      .post("/auth")
      .send(user)
      .expect(401)
      .then(async (response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/Invalid Credentials/);
      });
  });

  test("POST /auth - Error - Invalid email.", async () => {
    const user = {
      name: "Testing Ted",
      email: "ted@test.com",
      password: "AAasdf1234dD",
    };

    await request(app).post("/users").send(user);

    user.email = "notted@test.com";

    await request(app)
      .post("/auth")
      .send(user)
      .expect(401)
      .then(async (response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/Invalid Credentials/);
      });
  });

  test("POST /auth - Error - Missing required fields.", async () => {
    const user = {
      name: "Testing Ted",
      email: "ted@test.com",
      password: "AAasdf1234dD",
    };

    await request(app).post("/users").send(user);

    await request(app)
      .post("/auth")
      .send({})
      .expect(401)
      .then(async (response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/Email and Password are required/);
      });
  });
});
