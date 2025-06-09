const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  const products = await Product.find().limit(3);
  const categories = await Category.find({ parent: { $ne: null } })
    .limit(8)
    .lean();
  res.render("customer/home", {
    products,
    categories, // ✅ THÊM VÀO ĐÂY
  });
});

// Trang sản phẩm – hiển thị toàn bộ sản phẩm
router.get("/products", async (req, res) => {
  try {
    const { search, category } = req.query;

    // Tạo query object
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      const selected = await Category.findById(category);

      // Nếu là danh mục cha, tìm con
      const subCategories = await Category.find({ parent: category });
      const subCategoryIds = subCategories.map((c) => c._id.toString());

      if (subCategoryIds.length > 0) {
        // Là cha, tìm theo tất cả con
        query.category = { $in: subCategoryIds };
      } else {
        // Là con, lọc bình thường
        query.category = category;
      }
    }

    // Lấy danh sách sản phẩm phù hợp
    const products = await Product.find(query).populate("category");

    // Lấy toàn bộ danh mục (đa cấp)
    const categories = await Category.find();

    res.render("customer/products", {
      products,
      categories,
      search: search || "",
      selectedCategory: category || "",
    });
  } catch (err) {
    console.error("Lỗi lấy danh sách sản phẩm:", err);
    res.status(500).send("Lỗi lấy danh sách sản phẩm");
  }
});

// Trang chủ
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().limit(3);
    res.render("customer/home", { products });
  } catch (err) {
    res.status(500).send("Lỗi hiển thị trang chủ");
  }
});

module.exports = router;
