const express = require('express')
const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
} = require('..//utils/validator/brandValidator')
const {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    resizeImage,
} = require('../services/brandServices')
const authServices = require('../services/authServices')
const router = express.Router()
router
    .route('/')
    .get(getBrands)
    .post(
        authServices.protect,
        authServices.allowedTo('admin', 'manger'),
        uploadBrandImage,
        resizeImage,
        createBrandValidator,
        createBrand
    )
router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        authServices.protect,
        authServices.allowedTo('admin', 'manger'),
        uploadBrandImage,
        resizeImage,
        updateBrandValidator,
        updateBrand
    )
    .delete(
        authServices.protect,
        authServices.allowedTo('admin'),
        deleteBrandValidator,
        deleteBrand
    )

module.exports = router
