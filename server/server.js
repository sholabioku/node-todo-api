require('./config/config');

const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');

const { mongoose } = require('./db/mongoose');
const todos = require('./routes/todos');
const users = require('./routes/users');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(helmet());

app.use('/todos', todos);
app.use('/users', users);

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`Started server up on port ${port}`.cyan.bold.underline)
);

module.exports = { app };
