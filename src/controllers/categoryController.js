const Category = require("../models/Category");

// Hiển thị danh sách danh mục
exports.list = async (req, res) => {
  const categories = await Category.find().lean();
  res.render("admin/categories", { categories });
};

// Hiển thị form thêm mới
exports.newForm = async (req, res) => {
  const parents = await Category.find({ parent: null }).lean();
  res.render("admin/category-form", { category: null, parents });
};

// Thêm danh mục
exports.create = async (req, res) => {
  const { name, parent } = req.body;
  await Category.create({ name, parent: parent || null });
  res.redirect("/admin/categories");
};

// Hiển thị form chỉnh sửa
exports.editForm = async (req, res) => {
  const category = await Category.findById(req.params.id).lean();
  const parents = await Category.find({ parent: null }).lean();
  res.render("admin/category-form", { category, parents });
};

// Cập nhật danh mục
exports.update = async (req, res) => {
  const { name, parent } = req.body;
  await Category.findByIdAndUpdate(req.params.id, {
    name,
    parent: parent || null,
  });
  res.redirect("/admin/categories");
};

// Xoá danh mục
exports.delete = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/admin/categories");
};
