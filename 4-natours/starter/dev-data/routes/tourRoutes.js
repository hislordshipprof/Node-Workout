const fs = require('fs');
const express = require('express');

const {
  getAllTours,
  getTours,
  createTours,
  updateTours,
  deleteTours,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  CheckId,
  checkBody,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('./../controllers/tourControllers');
const reviewRouter = require('./../routes/reviewRoutes');
const { protect, restrictTo } = require('../controllers/authController');
// const { createReview } = require('../controllers/reviewController');
const router = express.Router();

// initial way of creating a review on the tour
// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

router.use('/:tourId/reviews', reviewRouter);

// router.param('id', CheckId);
//middleware to chnage the request object when this endpoint is reached
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
//
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

// /tours-distance/233/center/34.111745,-118.113491/unit/mi
router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTours);
router
  .route('/:id')
  .get(getTours)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTours
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTours);

module.exports = router;
