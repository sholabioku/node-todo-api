const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');
const { app } = require('./../server');
const { Todo } = require('../models/todo');

describe('Todos Integration testing', () => {
  const todos = [
    {
      _id: new ObjectID(),
      text: 'First test todo',
    },
    {
      _id: new ObjectID(),
      text: 'Second text todo',
      completed: true,
      completedAt: 333,
    },
  ];
  beforeEach((done) => {
    Todo.deleteMany({})
      .then(() => {
        return Todo.insertMany(todos);
      })
      .then(() => done());
  });

  describe('POST /todos', () => {
    it('should create a new todo', (done) => {
      const text = 'Test todo text';
      request(app)
        .post('/todos')
        .send({ text })
        .expect(200)
        .expect((res) => {
          expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Todo.find({ text })
            .then((todos) => {
              expect(todos.length).toBe(1);
              expect(todos[0].text).toBe(text);
              done();
            })
            .catch((err) => done(err));
        });
    });

    it('should not create todo with invalid body data', (done) => {
      request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Todo.find()
            .then((todos) => {
              expect(todos.length).toBe(2);
              done();
            })
            .catch((err) => done(err));
        });
    });
  });

  describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if not todo', (done) => {
      const hexId = new ObjectID().toHexString();
      request(app).get(`/todos/${hexId}`).expect(404).end(done);
    });
    it('should return 404 for non-object ids', (done) => {
      request(app).get('/todos/123abc').expect(404).end(done);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
      const hexId = todos[1]._id.toHexString();
      request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Todo.findById(hexId)
            .then((todo) => {
              expect(todo).toBeNull();
              done();
            })
            .catch((err) => done(err));
        });
    });

    it('should return 404 if not todo', (done) => {
      const hexId = new ObjectID();
      request(app).delete(`/todos/${hexId}`).expect(404).end(done);
    });

    it('should return 404 if non-object ids', (done) => {
      request(app).delete('/todos/123abc').expect(404).end(done);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
      const text = 'update text';
      const hexId = todos[0]._id.toHexString();
      request(app)
        .patch(`/todos/${hexId}`)
        .send({ text, completed: true })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true);
          expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(done);
    });

    it('should clear the completedAt if todo is not completed', (done) => {
      const hexId = todos[1]._id.toHexString();
      const text = 'update text';
      request(app)
        .patch(`/todos/${hexId}`)
        .send({ text, completed: false })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toBeNull();
        })
        .end(done);
    });
  });
});
