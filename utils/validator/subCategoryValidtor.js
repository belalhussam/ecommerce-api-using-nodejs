const { check } = require('express-validator')
const validatorMiddleware = require('../../middlewares/validatioMiddleware')
const slugify = require('slugify')
exports.createSubCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('SubCategory required')
        .isLength({ min: 2 })
        .withMessage('Too short Subcategory name')
        .isLength({ max: 32 })
        .withMessage('Too long Subcategory name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val)
            return true
        }),
    check('category')
        .notEmpty()
        .withMessage('subCategory must be belong to category')
        .isMongoId()
        .withMessage('Invalid Category id format'),
    validatorMiddleware,
]
exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
]

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    check('name').custom((val, { req }) => {
        req.body.slug = slugify(val)
        return true
    }),
    validatorMiddleware,
]

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
]
