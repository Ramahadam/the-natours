const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

// Handle uncaught exceptions

process.on('uncaughtException', (err) => {
  console.log('Unhanle uncaught exceptions');
  console.log(err.name, err.message);

  process.exit(1);
});

const app = require('./app');

// Below section to connect to DB
// First create the database string

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Disable buffering to catch mongoose DB connection

mongoose.set('bufferCommands', false);

// connect to MonogoDB using Mongoose

mongoose
  .connect(DB)
  .then((con) => {
    console.log('Connection established ✅');
  })
  .catch((error) => console.log(error));

// Handle errors after initial connection was established
mongoose.connection.on('error', (err) => console.log(err));

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((con) => {
//     console.log('Connection established ✅');
//   });

const port = process.env.PORT || 3000;

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`App is runnning on port ${port}`);
});

// Handle errors (Unhandle Rejection)
process.on('unhandledRejection', (err) => {
  console.log('Unhandle Rejection');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

// Create a job to send request after 14 minutes since the app will set to sleep in render after 15 minutes
