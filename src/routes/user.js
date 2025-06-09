const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const Order = require("../models/Order");

// router.get("/dashboard", isAuthenticated, (req, res) => {
//   res.render("user/dashboard", { user: req.session.user });
// });

router.get("/orders", isAuthenticated, async (req, res) => {
  const userId = req.session.user._id;
  console.log("userId:", userId);

  try {
    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.render("user/orders", {
      orders,
      user: req.session.user,
    });
  } catch (err) {
    console.error("❌ LỖI TRUY VẤN ĐƠN HÀNG:", err); // <-- In lỗi đầy đủ
    res.status(500).send("Không thể lấy danh sách đơn hàng");
  }
});
router.post("/orders/:id/cancel", async (req, res) => {
  const userId = req.session.user._id;
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) return res.status(404).send("Không tìm thấy đơn hàng");
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res
        .status(400)
        .send("Không thể huỷ đơn hàng ở trạng thái hiện tại");
    }

    order.status = "cancelled";
    await order.save();

    res.redirect("/user/orders");
  } catch (err) {
    console.error("Lỗi huỷ đơn hàng:", err);
    res.status(500).send("Không thể huỷ đơn hàng");
  }
});
module.exports = router;
