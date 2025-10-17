const Course = require("../models/Course");

module.exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("pages/courses", { title: "Khoa học", courses });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render("pages/courseDetail", { title: course.title, course });
  } catch (err) {
    res.status(404).send("Course not found");
  }
};
