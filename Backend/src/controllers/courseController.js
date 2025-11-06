const Course = require("../models/Course");

module.exports.getAllCourses = async (req, res) => {
  try {
    // 1. Lấy tham số 'sort' từ URL, mặc định là 'mới nhất'
    const currentSort = req.query.sort || "createdAt:desc";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; // Mặc định 6 khóa học/trang
    const skip = (page - 1) * limit; // Tính số document cần bỏ qua

    // 2. Tách chuỗi (ví dụ: "price:asc" -> [sortBy='price', order='asc'])
    const [sortBy, order] = currentSort.split(":");

    // 3. Tạo đối tượng sort cho Mongoose
    const sortOptions = {};
    if (sortBy && order) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Mặc định dự phòng
    } // 4. Thêm .sort() vào câu lệnh find()

    const courses = await Course.find({ status: "active" }).sort(sortOptions).skip(skip).limit(limit); // <--- ÁP DỤNG SORT // 5. Trả về 'currentSort' để Pug biết option nào đang được chọn
    const totalCourses = await Course.countDocuments({ status: "active" });
    // Tính tổng số trang
    const totalPages = Math.ceil(totalCourses / limit);

    res.render("pages/courses", {
      title: "Khoa học",
      courses,
      currentSort: currentSort, // <--- TRẢ VỀ PUG
      currentPage: page,
      totalPages,
      limit: limit,
    });
  } catch (err) {
    console.error("Lỗi tải trang khóa học:", err); // Thêm log lỗi
    res.status(500).send("Server Error");
  }
};

// Hàm này giữ nguyên, nhưng mình thêm 1 check nhỏ cho an toàn hơn
module.exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    // Thêm check này để đảm bảo course tồn tại
    if (!course || course.status !== "active") {
      return res.status(404).send("Course not found");
    }

    res.render("pages/courseDetail", { title: course.title, course });
  } catch (err) {
    console.error("Lỗi tìm khóa học theo ID:", err);
    res.status(404).send("Course not found");
  }
};
