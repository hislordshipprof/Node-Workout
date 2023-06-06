const express = require('express');

//using Router middle ware
const {
  getAllTours,
  getTours,
  createTour,
} = require('../controllers/tourController');

const router = express.Router();
router.param('id', checkId);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTours);

module.exports = router;
