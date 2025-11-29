const express = require("express");
const {
  getAllCourses,
  getCourseById,
  searchCourse,
  addCart,
  getTopCourses,
} = require("../controllers/courseController");

const router = express.Router();

router.post("/:id/addCart", addCart);
router.get("/", getAllCourses);
router.get("/search", searchCourse);
router.get("/top-courses", getTopCourses);
router.get("/:id", getCourseById);

module.exports = router;
