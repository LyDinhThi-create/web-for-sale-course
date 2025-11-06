const express = require("express");
const adminController = require("../controllers/adminController");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

// Bảo vệ route admin
router.get("/dashboard", adminController.getDashboard);
router.get("/blog", adminController.getBlogDashboard);

// Route để tạo khóa học mới
router.post(
  "/courses",
  upload.single("imageFile"),
  adminController.createCourse
);
// Route để cập nhật và xóa khóa học
router.put(
  "/courses/:id",
  upload.single("imageFile"),
  adminController.updateCourse
);
router.delete("/courses/:id", adminController.deleteCourse);

// Route thêm blog mới
router.post("/blogs", upload.single("imageFile"), adminController.createBlog);

// Route để cập nhật và xóa blog
router.put(
  "/blogs/:id",
  upload.single("imageFile"),
  adminController.updateBlog
);
router.delete("/blogs/:id", adminController.deleteBlog);

module.exports = router;
