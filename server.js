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

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('Connection established ✅');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App is runnning on port ${port}`);
});

// Handle errors (Unhandle Rejection)
process.on('unhandledRejection', (err) => {
  console.log('Unhanle Rejection');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
