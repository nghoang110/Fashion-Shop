const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Đảm bảo bạn có file models/Product.js
const Order = require("../models/Order");
const User = require("../models/User");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");

router.get("/products", isAdmin, productController.list);
router.get("/products/new", isAdmin, productController.newForm);
router.post("/products/new", isAdmin, productController.create);
router.get("/products/edit/:id", isAdmin, productController.editForm);
router.post("/products/edit/:id", isAdmin, productController.update);
router.post("/products/delete/:id", isAdmin, productController.delete);

router.get("/categories", isAdmin, categoryController.list);
router.get("/categories/new", isAdmin, categoryController.newForm);
router.post("/categories/new", isAdmin, categoryController.create);
router.get("/categories/edit/:id", isAdmin, categoryController.editForm);
router.post("/categories/edit/:id", isAdmin, categoryController.update);
router.post("/categories/delete/:id", isAdmin, categoryController.delete);

// Middleware kiểm tra quyền admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.redirect("/login");
  }
}

// Trang dashboard admin
router.get("/", isAdmin, (req, res) => {
  res.render("admin/dashboard", { user: req.session.user });
});

//--
router.get("/orders", isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.render("admin/orders", {
      orders,
      user: req.session.user,
    });
  } catch (err) {
    console.error("Lỗi khi lấy đơn hàng:", err);
    res.status(500).send("Lỗi khi lấy danh sách đơn hàng");
  }
});

router.post("/orders/:id/status", isAdmin, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });

    res.redirect("/admin/orders");
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);
    res.status(500).send("Không thể cập nhật trạng thái");
  }
});

module.exports = router;
