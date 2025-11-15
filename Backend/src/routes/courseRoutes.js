const express = require("express");
const {
  getAllCourses,
  getCourseById,
  searchCourse,
  addCart,
} = require("../controllers/courseController");

const router = express.Router();

router.post("/:id/addCart",addCart)
router.get("/", getAllCourses);
router.get("/search", searchCourse);
router.get("/:id", getCourseById);

module.exports = router;
