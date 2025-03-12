const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Category must be unique"],
      required: [true, "Category required"],
      minlength: [3, "Too short category name"],
      maxlength: [30, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
const saveImgUrl = (doc) => {
  if (doc.image) {
    const imgUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imgUrl;
  }
};
categorySchema.post("init", (doc) => {
  saveImgUrl(doc);
});
categorySchema.post("save", (doc) => {
  saveImgUrl(doc);
});

const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;
