const { ObjectID } = require('mongodb');

module.exports = function (req, res, next) {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  next();
};
