const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

let id = '5f87025beeaef164db62b2d9abc';

// if (!ObjectID.isValid(id)) {
//   console.log('Invalid ID');
// }

if (!mongoose.Types.ObjectId.isValid(id)) {
  console.log('Invalid ID');
}

// Todo.find({ _id: id }).then((todos) => console.log('Todos: ', todos));

// Todo.findOne({ _id: id }).then((todo) => console.log('Todo: ', todo));

// Todo.findById(id)
//   .then((todo) => {
//     if (!todo) return console.log('Invalid todo');
//     console.log('Todo by ID: ', todo);
//   })
//   .catch((err) => console.log(err));

User.findById('5f86b40e54d7e72f5db80bf3')
  .then((user) => {
    if (!user) {
      return console.log('User not found');
    }

    console.log('User by ID: ', user);
  })
  .catch((err) => console.log(err));
