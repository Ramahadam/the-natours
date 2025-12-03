const express = require('express');
const reviewRouter = require('./reviewRoutes');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', tourController);

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewContoller.createReview,
//   );

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/monthyl-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyReport,
  );

router
  .route('/tour-stats')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getTourStats,
  );

router
  .route('/tours-within/distance/:distance/center/:latlang/unit/:unit')
  .get(tourController.tourWithin);

router.route('/distances/:latlang/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
