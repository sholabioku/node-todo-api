const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const message = 'I am message 3';

const hash = crypto.createHash('sha256').update(message).digest('hex');
// console.log('Message: ', message);
// console.log('Hash: ', hash);

const data = { id: 10 };

const token = jwt.sign(data, '123abc');
// console.log(token);

const decoded = jwt.verify(token, '123abc');
// console.log('decoded: ', decoded);

const password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, res) => {
    // console.log(res);
  });
});

const hashedPassword =
  '$2a$10$PflJzK5eXXJbQuYsmZ0peOvNuZ13siazEuPDZqc7xHApAPOpbMYLy';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
