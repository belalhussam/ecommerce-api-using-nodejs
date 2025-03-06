const mongoose = require('mongoose')
const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: [true, 'subCategory must be unique'],
            required: [true, 'subCategory required'],
            minlength: [2, 'Too short subcategory name'],
            maxlength: [30, 'Too long subcategory name'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category',
            required: true,
        },
    },
    { timestamps: true }
)
subCategorySchema.pre(/^find/, function (next) {
    this.populate({ path: 'category', select: 'name -_id' })
    next()
})
const subCategoryModel = mongoose.model('SubCategory', subCategorySchema)
module.exports = subCategoryModel
