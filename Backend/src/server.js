const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// View engine
app.set("views", path.join(process.cwd(), "src/views"));
app.set("view engine", "pug");

// ⚙️ Cho phép truy cập file tĩnh (CSS, JS, img)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("pages/index", { title: "Trang chủ - IT Courses" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
