const Tour = require('../models/tourModel');

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

// BUG. StripeInvalidRequestError - version: stripe@7.0.0 SOLUTION *****

// Solution :https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15087374#questions/19097544

// Heres the solution:

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
// const Tour = require('../models/tourModel')
// const catchAsync = require('../utils/catchAsync')
// const AppError = require('../utils/appError')
// const factory = require('./handlerFactory')

// exports.getCheckoutSession = catchAsync(async(req, res, next) =>{
//      // 1) Get the currently booked tour
//     const tour = await Tour.findById(req.params.tourId)

//     const transformedItems = [{
//         quantity: 1,
//         price_data: {
//             currency: "usd",
//             unit_amount: tour.price * 100,
//             product_data: {
//                 name: `${tour.name} Tour`,
//                 description: tour.description, //description here
//                 images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`], //only accepts live images (images hosted on the internet),
//             },
//         },
//     }]

//      // 2) Create checkout session
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         // success_url: `${req.protocol}://${req.get('host')}/`, //user will be redirected to this url when payment is successful. home page
//         // cancel_url: `${req.protocol}://${req.get('host')}/${tour.slug}`, //user will be redirected to this url when payment has an issue. tour page (previous page)
//         success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
//         cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
//         customer_email: req.user.email,
//         client_reference_id: req.params.tourId, //this field allows us to pass in some data about this session that we are currently creating.
//         line_items: transformedItems,
//         mode: 'payment',

//     })

//      // 3) Create session as response
//      res.status(200).json({
//         status: 'success',
//         session
//      })
// })

//2. BUG payment does not display in stripe dashboard, this becuase stripe made a lot of changes since this video was uploaded.
/***
 * 
 * 
 * 
 * 
 * https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15087374#questions/19690856
Payments not in Dashboard
80 upvotes
Leon · Lecture 211 · 2 years ago
So when I submit my payment in Postman, the payment does not display in my Stripe dashboard. This is because Stripe made a lot of changes since this video was uploaded.



The session object that is returned in the success response is also a completely different to what we see in the video.

If you look closely, you will see an URL property. This is a very long URL, and most of it is a token string.

If you CTRL+Click (Win) or Command + Click (Mac) this link, it will open up your checkout page in your browser. This should have all the Natours branding on it if you followed the previous lesson as well as the tour name, summary and price.

Within the Stripe docs, they provide us with 3 test card numbers that we can use:

To test successful payments use: 4242 4242 4242 4242
To test declined payments use: 4000 0000 0000 0002
To test authorised payments (EU) use:  4000 0000 0000 3220

- Enter any future date for the expiry date.
- Enter any 3 numbers for the security code.
- Enter any name in the name field.

When you submit the payment using one of these test cards, it will show up in your dashboard under transactions.
 */
