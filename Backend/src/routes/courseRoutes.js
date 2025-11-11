const express = require("express");
const {
  getAllCourses,
  getCourseById,
  searchCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/", getAllCourses);
router.get("/search", searchCourse);
router.get("/:id", getCourseById);

module.exports = router;
