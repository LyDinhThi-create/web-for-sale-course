const express = require("express");
const { getDashboard } = require("../controllers/adminController.js");
const adminController = require("../controllers/adminController");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

// Bảo vệ route admin
router.get("/dashboard", getDashboard);

// Route để tạo khóa học mới
router.post("/courses", upload.single("imageFile"), adminController.createCourse);
// Route để cập nhật và xóa khóa học
router.put(
  "/courses/:id",
  upload.single("imageFile"),
  adminController.updateCourse
);
router.delete("/courses/:id", adminController.deleteCourse);

module.exports = router;
