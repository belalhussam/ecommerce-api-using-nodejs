const express = require('express')
const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    createfilterObj,
    setProductIdBody,
} = require('../services/reviewServices')
const {
    getReviewValidator,
    createReviewValidator,
    updateReviewValidator,
    deleteReviewValidator,
} = require('../utils/validator/reviewValidator')
const authServices = require('../services/authServices')
const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(createfilterObj, getReviews)
    .post(
        authServices.protect,
        authServices.allowedTo('user'),
        setProductIdBody,
        createReviewValidator,
        createReview
    )
router
    .route('/:id')
    .get(getReviewValidator, getReview)
    .put(
        authServices.protect,
        authServices.allowedTo('user'),
        updateReviewValidator,
        updateReview
    )
    .delete(
        authServices.protect,
        authServices.allowedTo('user', 'manger', 'admin'),
        deleteReviewValidator,
        deleteReview
    )

module.exports = router
