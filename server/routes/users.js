const _ = require('lodash');
const express = require('express');
const router = express.Router();

const { User } = require('../models/user');
const { authenticate } = require('../middlewares/authenticate');

router.post('/register', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);

    let user = new User(body);
    await user.save();

    const token = await user.generateAuthToken();
    res.header('x-auth', token).send({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: 'User with that email already exist',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send({
      success: true,
      message: 'User logged in successfully',
      data: user,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: `Invalid credentials`,
    });
  }
});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.delete('/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send({
      success: true,
      message: 'User loggout successfully',
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: 'User could not logged out',
    });
  }
});

module.exports = router;
