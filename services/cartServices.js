const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const ApiError = require('../utils/apiError')
const Coupon = require('../models/couponModel')
const asyncHandler = require('express-async-handler')
const calcTotalCartPrice = (cart) => {
    let totalPrice = 0
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price
    })
    cart.totalCartPrice = totalPrice
    cart.totalPriceAfterDiscount = undefined
    return totalPrice
}

exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body
    let cart = await Cart.findOne({ user: req.user._id })
    const product = await Product.findById(productId)
    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [{ product: productId, color, price: product.price }],
        })
    } else {
        const productIndex = cart.cartItems.findIndex(
            (item) =>
                item.product.toString() === productId && item.color === color
        )
        if (productIndex > -1) {
            const cartItme = cart.cartItems[productIndex]
            cartItme.quantity += 1
        } else {
            cart.cartItems.push({
                product: productId,
                color,
                price: product.price,
            })
        }
    }
    calcTotalCartPrice(cart)
    await cart.save()
    res.status(200).json({ data: cart.cartItems.length, cart })
})

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        return next(
            new ApiError(
                `There is no cart for this user id : ${req.user._id}`,
                404
            )
        )
    }
    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    })
})
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: { cartItems: { _id: req.params.itemId } },
        },
        { new: true }
    )
    calcTotalCartPrice(cart)
    cart.save()
    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    })
})
exports.clearCart = asyncHandler(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user._id })
    res.status(204).send()
})
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        return next(
            new ApiError(`there is no cart for user ${req.user._id}`, 404)
        )
    }

    const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId
    )
    if (itemIndex > -1) {
        const cartItem = cart.cartItems[itemIndex]
        cartItem.quantity = quantity
        cart.cartItems[itemIndex] = cartItem
    } else {
        return next(
            new ApiError(
                `there is no item for this id :${req.params.itemId}`,
                404
            )
        )
    }
    calcTotalCartPrice(cart)
    await cart.save()
    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    })
})
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findOne({
        name: req.body.coupon,
        expire: { $gt: Date.now() },
    })

    if (!coupon) {
        return next(new ApiError(`Coupon is invalid or expired`))
    }
    const cart = await Cart.findOne({ user: req.user._id })

    const totalPrice = cart.totalCartPrice

    const totalPriceAfterDiscount = (
        totalPrice -
        (totalPrice * coupon.discount) / 100
    ).toFixed(2) // 99.23

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount
    await cart.save()
    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    })
})
