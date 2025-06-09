const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  size: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Mỗi user chỉ có 1 giỏ hàng
  },
  items: [cartItemSchema],
});

module.exports = mongoose.model("Cart", cartSchema);
