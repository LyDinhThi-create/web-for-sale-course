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
const Blog = require("./models/Blog");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const MongoDBStore = require("connect-mongodb-session")(session);
const requireLogin = require("./middlewares/requireLogin");
const flash = require("connect-flash");
dotenv.config();
const app = express();
// Thiết lập session middleware
const adminSession = session({
  name: "admin-session",
  secret: process.env.SECRET_KEY_ADMIN,
  resave: false,
  saveUninitialized: false,
  store: new MongoDBStore({
    url: process.env.MONGODB_URI,
    collection: "adminSessions",
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 2, httpOnly: true },
});

const userSession = session({
  name: "user-session",
  secret: process.env.SECRET_KEY_USER,
  resave: false,
  saveUninitialized: false,
  store: new MongoDBStore({
    url: process.env.MONGODB_URI,
    collection: "userSessions",
  }),
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

// Routes
app.use(
  "/courses",
  userSession,
  // apply flash() after session so req.flash is available
  flash(),
  (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.successMsg = req.flash("successMsg")[0] || null;
    res.locals.errorMsg = req.flash("errorMsg")[0] || null;
    next();
  },
  courseRoutes
);
app.use(
  "/admin",
  adminSession,
  // apply flash() after admin session
  flash(),
  (req, res, next) => {
    res.locals.admin = req.session.admin || null;
    res.locals.errorMsg = req.flash("errorMsg")[0] || null;
    next();
  },
  adminRoutes
);
app.use(
  "/blog",
  userSession,
  (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  },
  blogRoutes
);
app.use(
  "/",
  userSession,
  // apply flash() after session for root/auth routes
  flash(),
  (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.successMsg = req.flash("successMsg")[0] || null;
    res.locals.errorMsg = req.flash("errorMsg")[0] || null;
    next();
  },
  authRoutes
);

// Trang chủ

app.get("/", async (req, res) => {
  const featuredCourses = await Courses.find().limit(3);
  const featuredBlogs = await Blog.find().limit(3);

  res.render("pages/index", {
    title: "Trang chủ - IT Courses",
    featuredCourses,
    featuredBlogs,
    user: req.session.user || null,
  });
});

app.get("/contact", (req, res) => {
  res.render("pages/contact", { title: "Liên hệ" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
