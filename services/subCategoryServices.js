const SubCategoryModel = require("../models/subCategoryModel");
const factroy = require("./handllersFactroy");
exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  next();
};
// // @desc    Get list of subcategories
// // @route   GET /api/v1/subcategories
// // @access  Public

exports.getSubCategrioes = factroy.getAll(SubCategoryModel);
// // @desc    Get specific subcategories by id
// // @route   GET /api/v1/subcategories/:id
// // @access  Public
exports.getSubCategory = factroy.getOne(SubCategoryModel);

// @desc    Create subcategories
// @route   POST  /api/v1/subcategories
// @access  Private
exports.createSubCategory = factroy.createOne(SubCategoryModel);
// @desc    Update specific subcategories
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = factroy.updateOne(SubCategoryModel);

// // @desc    Delete specific subcategories
// // @route   DELETE /api/v1/subcategories/:id
// // @access  Private

exports.deleteSubCategory = factroy.deleteOne(SubCategoryModel);
