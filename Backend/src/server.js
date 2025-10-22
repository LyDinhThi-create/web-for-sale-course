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
dotenv.config();
const app = express();

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

// Trang chủ

app.get("/", async (req, res) => {
  const featuredCourses = await Courses.find().limit(3);
  res.render("pages/index", {
    title: "Trang chủ - IT Courses",
    featuredCourses,
  });
});
app.get("/login-register", (req, res) => {
  res.render("pages/login-register", { title: "Đăng nhập / Đăng ký" });
});
app.get("/contact", (req, res) => {
  res.render("pages/contact", { title: "Liên hệ" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
