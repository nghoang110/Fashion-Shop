const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Product.deleteMany({});
  await Product.insertMany([
    {
      name: "Áo phông trắng",
      price: 450000,
      image: "/img/t-shirt.jpg",
      description: "Áo phông trắng đơn giản, phù hợp đi chơi.",
      category: "áo",
    },
    {
      name: "Áo Blazer",
      price: 950000,
      image: "/img/blazer.jpg",
      description: "Áo Blazer phong cách lịch sự.",
      category: "áo",
    },
    {
      name: "Quần jean xanh",
      price: 600000,
      image: "/img/denim.jpg",
      description: "Quần jean co giãn, chất vải dày.",
      category: "quần",
    },
    {
      name: "Áo khoác bomber",
      price: 1200000,
      image: "/img/bomber.jpg",
      description: "Áo khoác bomber thời trang, chất vải dày dặn, giữ ấm tốt.",
      category: "áo",
    },
    {
      name: "Áo sơ mi trắng",
      price: 700000,
      image: "/img/shirt.jpg",
      description: "Áo sơ mi cổ điển, phù hợp đi làm, đi chơi, chất liệu mát.",
      category: "áo",
    },
    {
      name: "Quần tây đen",
      price: 850000,
      image: "/img/trousers-black.jpg",
      description: "Quần tây form slim-fit, lịch lãm, dễ phối đồ.",
      category: "quần",
    },
    {
      name: "Áo hoodie nâu",
      price: 900000,
      image: "/img/hoodie-brown.jpg",
      description: "Hoodie chất nỉ, mang lại phong cách trẻ trung, năng động.",
      category: "áo",
    },
    {
      name: "Quần short kaki",
      price: 500000,
      image: "/img/short-khaki.jpg",
      description: "Quần short thoáng mát, thích hợp cho mùa hè năng động.",
      category: "quần",
    },
    {
      name: "Áo len cổ tròn",
      price: 750000,
      image: "/img/sweater-crew.jpg",
      description: "Áo len mỏng cổ tròn, phong cách Hàn Quốc thanh lịch.",
      category: "áo",
    },
  ]);
  console.log("✅ Đã thêm sản phẩm mẫu.");
  process.exit();
});
