const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const dotenv = require("dotenv");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const blogRoutes = require("./routes/blogRoutes");
const { setActiveMenu } = require("./middlewares/authMiddleware");
const Courses = require("./models/Course");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const MongoDBStore = require("connect-mongodb-session")(session);
const requireLogin = require("./middlewares/requireLogin");
dotenv.config();
const app = express();
// Thiết lập session middleware
app.use(
  session({
    secret: process.env.SECRET_KEY, // key dùng để mã hóa session cookie
    resave: false, // không lưu session nếu không thay đổi
    saveUninitialized: false, // không tạo session nếu chưa login
    store: new MongoDBStore({
      url: process.env.MONGODB_URI,
      colection: "sessions",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 2, httpOnly: true }, // thời gian sống của cookie (ms)
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
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

// Routes
app.use("/courses", courseRoutes);
app.use("/admin", adminRoutes);
app.use("/blog", blogRoutes);
app.use("/", authRoutes);

// Trang chủ

app.get("/", async (req, res) => {
  const featuredCourses = await Courses.find().limit(3);
  res.render("pages/index", {
    title: "Trang chủ - IT Courses",
    featuredCourses,
    user: req.session.user || null,
  });
});

app.get("/contact", (req, res) => {
  res.render("pages/contact", {
    title: "Liên hệ",
    user: req.session.user || null,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
