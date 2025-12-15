const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');

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
    customer_email: req.user.email,
    client_reference_id: req.params.toudId,
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
  });

  res.status(200).json({
    status: 'success',
    session,
  });
};

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.line_items[0].unit_amount;

  await Booking.create({ tour, user, price });
};

exports.checkoutWebhooks = async (req, res, next) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRECT;

  let event;
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret,
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    console.log('event.data', event.data);
    createBookingCheckout(event.type);
    createBookingCheckout(event.data.object);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
