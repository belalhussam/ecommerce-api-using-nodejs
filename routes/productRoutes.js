const express = require("express");
const router = express.Router();
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validator/productValidator");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImage,
} = require("../services/productServices");
const authServices = require("../services/authServices");
const reviewRoute = require("../routes/reviewRoutes");
router.use("/:productId/review", reviewRoute);
router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadProductImages,
    resizeProductImage,
    createProductValidator,
    createProduct
  )
  .get(getProducts);
router
  .route("/:id")
  .get(getProduct, getProductValidator)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manger"),
    uploadProductImages,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );
module.exports = router;
