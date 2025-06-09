const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // đường dẫn ảnh (ví dụ: "/img/shirt.jpg")
  description: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
