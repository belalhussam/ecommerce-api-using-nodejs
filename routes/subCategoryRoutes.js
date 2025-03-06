const express = require('express')
const router = express.Router({ mergeParams: true })
const {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} = require('../utils/validator/subCategoryValidtor')
const {
    createSubCategory,
    getSubCategrioes,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObj,
} = require('../services/subCategoryServices')
const authServices = require('../services/authServices')
router
    .route('/')
    .get(createFilterObj, getSubCategrioes)
    .post(
        authServices.protect,
        authServices.allowedTo('admin', 'manger'),
        createSubCategoryValidator,
        setCategoryIdToBody,
        createSubCategory
    )
router
    .route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(
        authServices.protect,
        authServices.allowedTo('admin', 'manger'),
        updateSubCategoryValidator,
        updateSubCategory
    )
    .delete(
        authServices.protect,
        authServices.allowedTo('admin', 'manger'),
        deleteSubCategoryValidator,
        deleteSubCategory
    )

module.exports = router
