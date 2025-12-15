const express = require('express');

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBooking);
router.post('/', bookingController.createBooking);
router.patch('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
