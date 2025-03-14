const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Brand required'],
            unique: [true, 'Brand must be unique'],
            minlength: [3, 'Too short Brand name'],
            maxlength: [32, 'Too long Brand name'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        image: String,
    },
    { timestamps: true }
)
const saveImgUrl = (doc) => {
    if (doc.image) {
        const imgUrl = `${process.env.BASE_URL}/brands/${doc.image}`
        doc.image = imgUrl
    }
}
brandSchema.post('init', (doc) => {
    saveImgUrl(doc)
})
brandSchema.post('save', (doc) => {
    saveImgUrl(doc)
})

module.exports = mongoose.model('Brand', brandSchema)
