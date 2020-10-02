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

describe("POST tests:", () => {
  test("POST /snippets - Create a new Snippet.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = response.body.authorization;

        const newSnippet = {
          title: "Snippet 1",
          notes: "These are the notes for snippet 1.",
          code: {
            value: "This is the code for snippet 1.",
          },
          authorId: "fillerId1",
          authorName: "Snippet1 Author",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: true,
          likes: 0,
        };

        await request(app)
          .post("/snippets")
          .send(newSnippet)
          .set("authorization", authorization)
          .expect(201)
          .then((response) => {
            expect(response.body.currentUser._id).toBe(user_id);
            expect(response.body.data.length == 1);
            expect(response.body.data.title).toBe(newSnippet.title);
            expect(response.body.data.isPrivate).toBe(newSnippet.isPrivate);
            expect(response.body.data.likes).toBe(newSnippet.likes);
          });
      });
  });

  test("POST /snippets - Error - missing all required fields.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = response.body.authorization;
        const newSnippet = {
          notes: "These are the notes for snippet 1.",
        };
        await request(app)
          .post("/snippets")
          .send(newSnippet)
          .set("authorization", authorization)
          .expect(404)
          .then(async (response) => {
            expect(response.body.success).toBe(false);
          });
      });
  });

  test("POST /snippets - Error - Title, notes, and code too many characters", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = response.body.authorization;

        const newSnippet = {
          title: "Snippet" * 50,
          notes: "These are the notes for snippet 1." * 50,
          code: {
            value: "This is the code for snippet 1." * 50,
          },
          authorId: "fillerId1",
          authorName: "Snippet1 Author",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: true,
          likes: 0,
        };

        await request(app)
          .post("/snippets")
          .send(newSnippet)
          .set("authorization", authorization)
          .expect(404)
          .then((response) => {
            expect(response.body.success).toBe(false);
          });
      });
  });
});
