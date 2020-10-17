const _ = require('lodash');
const express = require('express');
const router = express.Router();

const { ObjectID } = require('mongodb');
const { Todo } = require('../models/todo');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', (req, res) => {
  const body = _.pick(req.body, ['text']);
  const todo = new Todo(body);
  todo
    .save()
    .then((doc) => res.send(doc))
    .catch((err) => res.status(400).send(err));
});

router.get('/', (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({ todos });
    })
    .catch((err) => res.status(400).send(err));
});

router.get('/:id', validateObjectId, (req, res) => {
  const id = req.params.id;

  Todo.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch((err) => res.status(400).send(err));
});

router.delete('/:id', validateObjectId, (req, res) => {
  const id = req.params.id;

  Todo.findByIdAndDelete(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch((err) => res.status(400).send(err));
});

router.patch('/:id', validateObjectId, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
