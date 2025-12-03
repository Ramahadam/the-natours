const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour max length is 40 characters'],
      minLength: [10, 'A tour min length is 10 characters'],
      // validate: [validator.isAlpha, 'A tour name must contain characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficluty must be either easy,meduim or difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      minLength: [1, 'Ratings  must be above 1.0'],
      maxLength: [5, 'Ratings must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'This field is require'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        // ⚠️caveat : this only points to current doc on NEW document creation
        message: `Discount price {VALUE} should be below regular price`,
      },
    },
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
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        description: String,
        address: String,
        coordinates: [Number],
        day: Number,
      },
    ],

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE :
// PRE MIDDLEWARE => runs only bfore .save() and .create() it won't run in saveMany.

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.index({ startLocation: '2dsphere' });

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    replacement: '_',
  });
  // console.log(this);
  next();
});

tourSchema.pre('findOne', function (next) {
  this.populate('reviews');

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

// Populate tour guides
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start}`);
  next();
});

// AGGREGATION MIDDLEWARE:=> Allows us to add hooks before or after the aggregation happen
// Below are excluding the secure tours for tours stats route where are using aggregation
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
