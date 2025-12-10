const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
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

  if (!tour)
    return next(new AppError('Cannot find tour with mentioned slug', 400));

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

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Account infomation',
    user: req.user,
  });
});

exports.updateUserDate = async (req, res, next) => {
  console.log(req.file);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
    },
  );

  res.status(200).render('account', {
    status: 'success',
    user: updatedUser,
  });
};
