const mongoose = require("mongoose");
const createServer = require("../../server");
const request = require("supertest");
const Snippet = require("../../models/Snippet");
const initBeforeAndAfterEach = require("../testUtils/initBeforeAndAfterEach");

initBeforeAndAfterEach();

const app = createServer();

describe("POST tests:", () => {
  test("GET /snippets - Error - nothing in the database.", async () => {
    await request(app)
      .get("/snippets")
      .expect(404)
      .then((response) => {
        expect(response.body.success).toBe(false);
      });
  });

  test("GET /snippets - Get all public snippets.", async () => {
    const privateSnippet = await Snippet.create({
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
    });

    const publicSnippet = await Snippet.create({
      title: "Snippet 2",
      notes: "These are the notes for snippet 2.",
      code: {
        value: "This is the code for snippet 2.",
      },
      authorId: "fillerId2",
      authorName: "Snippet2 Author",
      dateUpdated: 10 - 10 - 2020,
      isPrivate: false,
      likes: 0,
    });

    await request(app)
      .get("/snippets")
      .expect(200)
      .then((response) => {
        expect(response.body.data.length == 1);
        expect(response.body.data[0].title).toBe(publicSnippet.title);
        expect(response.body.data[0].isPrivate).toBe(publicSnippet.isPrivate);
        expect(response.body.data[0].likes).toBe(publicSnippet.likes);
      });
  });
});
