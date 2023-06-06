const User = require('../../models/userModel');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../../utils/appError');
const catchAysnc = require('../../utils/catchAysnc');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // console.log('here is req.user,id', req.user.id);
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

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

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAysnc(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
      // console.log('--helloo', (newObj[el] = obj[el]));
    }
  });
  return newObj;
};

exports.getAllUser = factory.getAll(User);
// exports.getAllUser = catchAysnc(async (req, res, next) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: 'success',
//     message: 'User fecched successfully',
//     data: {
//       users,
//     },
//   });
// });

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined please use signup instead',
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.UpdateMe = catchAysnc(async (req, res, next) => {
  // 1) Create error if user try to update password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update.Please use UpdateMyPassword',
        400
      )
    );
  }
  //  (2.) Filtered out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  // 2) Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAysnc(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    message: 'User deleted successfully',
    data: null,
  });
});

exports.getUser = factory.getOne(User);
// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'Missing route',
//   });
// };

//we exclude updating password with this
exports.updateUser = factory.updateOne(User);
// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'Missing route',
//   });
// };

exports.deleteUser = factory.deleteOne(User);
