const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { isAuthenticated } = require("../middlewares/auth");
const nodemailer = require("nodemailer");

// Trang thanh toán
router.get("/checkout", isAuthenticated, async (req, res) => {
  const userId = req.session.user._id;
  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart || cart.items.length === 0) return res.redirect("/cart");

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  res.render("customer/checkout", {
    cart,
    totalAmount,
    user: req.session.user,
  });
});

// Xử lý đặt hàng
router.post("/checkout", isAuthenticated, async (req, res) => {
  const userId = req.session.user._id;
  const { address, phone, paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) return res.redirect("/cart");

    const items = cart.items.map((item) => ({
      product: item.productId._id,
      quantity: item.quantity,
    }));

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    // Tạo đơn hàng
    await Order.create({
      user: userId,
      items,
      totalAmount,
      status: "pending",
      address,
      phone,
      paymentMethod,
    });

    // Gửi email cho admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const productList = cart.items
      .map(
        (item) =>
          `- ${item.productId.name} (Size: ${item.size}, SL: ${item.quantity})`
      )
      .join("<br>");

    const mailOptions = {
      from: `"Fashion Shop" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Có đơn hàng mới từ khách hàng",
      html: `
        <h3>Khách hàng: ${req.session.user.name}</h3>
        <p><strong>Địa chỉ:</strong> ${address}</p>
        <p><strong>SĐT:</strong> ${phone}</p>
        <p><strong>Phương thức thanh toán:</strong> ${paymentMethod}</p>
        <p><strong>Sản phẩm:</strong><br>${productList}</p>
        <p><strong>Tổng tiền:</strong> ${totalAmount.toLocaleString()}₫</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Xoá giỏ hàng
    await Cart.deleteOne({ userId });

    res.render("customer/order-success", { user: req.session.user });
  } catch (err) {
    console.error("Lỗi đặt hàng:", err);
    res.status(500).send("Lỗi xử lý đặt hàng");
  }
});

module.exports = router;
