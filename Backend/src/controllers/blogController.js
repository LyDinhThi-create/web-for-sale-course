const Blog = require("../models/Blog");

module.exports.getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "active" });
    res.render("pages/blog", { title: "Blog", blogs });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render("pages/blog/:id", { title: "Blog Detail", blog });
  } catch (err) {
    res.status(404).send("Blog not found");
  }
};

