const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { User } = require('../models/user');
const { users, populateUsers } = require('./seed/seed');

describe('Users Integrating Testing', () => {
  beforeEach(populateUsers);

  describe('GET /users/me', () => {
    it('should return  user if authenticated', async () => {
      const res = await request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/users/me');
      expect(res.status).toBe(401);
      expect(res.body).toEqual({});
    });
  });

  describe('POST /users/register', () => {
    it('should create a user', async () => {
      const email = 'example@example.com';
      const password = '123mnb!';
      const res = await request(app)
        .post('/users/register')
        .send({ email, password });
      expect(res.status).toBe(200);

      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);

      const user = await User.findOne({ email });
      expect(user).toBeTruthy();
      expect(user.password).not.toBe(password);
    });

    it('should return validation error if request is invalid', async () => {
      const email = 'abc';
      const password = '12345';

      const res = await request(app)
        .post('/users/register')
        .send({ email, password });
      expect(res.status).toBe(400);
    });

    it('should not create user if email is already in use', async () => {
      const email = users[0].email;
      const password = '123456';
      const res = await request(app)
        .post('/users/register')
        .send({ email, password });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /users/login', () => {
    it('should login user and return auth token', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({ email: users[1].email, password: users[1].password });
      expect(res.status).toBe(200);
      expect(res.headers['x-auth']).toBeTruthy();

      const user = await User.findById(users[1]._id);
      expect(user.tokens[1]).toMatchObject({
        access: 'auth',
        token: res.headers['x-auth'],
      });
    });

    it('should reject invalid login', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({ email: users[1].email, password: users[1].password + '1' });
      expect(res.status).toBe(400);
      expect(res.headers['x-auth']).toBeFalsy();

      const user = await User.findById(users[1]._id);
      expect(user.tokens.length).toBe(1);
    });
  });

  describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', async () => {
      const res = await request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token);
      expect(res.status).toBe(200);

      const user = await User.findById(users[0]._id);

      expect(user.tokens.length).toBe(0);
    });
  });
});
