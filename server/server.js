const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const todos = require('./routes/todos');
const users = require('./routes/users');

const app = express();

app.use(bodyParser.json());

app.use('/todos', todos);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Started server up on port ${port}`));

module.exports = { app };
