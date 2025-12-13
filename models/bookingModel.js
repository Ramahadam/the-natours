const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a Tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a User!'],
    },
    price: {
      type: Number,
      require: [true, 'Booking must have a price'],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Booking = mongoose.model('Booking', bookingSchema);

// Virtual populate

// bookingSchema.virtual('tours', {
//   ref: 'Tour',
//   foreignField: 'tour',
//   localField: '_id',
// });

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });

  next();
});

module.exports = Booking;
