const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');

const factory = require('./factoryHandler');

const stripe = require('stripe')(process.env.STRAPI_SECRET_KEY);

exports.getCheckoutSession = async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: tour.name,
          },
          unit_amount: tour.price,
        },
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:4242/success',
  });

  res.status(200).json({
    status: 'success',
    session,
  });
};

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
