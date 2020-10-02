const mongoose = require("mongoose");
const createServer = require("../../server");
const request = require("supertest");
const User = require("../../models/User");
const initBeforeAndAfterEach = require("../testUtils/initBeforeAndAfterEach");

initBeforeAndAfterEach();

const app = createServer();

describe("POST tests:", () => {
  test("POST /auth - Create user, get JWT, and make an access request to a protected route.", async () => {
    let user_id = null;

    const user = {
      name: "Testing Ted",
      email: "ted@test.com",
      password: "AAasdf1234dD",
    };

    let authorization = "";

    await request(app)
      .post("/users")
      .send(user)
      .then(async (response) => {
        authorization = response.body.authorization;
      });

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
      .set("authorization", authorization)
      .send(newSnippet)
      .expect(201)
      .then((response) => {
        expect(response.body.success).toBe(true);
      });
  });

  test("POST /auth - Create user, get JWT, and make an access request to a protected route without a token.", async () => {
    let user_id = null;

    const user = {
      name: "Testing Ted",
      email: "ted@test.com",
      password: "AAasdf1234dD",
    };

    let authorization = "";

    await request(app)
      .post("/users")
      .send(user)
      .then(async (response) => {
        authorization = response.body.authorization;
      });

    await request(app)
      .post("/auth")
      .send(user)
      .expect(200)
      .then(async (response) => {
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
          .expect(401)
          .then((response) => {
            expect(response.body.error).toMatch(/Unauthorized/);
          });
      });
  });

  test("POST /auth - Create user, get JWT, and make an access request to a protected route with a bad token.", async () => {
    let user_id = null;

    const user = {
      name: "Testing Ted",
      email: "ted@test.com",
      password: "AAasdf1234dD",
    };

    let authorization = "";

    await request(app)
      .post("/users")
      .send(user)
      .then(async (response) => {
        authorization = response.body.authorization;
      });

    await request(app)
      .post("/auth")
      .send(user)
      .expect(200)
      .then(async (response) => {
        authorization = authorization + "junk";

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
          .expect(401)
          .then((response) => {
            expect(response.body.error).toMatch(/invalid signature/);
          });
      });
  });
});
