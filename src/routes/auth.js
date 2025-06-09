const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Hiển thị form đăng ký
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// Xử lý đăng ký
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    res.send("Lỗi đăng ký: " + err.message);
  }
});

// Hiển thị form đăng nhập
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Xử lý đăng nhập
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.send("Email hoặc mật khẩu không đúng.");
    }

    // Lưu session
    req.session.user = {
      _id: user._id,
      name: user.name,
      role: user.role,
    };

    // Phân quyền
    if (user.role === "admin") {
      res.redirect("/admin");
    } else {
      res.redirect("/"); // Trang home
    }
  } catch (err) {
    res.send("Lỗi đăng nhập: " + err.message);
  }
});

// Đăng xuất
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
