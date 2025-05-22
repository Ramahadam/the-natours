const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      require: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      require: [true, 'A tour must have group size'],
    },
    difficulty: {
      type: String,
      require: [true, 'A tour must have a difficulty'],
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'This field is require'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A  tour must have a desctiption'],
    },

    desctiption: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    startDates: [Date],
    slug: String,

    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE :
// PRE MIDDLEWARE => runs only bfore .save() and .create() it won't run in saveMany.

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    replacement: '_',
  });
  // console.log(this);
  next();
});

// POST MIDDLEWARE => runs after the docuement has been saved
// it has access to the saved docuement and next.

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);

//   next();
// });

// QUERY MIDDLEWARE - find query runs pre or post the query execution.
// the query middleare pre => has access to this keywords which point to the current query
// We use regular expression to execute on all the queries that has find, e.g findById, findOne ....
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();

  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start}`);
  next();
});

// AGGREGATION MIDDLEWARE:=> Allows us to add hooks before or after the aggregation happen
// Below are excluding the secure tours for tours stats route where are using aggregation
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
