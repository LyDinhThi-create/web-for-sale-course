const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const dotenv = require("dotenv");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const blogRoutes = require("./routes/blogRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { setActiveMenu } = require("./middlewares/authMiddleware");
const Courses = require("./models/Course");
const Blog = require("./models/Blog");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const MongoDBStore = require("connect-mongodb-session")(session);
const requireLogin = require("./middlewares/requireLogin");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const cartMiddleware = require("./middlewares/cartMiddleware");

dotenv.config();
const app = express();

// --- 1. SỬA LỖI STORE SESSION (Dùng uri thay vì url) ---
const storeAdmin = new MongoDBStore({
  uri: process.env.MONGO_URI, // <--- SỬA THÀNH 'uri'
  collection: "adminSessions",
});
const storeUser = new MongoDBStore({
  uri: process.env.MONGO_URI, // <--- SỬA THÀNH 'uri'
  collection: "userSessions",
});

// Bắt lỗi kết nối Store để không sập app
storeAdmin.on('error', function(error) { console.log('Admin Session Store Error:', error); });
storeUser.on('error', function(error) { console.log('User Session Store Error:', error); });

// Thiết lập session middleware
const adminSession = session({
  name: "admin-session",
  secret: process.env.SECRET_KEY_ADMIN || "admin_secret", // Fallback nếu quên env
  resave: false,
  saveUninitialized: false,
  store: storeAdmin,
  cookie: { maxAge: 1000 * 60 * 60 * 2, httpOnly: true },
});

const userSession = session({
  name: "user-session",
  secret: process.env.SECRET_KEY_USER || "user_secret", // Fallback nếu quên env
  resave: false,
  saveUninitialized: false,
  store: storeUser,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

// Kết nối DB
connectDB();

// View engine
app.set("views", path.join(process.cwd(), "src/views"));
app.set("view engine", "pug");

// ⚙️ Cho phép truy cập file tĩnh (CSS, JS, img)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Sử dụng middleware để thiết lập menu active
app.use(setActiveMenu);
app.use(cookieParser());
app.use(cartMiddleware.cartId);

// --- ROUTES ---

// Admin Routes
app.use(
  "/admin",
  adminSession,
  flash(),
  (req, res, next) => {
    res.locals.admin = req.session.admin || null;
    res.locals.errorMsg = req.flash("errorMsg")[0] || null;
    next();
  },
  adminRoutes
);

// Course Routes
app.use(
  "/courses",
  userSession,
  flash(),
  (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.successMsg = req.flash("successMsg")[0] || null;
    res.locals.errorMsg = req.flash("errorMsg")[0] || null;
    next();
  },
  courseRoutes
);

// Blog Routes
app.use(
  "/blog",
  userSession,
  (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  },
  blogRoutes
);

// Cart Routes
app.use(
  "/cart",
  userSession,
  (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  },
  cartRoutes
);

// User Profile Routes
app.use(
  "/user",
  userSession,
  requireLogin,
  flash(),
  (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  },
  userRoutes
);

// Payment Routes
app.use(
  "/payment",
  userSession,
  (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  },
  paymentRoutes
);

// Auth Routes (Login/Register)
app.use(
  "/", // Lưu ý: Route này phải đặt gần cuối để tránh ghi đè các route khác
  userSession, 
  flash(),
  (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.successMsg = req.flash("successMsg")[0] || null;
    res.locals.errorMsg = req.flash("errorMsg")[0] || null;
    next();
  },
  authRoutes
);

// --- 2. SỬA LỖI TRANG CHỦ & CONTACT (Thêm userSession) ---
// Nếu không có userSession, req.session sẽ là undefined -> Lỗi

app.get("/", userSession, async (req, res) => {
  try {
    const featuredCourses = await Courses.find().limit(3);
    const featuredBlogs = await Blog.find().limit(3);
    res.render("pages/index", {
      title: "Trang chủ - IT Courses",
      featuredCourses,
      featuredBlogs,
      user: req.session.user || null, // Bây giờ req.session đã an toàn
    });
  } catch (error) {
    console.error("Home Error:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/contact", userSession, (req, res) => {
  res.render("pages/contact", {
    title: "Liên hệ",
    user: req.session.user || null,
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.setTimeout(150000);
server.keepAliveTimeout = 125000;
server.headersTimeout = 125000;