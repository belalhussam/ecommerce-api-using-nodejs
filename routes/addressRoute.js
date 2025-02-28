const express = require("express");
const authServices = require("../services/authServices");
const router = express.Router();
const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../services/addresseService");
router.use(authServices.protect, authServices.allowedTo("user"));
router.route("/").post(addAddress).get(getLoggedUserAddresses);
router.route("/:addressId").delete(removeAddress);

module.exports = router;
