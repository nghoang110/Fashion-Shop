const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");

// Trang chi tiết sản phẩm
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Kiểm tra ID có hợp lệ không (24 ký tự hex)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("ID không hợp lệ:", id);
      return res.status(400).send("ID không hợp lệ");
    }

    const product = await Product.findById(id);
    if (!product) {
      console.log("Không tìm thấy sản phẩm với ID:", id);
      return res.status(404).send("Không tìm thấy sản phẩm");
    }

    res.render("customer/product-detail", {
      product,
      user: req.session.user || null,
    });
  } catch (err) {
    console.error("Lỗi khi tìm sản phẩm:", err);
    res.status(500).send("Đã xảy ra lỗi");
  }
});

module.exports = router;
