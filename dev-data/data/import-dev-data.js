const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

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
    // console.log(con.connections);
  });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

// IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours); // we can use create method to create bulk document
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successflly loaded');
  } catch (err) {
    console.log(err);
  }

  process.exit(); // To exit from the process
};

// DELETE ALL DATA FROM COLLECTION

const deleteData = async () => {
  try {
    ``;
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successflly deleted');
  } catch (err) {
    console.log(err);
  }

  process.exit(); // To exit from the process
};

// How to run/call import data and delete data
// We are going to use command line to achieve that
//Run the current file
//To import data run => node dev-data/data/import-dev-data.js --import
//To delete data run => node dev-data/data/import-dev-data.js --delete
// this will be store in an arry in process.argv

// console.log(process.argv);
// [
//   'C:\\Program Files\\nodejs\\node.exe',
//   'C:\\Users\\deem_admin\\Desktop\\the natours\\dev-data\\data\\import-dev-data.js',
//   '--import',
// ];

if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}
