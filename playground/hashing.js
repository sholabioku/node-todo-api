const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const message = 'I am message 3';

const hash = crypto.createHash('sha256').update(message).digest('hex');
// console.log('Message: ', message);
// console.log('Hash: ', hash);

const data = { id: 10 };

const token = jwt.sign(data, '123abc');
console.log(token);

const decoded = jwt.verify(token, '123abc');
console.log('decoded: ', decoded);
