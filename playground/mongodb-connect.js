// const MongoClient = require('mongodb').MongoClient;

// // Connection URL
// const url = 'mongodb://localhost:27017';

// // Database Name
// const dbName = 'TodoApp';
// const client = new MongoClient(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Use connect method to connect to the server
// client.connect((err) => {
//   console.log('Connected successfully to server');

//   const db = client.db(dbName);

//   insertDocuments(db, function () {
//     client.close();
//   });
// });

// const insertDocuments = (db, callback) => {
//   // Get the documents collection
//   const collection = db.collection('Users');
//   // Insert some documents
//   collection.insertOne(
//     { name: 'Lukman Bioku', age: 30, location: 'Kishi' },
//     function (err, result) {
//       console.log('Inserted 1 documents into the collection');
//       console.log(result.ops);
//       callback(result);
//     }
//   );
// };

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');
  // db.collection('Todos').insertOne(
  //   {
  //     text: 'Something to do',
  //     completed: false,
  //   },
  //   (err, result) => {
  //     if (err) {
  //       return console.log('Unable to insert todo', err);
  //     }

  //     console.log(JSON.stringify(result.ops, undefined, 2));
  //   }
  // );

  // Insert new doc into Users (name, age, location)
  // db.collection('Users').insertOne(
  //   {
  //     name: 'Bilush',
  //     age: 30,
  //     location: 'Kishi',
  //   },
  //   (err, result) => {
  //     if (err) {
  //       return console.log('Unable to insert user', err);
  //     }

  //     console.log(result.ops[0]._id.getTimestamp());
  //   }
  // );

  client.close();
});
