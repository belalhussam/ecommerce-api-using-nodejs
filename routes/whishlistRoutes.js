const express = require("express");
const authServices = require("../services/authServices");
const router = express.Router();
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishListServices");
router.use(authServices.protect, authServices.allowedTo("user"));
router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.route("/:productId").delete(removeProductFromWishlist);

module.exports = router;
