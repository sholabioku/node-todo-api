const _ = require('lodash');
const express = require('express');
const router = express.Router();

const { User } = require('../models/user');

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

module.exports = router;
