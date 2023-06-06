const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const Tour = require('../../models/tourModel');
const APIFeatures = require('../../utils/apiFeature');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAysnc');
const factory = require('./handlerFactory');
// console.log('--here is tour', Tour);
//creating own middleware
// exports.CheckId = (req, res, next, val) => {
//   console.log(val);
//   if (req.params.id * 1 > data.length) {
//     return res.status(400).json({
//       status: 'failed',
//       message: 'invalid request ',
//     });
//   }
//   next();
// };
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload image', 404), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  //1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  //2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});
//middleware to check if the request conatin all the body paramteres
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'failed',
//       message: 'missing name or price',
//     });
//   }
//   next();
// };

//here we prefile the query string by creating a middleware so the user doesnt do that
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,ratingsAverage,price,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync(async (req, res) => {
//   console.log('--this is query', req.query);

//   //Filtering on the model
//   // const tours = await Tour.find({ duration: 5, difficulty: 'easy' });

//   //chaining the model to perform filtering
//   // const tours = await Tour.find();
//   // .where('duration')
//   // .equals(5)
//   // .where('difficulty')
//   // .equals('easy');

//   // 1 A). FILTERING
//   // const queryObj = { ...req.query };
//   // const ExcludedObj = ['page', 'sort', 'limit', 'fields'];
//   // ExcludedObj.forEach((el) => delete queryObj[el]);
//   // // console.log(queryObj, ExcludedObj);

//   // // 1 B). ADVANCE FILTERING
//   // let queryStr = JSON.stringify(queryObj);
//   // queryStr = queryStr.replace(
//   //   /\b(gte|lte|lt|get)\b/g,
//   //   (match) => `$${match}`
//   // );
//   // // console.log(JSON.parse(queryStr));

//   // // SAVING THE TOUR OBJECT IN A VARIABLE SO WE CAN USE ANYTIME WITHOUT AWAITING
//   // let query = Tour.find(JSON.parse(queryStr));
//   // console.log(tours);

//   // 2). SORTING
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(',').join(' ');
//   //   query = query.sort(sortBy);
//   // } else {
//   //   query = query.sort('-createdAt');
//   // }

//   //3) field limiting we use this to select the partcular fields we want from modelvv
//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(',').join(' ');
//   //   query = query.select(fields);
//   // } else {
//   //   query = query.select('-__v');
//   // }

//   //4 pagination

//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 100;
//   // const skip = (page - 1) * limit;
//   // query = query.skip(skip).limit(limit);

//   // if (req.query.page) {
//   //   const numTours = await Tour.countDocuments();
//   //   if (skip >= numTours) throw new Error('this page is nt found');
//   // }

//   //EXECUTING AND Awaitng the query
//   const features = new APIFeatures(Tour, req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .pagination();
//   const tours = await features.query;
//   // const tours =await query

//   //SENDING RESPONSE
//   res.status(200).json({
//     status: 'fetch success',
//     results: tours.length,
//     data: {
//       tour: tours,
//     },
//   });
// });

exports.createTours = factory.createOne(Tour);
// exports.createTours = catchAsync(async (req, res) => {
//   // const newTour =new Tour({})
//   // newTour.save()

//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

exports.getTours = factory.getOne(Tour, { path: 'reviews' });

// exports.getTours = catchAsync(async (req, res) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   if (!tour) {
//     return next(new AppError('No tour found', 404));
//   }
//   res.status(200).json({
//     status: 'successfull',
//     data: {
//       tours: tour,
//     },
//   });
// });

exports.updateTours = factory.updateOne(Tour);
// exports.updateTours = catchAsync(async (req, res) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour) {
//     return next(new AppError('No tour found', 404));
//   }
//   res.status(200).json({
//     status: 'successfull',
//     data: {
//       tour,
//     },
//   });
// });

exports.deleteTours = factory.deleteOne(Tour);

// exports.deleteTours = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   console.log('tour', tour);
//   if (!tour) {
//     return next(new AppError('No tour found', 404));
//   }
//   res.status(204).json({
//     status: 'successfull',
//     data: {
//       tour,
//     },
//   });
// });

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  res.status(200).json({
    status: 'successfull',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
  ]);
  res.status(200).json({
    status: 'successfull',
    results: plan.length,
    data: {
      plan,
    },
  });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
