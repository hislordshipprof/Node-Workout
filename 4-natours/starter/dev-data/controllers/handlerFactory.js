const catchAsync = require('../../utils/catchAysnc');
const AppError = require('../../utils/appError');
const APIFeatures = require('../../utils/apiFeature');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    // console.log('tour', doc);
    if (!doc) {
      return next(new AppError('No doc found', 404));
    }
    res.status(204).json({
      status: 'successfull',
      data: {
        doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No doc found', 404));
    }
    res.status(200).json({
      status: 'successfull',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    //To Allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    //the explain() method is used to get the execution plan for a query
    // const docs = await features.query.explain();
    const docs = await features.query;

    // const tours =await query

    //SENDING RESPONSE
    res.status(200).json({
      status: 'fetch success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
