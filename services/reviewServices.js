const Review = require("../models/reviewModel");
const factory = require("./handllersFactroy");
exports.createfilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.productId) filterObj = { product: req.params.productId };
  req.filterObj = filterObj;
  next();
};
exports.setProductIdBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
// @desc    Get list of Reviews
// @route   GET /api/v1/Reviews
// @access  Public
exports.getReviews = factory.getAll(Review);
// @desc    Get specific Review by id
// @route   GET /api/v1/Review/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// @desc    Create Review
// @route   POST  /api/v1/Review
// @access  Private
exports.createReview = factory.createOne(Review);
// @desc    Update specific Review
// @route   PUT /api/v1/Review/:id
// @access  Private
exports.updateReview = factory.updateOne(Review);

// @desc    Delete specific Review
// @route   DELETE /api/v1/Review/:id
// @access  Private
exports.deleteReview = factory.deleteOne(Review);
