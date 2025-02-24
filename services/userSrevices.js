const User = require("../models/userModel");
const factory = require("./handllersFactroy");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddlerware");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcrypt");
// upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${filename}`);
  req.body.profileImg = filename;
  next();
});
// @desc    Get list of user
// @route   GET /api/v1/user
// @access  Public
exports.getUsers = factory.getAll(User);
// @desc    Get specific user by id
// @route   GET /api/v1/user/:id
// @access  Public
exports.getUser = factory.getOne(User);

// @desc    Create user
// @route   POST  /api/v1/user
// @access  Private
exports.createUser = factory.createOne(User);
// @desc    Update specific user
// @route   PUT /api/v1/user/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, slug, phone, email, profileImg, role } = req.body;
  const document = await User.findByIdAndUpdate(
    id,
    { name, slug, phone, email, profileImg, role },
    { new: true }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});
exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});
// @desc    Delete specific user
// @route   DELETE /api/v1/user/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User);
