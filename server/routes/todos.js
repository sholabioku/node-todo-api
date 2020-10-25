const _ = require('lodash');
const express = require('express');
const router = express.Router();

const { Todo } = require('../models/todo');
const validateObjectId = require('../middlewares/validateObjectId');
const { authenticate } = require('../middlewares/authenticate');

router.post('/', authenticate, async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      _creator: req.user._id,
    });

    const doc = await todo.save();
    res.send(doc);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({ _creator: req.user._id });
    res.send({ todos });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/:id', [authenticate, validateObjectId], async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, _creator: req.user._id });
    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', [authenticate, validateObjectId], async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({
      _id: id,
      _creator: req.user._id,
    });

    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch('/:id', [authenticate, validateObjectId], async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: id, _creator: req.user._id },
      { $set: body },
      { new: true }
    );

    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
