const Product = require("../models/Product");
const Category = require("../models/Category");

// Danh sách sản phẩm
exports.list = async (req, res) => {
  const products = await Product.find().populate("category");
  res.render("admin/products", { products });
};

// Form thêm sản phẩm
exports.newForm = async (req, res) => {
  const categories = await Category.find().lean();
  res.render("admin/product-form", { product: null, categories });
};

// Thêm sản phẩm
exports.create = async (req, res) => {
  const { name, price, category, image, description } = req.body;
  await Product.create({ name, price, category, image, description });
  res.redirect("/admin/products");
};

// Form sửa sản phẩm
exports.editForm = async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  const categories = await Category.find().lean();
  res.render("admin/product-form", { product, categories });
};

// Cập nhật sản phẩm
exports.update = async (req, res) => {
  const { name, price, category, image, description } = req.body;
  await Product.findByIdAndUpdate(req.params.id, {
    name,
    price,
    category,
    image,
    description,
  });
  res.redirect("/admin/products");
};

// Xoá sản phẩm
exports.delete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/admin/products");
};
