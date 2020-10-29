const expect = require("expect");
const request = require("supertest");

const { ObjectID } = require("mongodb");
const { app } = require("./../server");
const { Todo } = require("../models/todo");
const { todos, users, populateTodos, populateUsers } = require("./seed/seed");

describe("Todos Integration testing", () => {
  beforeEach(populateTodos);
  beforeEach(populateUsers);

  describe("POST /todos", () => {
    it("should create a new todo", async () => {
      const text = "Test todo text";
      const res = await request(app)
        .post("/todos")
        .set("x-auth", users[0].tokens[0].token)
        .send({ text });
      expect(res.status).toBe(200);

      expect(res.body.data.text).toBe(text);

      const todos = await Todo.find({ text });
      expect(todos.length).toBe(1);
      expect(todos[0].text).toBe(text);
    });

    it("should not create todo with invalid body data", async () => {
      const res = await request(app)
        .post("/todos")
        .set("x-auth", users[0].tokens[0].token)
        .send({});
      expect(res.status).toBe(400);
      const todos = await Todo.find();
      expect(todos.length).toBe(2);
    });
  });

  describe("GET /todos", () => {
    it("should get all todos", async () => {
      const res = await request(app)
        .get("/todos")
        .set("x-auth", users[0].tokens[0].token);
      expect(res.status).toBe(200);
      expect(res.body.todos.length).toBe(1);
    });
  });

  describe("GET /todos/:id", () => {
    it("should return todo doc", async () => {
      const res = await request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set("x-auth", users[0].tokens[0].token);
      expect(res.status).toBe(200);
      expect(res.body.data.text).toBe(todos[0].text);
    });
    it("should not return todo doc created by other user", async () => {
      const res = await request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set("x-auth", users[0].tokens[0].token);
      expect(res.status).toBe(404);
    });
    it("should return 404 if not todo", async () => {
      const hexId = new ObjectID().toHexString();
      const res = await request(app)
        .get(`/todos/${hexId}`)
        .set("x-auth", users[0].tokens[0].token);
      expect(res.status).toBe(404);
    });
    it("should return 404 for non-object ids", async () => {
      const res = await request(app)
        .get("/todos/123abc")
        .set("x-auth", users[0].tokens[0].token);
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /todos/:id", () => {
    it("should remove a todo", async () => {
      const hexId = todos[1]._id.toHexString();

      const res = await request(app)
        .delete(`/todos/${hexId}`)
        .set("x-auth", users[1].tokens[0].token);
      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(hexId);

      const todo = await Todo.findById(hexId);
      expect(todo).toBeFalsy();
    });

    it("should not remove a todo created by other user", async () => {
      const hexId = todos[0]._id.toHexString();

      const res = await request(app)
        .delete(`/todos/${hexId}`)
        .set("x-auth", users[1].tokens[0].token);
      expect(res.status).toBe(404);

      const todo = await Todo.findById(hexId);
      expect(todo).toBeTruthy();
    });

    it("should return 404 if not todo", async () => {
      const hexId = new ObjectID();
      const res = await request(app)
        .delete(`/todos/${hexId}`)
        .set("x-auth", users[1].tokens[0].token);
      expect(res.status).toBe(404);
    });

    it("should return 404 if non-object ids", async () => {
      const res = await request(app)
        .delete("/todos/123abc")
        .set("x-auth", users[1].tokens[0].token);
      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /todos/:id", () => {
    it("should update the todo", async () => {
      const text = "update text";
      const hexId = todos[0]._id.toHexString();
      const res = await request(app)
        .patch(`/todos/${hexId}`)
        .set("x-auth", users[0].tokens[0].token)
        .send({ text, completed: true });
      expect(res.status).toBe(200);
      expect(res.body.data.text).toBe(text);
      expect(res.body.data.completed).toBe(true);
      expect(typeof res.body.data.completedAt).toBe("number");
    });

    it("should not update the todo created by other user", async () => {
      const text = "update text";
      const hexId = todos[0]._id.toHexString();
      const res = await request(app)
        .patch(`/todos/${hexId}`)
        .set("x-auth", users[1].tokens[0].token)
        .send({ text, completed: true });
      expect(res.status).toBe(404);
    });

    it("should clear the completedAt if todo is not completed", async () => {
      const hexId = todos[1]._id.toHexString();
      const text = "update text";
      const res = await request(app)
        .patch(`/todos/${hexId}`)
        .set("x-auth", users[1].tokens[0].token)
        .send({ text, completed: false });
      expect(res.status).toBe(200);
      expect(res.body.data.text).toBe(text);
      expect(res.body.data.completed).toBe(false);
      expect(res.body.data.completedAt).toBeFalsy();
    });
  });
});
