const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const todos = require('./routes/todos');
const users = require('./routes/users');

const app = express();

app.use(bodyParser.json());

app.use('/todos', todos);

app.listen(3000, () => console.log('Started on port 3000'));

module.exports = { app };
