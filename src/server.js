const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const sessionMiddleware = require("./middlewares/session");

dotenv.config();
const app = express();

// Middleware
app.use(express.static("src/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);

// View engine
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Gán user vào res.locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use("/", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/admin", require("./routes/admin"));
app.use("/product", require("./routes/product"));
app.use("/cart", require("./routes/cart"));
app.use("/order", require("./routes/order"));
app.use(require("./routes/customer")); // Trang khách

// Khởi động server
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(` Server chạy tại http://localhost:${process.env.PORT}`);
  });
});
