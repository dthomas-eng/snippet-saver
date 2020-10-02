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
  test("GET /snippets/:id - Error - nothing in the database.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = response.body.authorization;
        await request(app)
          .get(`/snippets/${user_id}`)
          .set("authorization", authorization)
          .expect(404)
          .then((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toMatch(/Databse is empty/);
          });
      });
  });

  test("GET /snippets/:id - Get all private snippets.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = response.body.authorization;

        const privateSnippet1 = await Snippet.create({
          title: "Snippet 1",
          notes: "These are the notes for snippet 1.",
          code: {
            value: "This is the code for snippet 1.",
          },
          authorId: "5f5a799991da955334fdcfb8",
          authorName: "Test User",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: true,
          likes: 12,
        });

        const privateSnippet2 = await Snippet.create({
          title: "Snippet 2",
          notes: "These are the notes for snippet 2.",
          code: {
            value: "This is the code for snippet 2.",
          },
          authorId: "5f5a799991da955334gdcfb8",
          authorName: "Test User",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: true,
          likes: 0,
        });

        const publicSnippet = await Snippet.create({
          title: "Public Snippet",
          notes: "These are the notes for public snippet.",
          code: {
            value: "This is the code for public snippet.",
          },
          authorId: "fillerId2",
          authorName: "Public Snippet Author",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: false,
          likes: 0,
        });

        await request(app)
          .get(`/snippets/${user_id}`)
          .set("authorization", authorization)
          .expect(200)
          .then((response) => {
            expect(response.body.data.length == 1);
            expect(response.body.data[0].title).toBe(privateSnippet1.title);
            expect(response.body.data[0].isPrivate).toBe(
              privateSnippet1.isPrivate
            );
            expect(response.body.data[0].likes).toBe(privateSnippet1.likes);
          });
      });
  });

  test("GET /snippets/:id - Error - attempt to access other user's private snippets.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = response.body.authorization;

        const privateSnippet1 = await Snippet.create({
          title: "Snippet 1",
          notes: "These are the notes for snippet 1.",
          code: {
            value: "This is the code for snippet 1.",
          },
          authorId: "5f5a799991da955334fdcfb8",
          authorName: "Test User",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: true,
          likes: 12,
        });

        const privateSnippet2 = await Snippet.create({
          title: "Snippet 2",
          notes: "These are the notes for snippet 2.",
          code: {
            value: "This is the code for snippet 2.",
          },
          authorId: "5f5a799991da955334gdcfb8",
          authorName: "Test User",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: true,
          likes: 0,
        });

        const publicSnippet = await Snippet.create({
          title: "Public Snippet",
          notes: "These are the notes for public snippet.",
          code: {
            value: "This is the code for public snippet.",
          },
          authorId: "fillerId2",
          authorName: "Public Snippet Author",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: false,
          likes: 0,
        });

        await request(app)
          .get(`/snippets/5f5a799991da955334gdcfb8`)
          .set("authorization", authorization)
          .expect(404)
          .then((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toMatch(/access another users/);
          });
      });
  });

  test("GET /snippets/:id - Error - non logged in attempt.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = "";

        const privateSnippet1 = await Snippet.create({
          title: "Snippet 1",
          notes: "These are the notes for snippet 1.",
          code: {
            value: "This is the code for snippet 1.",
          },
          authorId: "5f5a799991da955334fdcfb8",
          authorName: "Test User",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: true,
          likes: 12,
        });

        const privateSnippet2 = await Snippet.create({
          title: "Snippet 2",
          notes: "These are the notes for snippet 2.",
          code: {
            value: "This is the code for snippet 2.",
          },
          authorId: "5f5a799991da955334gdcfb8",
          authorName: "Test User",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: true,
          likes: 0,
        });

        const publicSnippet = await Snippet.create({
          title: "Public Snippet",
          notes: "These are the notes for public snippet.",
          code: {
            value: "This is the code for public snippet.",
          },
          authorId: "fillerId2",
          authorName: "Public Snippet Author",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: false,
          likes: 0,
        });

        await request(app)
          .get(`/snippets/5f5a799991da955334gdcfb8`)
          .set("authorization", authorization)
          .expect(401)
          .then((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toMatch(/Unauthorized/);
          });
      });
  });
});
