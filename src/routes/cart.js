const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// Hiển thị giỏ hàng
router.get("/", async (req, res) => {
  try {
    const userId = req.session.user._id;
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    // Nếu chưa có giỏ, tạo giỏ rỗng
    if (!cart) {
      cart = { items: [] };
    }

    res.render("customer/cart", {
      cart,
      user: req.session.user,
    });
  } catch (err) {
    console.error("Lỗi hiển thị giỏ hàng:", err);
    res.status(500).send("Lỗi hiển thị giỏ hàng");
  }
});

// Thêm sản phẩm vào giỏ hàng
router.post("/add/:id", async (req, res) => {
  const { size, quantity } = req.body;
  const productId = req.params.id;
  const userId = req.session.user._id;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.redirect("/products");

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (index >= 0) {
      cart.items[index].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        productId,
        size,
        quantity: parseInt(quantity),
      });
    }

    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.error("Lỗi thêm sản phẩm vào giỏ:", err);
    res.status(500).send("Lỗi thêm sản phẩm vào giỏ");
  }
});

// Xoá sản phẩm khỏi giỏ hàng
router.post("/remove/:itemId", async (req, res) => {
  try {
    const userId = req.session.user._id;
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.redirect("/cart");

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.error("Lỗi xoá sản phẩm:", err);
    res.status(500).send("Lỗi xoá sản phẩm");
  }
});

// Cập nhật sản phẩm trong giỏ
router.post("/update/:itemId", async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { quantity, size } = req.body;
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.redirect("/cart");

    const item = cart.items.find((i) => i._id.toString() === itemId);
    if (item) {
      item.quantity = parseInt(quantity);
      item.size = size;
    }

    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.error("Lỗi cập nhật giỏ hàng:", err);
    res.status(500).send("Lỗi cập nhật giỏ hàng");
  }
});

module.exports = router;
