const express = require("express");
const { getDashboard } = require("../controllers/adminController.js");
const adminController = require("../controllers/adminController");
const router = express.Router();
console.log(adminController);
// Bảo vệ route admin
router.get("/dashboard", getDashboard);

// Route để tạo khóa học mới
router.post("/courses", adminController.createCourse);
// Route để cập nhật và xóa khóa học
router.put("/courses/:id", adminController.updateCourse);
router.delete("/courses/:id", adminController.deleteCourse);

module.exports = router;
