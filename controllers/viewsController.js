const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  //Get tour data
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    feild: 'rating user review',
  });

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginFrom = (req, res) => {
  res.status(200).render('login', {
    title: 'Login into your account',
  });
};
