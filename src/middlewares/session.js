const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");

// đảm bảo biến môi trường được nạp
dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "default-secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
});

module.exports = sessionMiddleware;
