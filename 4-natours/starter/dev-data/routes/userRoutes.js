// const app = require("express")
const express = require('express');
const {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  UpdateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('./../controllers/userControllers');

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require('./../controllers/authController');

const router = express.Router();

router.post('/signUp', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//to protect all the routes under this middleware
router.use(protect);

router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, UpdateMe);
router.delete('/deleteMe', deleteMe);
router.get('/me', getMe, getUser);

//restrict users
router.use(restrictTo('admin'));
router.route('/').get(getAllUser).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
