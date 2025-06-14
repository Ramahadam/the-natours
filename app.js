const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();

  next();
});

//  Routes
const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handle undefined route
app.all('*', (req, res, next) => {
  // We pass the error down to our global error middleware

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
