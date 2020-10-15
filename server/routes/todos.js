const express = require('express');
const router = express.Router();

const { ObjectID } = require('mongodb');
const { Todo } = require('../models/todo');

router.post('/', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
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

router.get('/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch((err) => res.status(400).send(err));
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndDelete(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
