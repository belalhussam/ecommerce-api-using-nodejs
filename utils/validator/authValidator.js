const validatorMiddleware = require('../../middlewares/validatioMiddleware')
const User = require('../../models/userModel')
const slugify = require('slugify')
const { check } = require('express-validator')

exports.signupValidator = [
    check('name')
        .notEmpty()
        .withMessage('Brand required')
        .isLength({ min: 3 })
        .withMessage('Too short Brand name')
        .isLength({ max: 32 })
        .withMessage('Too long Brand name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val)
            return true
        }),
    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .custom((val) =>
            User.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error('E-mail already in user'))
                }
            })
        ),
    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorrect')
            }
            return true
        }),
    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirmation required'),

    validatorMiddleware,
]
exports.loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address'),

    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    validatorMiddleware,
]
