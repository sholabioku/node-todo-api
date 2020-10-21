const _ = require('lodash');
const express = require('express');
const router = express.Router();

const { ObjectID } = require('mongodb');
const { Todo } = require('../models/todo');
const validateObjectId = require('../middlewares/validateObjectId');
const { authenticate } = require('../middlewares/authenticate');

router.post('/', authenticate, (req, res) => {
  // const body = _.pick(req.body, ['text']);
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
  });
  todo
    .save()
    .then((doc) => res.send(doc))
    .catch((err) => res.status(400).send(err));
});

router.get('/', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id })
    .then((todos) => {
      res.send({ todos });
    })
    .catch((err) => res.status(400).send(err));
});

router.get('/:id', [authenticate, validateObjectId], (req, res) => {
  const id = req.params.id;

  Todo.findOne({ _id: id, _creator: req.user._id })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch((err) => res.status(400).send(err));
});

router.delete('/:id', [authenticate, validateObjectId], (req, res) => {
  const id = req.params.id;

  Todo.findOneAndDelete({ _id: id, _creator: req.user._id })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch((err) => res.status(400).send(err));
});

router.patch('/:id', [authenticate, validateObjectId], (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
    { _id: id, _creator: req.user._id },
    { $set: body },
    { new: true }
  )
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
