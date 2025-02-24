const express = require("express");
const router = express.Router();
const {
  createUserValidator,
  updateUserValidator,
  getUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validator/userValidator");
const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  resizeImage,
  uploadUserImage,
  changePassword,
} = require("../services/userSrevices");
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
router
  .route("/changePassword/:id")
  .put(changeUserPasswordValidator, changePassword);
module.exports = router;
