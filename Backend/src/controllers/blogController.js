const Blog = require("../models/Blog");

module.exports.getAllBlog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; // Mặc định 6 khóa học/trang
    const skip = (page - 1) * limit; // Tính số document cần bỏ qua
    const blogs = await Blog.find({ status: "active" });
    const totalBlogs = await Blog.countDocuments({ status: "active" });
    // Tính tổng số trang
    const totalPages = Math.ceil(totalBlogs / limit);
    res.render("pages/blog", {
      title: "Blog",
      blogs: blogs,
      currentPage: page,
      totalPages,
      limit: limit,
    });
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
