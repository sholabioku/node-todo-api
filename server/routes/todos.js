const express = require('express');
const router = express.Router();

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

module.exports = router;
