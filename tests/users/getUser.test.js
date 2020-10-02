const mongoose = require("mongoose");
const createServer = require("../../server");
const request = require("supertest");
const initBeforeAndAfterEach = require("../testUtils/initBeforeAndAfterEach");

const user_id = "5f5a799991da955334fdcfb8";
const user = {
  name: "Test User",
  email: "test@test.com",
  password: "test1234",
};

initBeforeAndAfterEach();
const app = createServer();

describe("GET tests:", () => {
  test("GET /users - Get the logged in users info.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = response.body.authorization;

        await request(app)
          .get(`/users`)
          .set("authorization", authorization)
          .expect(200)
          .then((response) => {
            expect(response.body.data.name).toBe(user.name);
            expect(response.body.data.email).toBe(user.email);
            expect(response.body.data._id).toBe(user_id);
          });
      });
  });

  test("GET /users - Error - not logged in attempt.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = "";

        await request(app)
          .get(`/users`)
          .set("authorization", authorization)
          .expect(401)
          .then((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toMatch(/Unauthorized/);
          });
      });
  });
});
