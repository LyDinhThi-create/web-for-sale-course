const express = require("express");
const adminController = require("../controllers/adminController");
const upload = require("../middlewares/uploadMiddleware");
const requireLoginAdmin = require("../middlewares/requireLoginAdmin");
const router = express.Router();

// Bảo vệ route admin
router.get("/course", requireLoginAdmin, adminController.getCourseAdmin);
router.get("/blog", requireLoginAdmin, adminController.getBlogAdmin);
router.get(
  "/login",
  (req, res, next) => {
    if (req.session.admin) {
      return res.redirect("/admin/course");
    }
    next();
  },
  adminController.getLogin
);

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
// router post login admin
router.post("/login", adminController.loginAdmin);
// router post logout admin
router.post("/logout", adminController.logoutAdmin);
module.exports = router;
