const express = require("express");
const router = express.Router();
const {
  signUp,
  logIn,
  forgotPassword,
  verfiyPassResetPassword,
  resetPassword,
} = require("../services/authServices");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validator/authValidator");
router.post("/signup", signupValidator, signUp);
router.post("/login", loginValidator, logIn);
router.post("/forgotpassword", forgotPassword);
router.post("/verfiyResetPassword", verfiyPassResetPassword);
router.put("/resetPassword", resetPassword);
module.exports = router;
