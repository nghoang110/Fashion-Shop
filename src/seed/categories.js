const mongoose = require("mongoose");
const Category = require("../models/Category");

async function run() {
  try {
    await mongoose.connect("mongodb://localhost:27017/fashion_shop");
    console.log("✅ Đã kết nối MongoDB");

    await Category.deleteMany({});

    const ao = await Category.create({ name: "Áo" });
    const quan = await Category.create({ name: "Quần" });

    await Category.create({ name: "Áo khoác", parent: ao._id });
    await Category.create({ name: "Áo sơ mi", parent: ao._id });
    await Category.create({ name: "Áo thun", parent: ao._id });
    await Category.create({ name: "Áo mùa đông", parent: ao._id });

    await Category.create({ name: "Quần jeans", parent: quan._id });
    await Category.create({ name: "Quần short", parent: quan._id });
    await Category.create({ name: "Quần âu", parent: quan._id });

    console.log("✅ Thêm danh mục mẫu thành công");
  } catch (err) {
    console.error("❌ Lỗi:", err);
  } finally {
    process.exit();
  }
}

run();
