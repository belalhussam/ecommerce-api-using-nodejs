const Product = require("../models/productModel");
const factory = require("./handllersFactroy");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddlerware");
exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover[0].buffer) {
    const imageCoverName = `product-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1300)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverName}`);
    req.body.imageCover = imageCoverName;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imagesName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1300)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imagesName}`);
        req.body.images.push(imagesName);
      })
    );
  }
  next();
});

// @desc    Get list of product
// @route   GET /api/v1/product
// @access  Public
exports.getProducts = factory.getAll(Product, "Product");
// @desc    Get specific product by id
// @route   GET /api/v1/product/:id
// @access  Public
exports.getProduct = factory.getOne(Product, "reviews");

// @desc    Create product
// @route   POST  /api/v1/product
// @access  Private
exports.createProduct = factory.createOne(Product);

// @desc    Update specific product
// @route   PUT /api/v1/product/:id
// @access  Private
exports.updateProduct = factory.updateOne(Product);
// @desc    Delete specific product
// @route   DELETE /api/v1/product/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product);
