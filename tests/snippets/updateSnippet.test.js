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
  test("PUT /snippets/:id - Update all fields.", async () => {
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
          authorId: "5f5a799991da955334fdcfb8",
          authorName: "Test User",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: true,
          likes: 0,
        });

        const snippet2 = {
          title: "Snippet 2",
          notes: "These are the notes for snippet 2.",
          code: {
            value: "This is the code for snippet 2.",
          },
          authorName: "Snippet2 Author",
          isPrivate: false,
          likes: 1,
        };

        const snippet = await Snippet.findOne({
          title: "Snippet 1",
        }).exec();

        const snippet1_id = snippet._id.toString();

        await request(app)
          .put(`/snippets/${snippet1_id}`)
          .send(snippet2)
          .set("authorization", authorization)
          .expect(200)
          .then((response) => {
            expect(response.body.data.length == 1);
            expect(response.body.data.title).toBe(snippet2.title);
            expect(response.body.data.isPrivate).toBe(snippet2.isPrivate);
          });
      });
  });

  test("PUT /snippets/:id - Error - incorrect author id.", async () => {
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
          authorId: "5f5a799991da955344fdcfb8",
          authorName: "Test User",
          dateUpdated: 10 - 10 - 2020,
          isPrivate: true,
          likes: 0,
        });

        const snippet2 = {
          title: "Snippet 2",
          notes: "These are the notes for snippet 2.",
          code: {
            value: "This is the code for snippet 2.",
          },
          authorName: "Snippet2 Author",
          isPrivate: false,
          likes: 1,
        };

        const snippet = await Snippet.findOne({
          title: "Snippet 1",
        }).exec();

        const snippet1_id = snippet._id.toString();

        await request(app)
          .put(`/snippets/${snippet1_id}`)
          .send(snippet2)
          .set("authorization", authorization)
          .expect(400)
          .then((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toMatch(
              /original author of the snippet/
            );
          });
      });
  });

  test("PUT /snippets/:id - Error - non-existant Id.", async () => {
    await request(app)
      .post("/auth")
      .send(user)
      .then(async (response) => {
        const authorization = response.body.authorization;

        const snippet2 = {
          title: "Snippet 2",
          notes: "These are the notes for snippet 2.",
          code: {
            value: "This is the code for snippet 2.",
          },
          authorName: "Snippet2 Author",
          isPrivate: false,
          likes: 1,
        };

        await request(app)
          .put(`/snippets/5f5841a4dba55e214839fdc5`)
          .send(snippet2)
          .set("authorization", authorization)
          .expect(400)
          .then((response) => {
            expect(response.body.success).toBe(false);
            expect(response.body.error).toMatch(/does not exist/);
          });
      });
  });
});
