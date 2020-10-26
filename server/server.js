require('./config/config');

const express = require('express');
const colors = require('colors');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');

const { mongoose } = require('./db/mongoose');
const todos = require('./routes/todos');
const users = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use(mongoSanitize());

app.use('/todos', todos);
app.use('/users', users);

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`Started server up on port ${port}`.cyan.bold.underline)
);

module.exports = { app };
