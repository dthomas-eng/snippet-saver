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

describe("DELETE tests:", () => {
  test("DELETE /user - Delete user and associated snippets.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = response.body.authorization;

        const snippet1 = await Snippet.create({
          title: "Snippet 1",
          notes: "These are the notes for snippet 1.",
          code: {
            value: "This is the code for snippet 1.",
          },
          authorId: "5f5a799991da955334fbbfb8",
          authorName: "Not Test User",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: false,
          likes: 0,
        });

        const snippet2 = await Snippet.create({
          title: "Snippet 2",
          notes: "These are the notes for snippet 2.",
          code: {
            value: "This is the code for snippet 2.",
          },
          authorId: "5f5a799991da955334fdcfb8",
          authorName: "Test User",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: false,
          likes: 0,
        });

        await request(app)
          .delete(`/users`)
          .set("authorization", authorization)
          .expect(200)
          .then((response) => {
            expect(response.body.success).toBe(true);
          });

        await request(app)
          .get(`/snippets`)
          .expect(200)
          .then((response) => {
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].title).toBe("Snippet 1");
          });
      });
  });

  test("DELETE /user - Error - attempt to delete while not logged in.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = "";

        await request(app)
          .delete(`/users`)
          .set("authorization", authorization)
          .expect(401)
          .then((response) => {
            expect(response.body.error).toMatch(/Unauthorized/);
          });
      });
  });
});
