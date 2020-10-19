const _ = require('lodash');
const express = require('express');
const router = express.Router();

const { User } = require('../models/user');
const { authenticate } = require('../middlewares/authenticate');

router.post('/register', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  const user = new User(body);
  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).send(user);
    })
    .catch((err) => res.status(400).send(err));
});

router.post('/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

module.exports = router;
