const Review = require('../../models/reviewModel');
const AppError = require('../../utils/appError');
const catchAysnc = require('../../utils/catchAysnc');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  //Allows nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);
// exports.createReview = catchAysnc(async (req, res, next) => {

//   const newReview = await Review.create(req.body);

//   res.status(200).json({
//     status: 'success',
//     message: 'review created successfuly',
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.getAllReview = factory.getAll(Review);
// exports.getAllReview = catchAysnc(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const review = await Review.find(filter);
//   if (!review) {
//     return next(new AppError('No review found', 404));
//   }
//   res.status(201).json({
//     status: 'success',
//     message: 'review fetched successfully',
//     results: review.length,
//     data: {
//       review,
//     },
//   });
// });

exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
