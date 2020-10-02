const mongoose = require("mongoose");
const createServer = require("../../server");
const request = require("supertest");
const Snippet = require("../../models/Snippet");
const initBeforeAndAfterEach = require("../testUtils/initBeforeAndAfterEach");

const user_id = "5f5a799991da955334fdcfb8";
const user = {
  name: "Test User",
  email: "test@test.com",
  password: "test1234",
};

initBeforeAndAfterEach();
const app = createServer();

describe("PUT tests:", () => {
  test("PUT /users - Update all fields.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = response.body.authorization;

        const userUpdate = {
          name: "Updated Test User",
          email: "updatedtest@test.com",
        };

        await request(app)
          .put(`/users`)
          .send(userUpdate)
          .set("authorization", authorization)
          .expect(200)
          .then((response) => {
            expect(response.body.data.name).toBe(user.name);
            expect(response.body.data.email).toBe(userUpdate.email);
          });
      });
  });

  test("PUT /users - Attempted update without login.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (res) => {
        const authorization = "";

        const userUpdate = {
          name: "Updated Test User",
          email: "updatedtest@test.com",
        };

        await request(app)
          .put(`/users`)
          .send(userUpdate)
          .set("authorization", authorization)
          .expect(401)
          .then((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toMatch(/Unauthorized/);
          });
      });
  });
});
