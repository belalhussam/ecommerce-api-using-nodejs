const express = require('express')
const {
    addProductToCart,
    getLoggedUserCart,
    removeSpecificCartItem,
    clearCart,
    updateCartItemQuantity,
    applyCoupon,
} = require('../services/cartServices')
const authServices = require('../services/authServices')
const router = express.Router()
router.use(authServices.protect, authServices.allowedTo('user'))
router
    .route('/')
    .post(addProductToCart)
    .get(getLoggedUserCart)
    .delete(clearCart)
router.put('/applyCoupon', applyCoupon)
router
    .route('/:itemId')
    .delete(removeSpecificCartItem)
    .put(updateCartItemQuantity)

module.exports = router
