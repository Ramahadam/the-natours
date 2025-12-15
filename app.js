const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.enable('trust proxy');

// Allow-access-controll origin
app.use(cors());

// Include POST,PATCH,DELET to cors using app.options
app.options('*', cors()); // include before other routes

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 01. Global middlewares
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// SET HTTP security headers
// SAFE: Configure a specific, secure policy - axios CDN was blocked so excluded from helmet
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         'https://cdn.jsdelivr.net',
//         'https://cdnjs.cloudflare.com',
//       ],
//       connectSrc: ["'self'", 'https://cdn.jsdelivr.net'],
//     },
//   }),
// );

// Development loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Data Sanitisation against NoSQL query injection attack.
app.use(mongoSanitize());

// Data sanitisation against XXS attack
app.use(xss());

// Body parser : reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests for this API , please try after one hour',
});

// Use limit middleware to limit the number of requests
app.use('/api', limiter);
app.use(cookieParser());

// Prevent Parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'maxGroupSize',
      'price',
    ],
  }),
);

// Test middleware
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();

  next();
});

//  Routes
const viewRouter = require(`./routes/viewRoutes`);
const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);
const reviewRouter = require(`./routes/reviewRoutes`);
const bookingRouter = require(`./routes/bookingRoutes`);

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handle undefined route
app.all('*', (req, res, next) => {
  // We pass the error down to our global error middleware

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
