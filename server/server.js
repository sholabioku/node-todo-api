require("./config/config");

const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./db/mongoose");
const todos = require("./routes/todos");
const users = require("./routes/users");

const app = express();

connectDB();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

app.use("/todos", todos);
app.use("/users", users);

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`Started server up on port ${port}`.yellow.bold)
);

// Handle unhandle promise rejection;
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  app.close(() => process.exit(1));
});

module.exports = { app };
