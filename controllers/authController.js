/* eslint-disable arrow-body-style */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const sendEmail = require('../utils/email');
const Email = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NOD_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove the cookie from the output.
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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

  const url = `${req.protocol}://${req.get('host')}/me`;

  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
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
  createSendToken(user, 200, res);
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 01) Getting token and check if it's there.

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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

exports.isLoggedIn = async (req, res, next) => {
  // 01) Check if the cookies exist

  if (req.cookies.jwt) {
    try {
      // 02) Verification of the JWT in the cookies
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 03) Check if the user still exists
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next();
      }

      // 04) Check if the user changed the password after the token was issued.
      if (currentUser.changePasswordAfter(decoded.iat)) {
        return next();
      }

      // If there is loggedin user add the current user to local this will be used in inside pug template
      res.locals.user = currentUser;

      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

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

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetUrl).sendPasswordReset();

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

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or expire', 400));
  // if token has not expired, and there is user, set new password.
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // Update changedPassword At property for the user
  // We will create a pre save middleware for this functionality

  // log the user in, send jwt.

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // As security measure we always ask for current password before updating it.
  // 01.Get the user from the collection
  const { currentPassword, newPassword, passwordConfirm } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // 02. Check if the posted password current password is correct.
  const isCorrectPassword = await user.correctPassword(
    currentPassword,
    user.password,
  );

  if (!user || !isCorrectPassword)
    return next(new AppError('The current password is not correct', 401));

  // 03. Update the password.
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  // 04. Log user is, send JWT to the user
  createSendToken(user, 200, res);
});
