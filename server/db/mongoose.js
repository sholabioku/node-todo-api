const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((conn) => {
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  })
  .catch((err) => console.log(err));

module.exports = { mongoose };
