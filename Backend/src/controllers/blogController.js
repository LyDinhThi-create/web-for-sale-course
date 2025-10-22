const Course = require("../models/Course");

module.exports.getAllBlog = async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("pages/blog", { title: "Blog" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports.getBlogById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render("pages/blogDetail", { title: "Blog Detail" });
  } catch (err) {
    res.status(404).send("Course not found");
  }
};
