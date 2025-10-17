const Course = require("../models/Course.js");
// @route   GET /admin/dashboard
module.exports.getDashboard = async (req, res) => {
  try {
    const [courseCount] = await Promise.all([Course.countDocuments()]);
    const courses = await Course.find();
    res.render("admin/dashboard", {
      title: "Bảng điều khiển - Admin",
      courseCount,
      courses,
    });
  } catch (err) {
    res.status(500).send("Lỗi khi tải trang admin");
  }
};
// [POST] /admin/courses - Tạo khóa học mới
module.exports.createCourse = async (req, res) => {
  try {
    if (
      req.body.fullDescription &&
      typeof req.body.fullDescription === "string"
    ) {
      req.body.fullDescription = req.body.fullDescription
        .split("\n")
        .filter((p) => p.trim() !== "");
    }
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
    // console.log(req.body);
  } catch (err) {
    res.status(500).send("Lỗi khi tạo khóa học mới");
  }
};
// [PUT] /admin/courses/:id - Cập nhật khóa học
module.exports.updateCourse = async (req, res) => {
  try {
    if (
      req.body.fullDescription &&
      typeof req.body.fullDescription === "string"
    ) {
      req.body.fullDescription = req.body.fullDescription
        .split("\n")
        .filter((p) => p.trim() !== "");
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCourse)
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Không thể cập nhật khóa học", error });
  }
};
// [DELETE] /admin/courses/:id - Xóa khóa học
module.exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    res.status(200).json({ message: 'Xóa khóa học thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Không thể xóa khóa học', error });
  }
};
