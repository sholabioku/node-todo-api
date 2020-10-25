const _ = require('lodash');
const express = require('express');
const router = express.Router();

const { User } = require('../models/user');
const { authenticate } = require('../middlewares/authenticate');

router.post('/register', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);

    const user = new User(body);
    await user.save();

    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.delete('/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
