const express = require('express');

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get(
  '/create-checkout-session/:tourId',
  bookingController.getCheckoutSession,
);

module.exports = router;
