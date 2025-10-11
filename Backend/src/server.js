const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const dotenv = require("dotenv");
const courseRoutes = require("./routes/courseRoutes");
dotenv.config();
const app = express();

// Kết nối DB
connectDB();


// View engine
app.set("views", path.join(process.cwd(), "src/views"));
app.set("view engine", "pug");

// ⚙️ Cho phép truy cập file tĩnh (CSS, JS, img)
app.use(express.static(path.join(__dirname, "public")));

app.use("/courses", courseRoutes);


app.get("/", (req, res) => {
  res.render("pages/index", { title: "Trang chủ - IT Courses" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
