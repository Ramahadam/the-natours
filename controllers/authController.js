/* eslint-disable arrow-body-style */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  console.log('login handle controler');
  const { email, password } = req.body;

  // 01) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 404));
  }

  // 02) Check if email && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Invalid user or password', 401));

  // 01) If everything is ok, send token to client

  const token = signToken(user._id);

  res.status(200).json({
    status: 'sccuess',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 01) Getting token and check if it's there.

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not loggedin, please login to get access', 401),
    );
  }

  // 02) Verification of token to verify if the token exists
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 03) Check if the user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('The user does not exist, please login!'), 401);
  }

  // 04) Check if the user changed the password after the token was issued.

  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed the password, please login again!'),
      401,
    );
  }

  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array ['admin','lead-guide'] .

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  //generate the random token

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // send it back as email  {{URL}}api/v1/users/resetPassword/7878787
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Hello!You are receiving this email because we received a password reset request for your account. ${resetUrl} \n this password link will expire in 10 minutes`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sends to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending email', 500));
  }
});

exports.resetPassword = (req, res, next) => {};
