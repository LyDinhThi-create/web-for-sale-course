const Course = require("../models/Course");
const Blog = require("../models/Blog");
const User = require("../models/User");

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

    const courses = await Course.find({ status: "active" })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit); // <--- ÁP DỤNG SORT // 5. Trả về 'currentSort' để Pug biết option nào đang được chọn
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
// phần tìm kiếm
module.exports.searchCourse = async (req, res) => {
  try {
    // 1. Lấy TỪ KHÓA TÌM KIẾM (string) ra
    const searchTerm = req.query.q || "";

    // 2. Tạo một ĐỐI TƯỢNG TRUY VẤN (object) rỗng
    const mongoQuery = { status: "active" };

    // 3. Nếu có từ khóa, thêm điều kiện $or vào ĐỐI TƯỢNG TRUY VẤN
    if (searchTerm) {
      mongoQuery.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { fullDescription: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // 4. Sử dụng ĐỐI TƯỢNG TRUY VẤN để tìm kiếm song song
    // Dùng Promise.all để chạy cả 2 truy vấn cùng lúc, nhanh hơn
    const [courses, blogs] = await Promise.all([
      Course.find(mongoQuery), // Dùng chung một đối tượng truy vấn
      Blog.find(mongoQuery), // Dùng chung một đối tượng truy vấn
    ]);

    // 5. Render kết quả
    res.render("pages/searchCourse", {
      title: `Kết quả tìm kiếm cho "${searchTerm}"`,
      courses,
      blogs,
      searchTerm, // Trả searchTerm về view để hiển thị lại
    });
  } catch (err) {
    console.error("Lỗi tìm kiếm:", err);
    // 500 (Lỗi máy chủ) phù hợp hơn 404 (Không tìm thấy) khi có lỗi
    res.status(500).send("Lỗi máy chủ khi thực hiện tìm kiếm");
  }
};
//[POST] them vao gio hang
module.exports.addCart = async (req, res) => {
  try {
    if (req.session.user == null) {
      return res.redirect("/login-register");
    }
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    const user = await User.findOne({ email: req.session.user.email });
    if (!user) {
      return res.status(404).send("User not found");
    } else if (!course) {
      return res.status(404).send("Course not found");
    } else if (user.cart.includes(course._id)) {
      req.flash("errorMsg", "Khoa học đã có trong giỏ hàng!");
      return res.redirect("/courses/" + courseId);
    } else {
      user.cart.push(course);
      await user.save();
      req.session.user = user;
      req.session.save();
      req.flash("successMsg", "Thêm vào giỏ hàng thành công!");
      return res.redirect("/courses/" + courseId);
    }
  } catch (err) {
    console.error("Lỗi thêm vào giỏ hàng:", err);
    res.status(500).send("Lỗi thêm vào giỏ hàng");
  }
};
// khóa học hàng đầu
module.exports.getTopCourses = async (req, res) => {
  const courses = await Course.find();
  res.render("pages/topcourse", { title: "Các khóa học hàng đầu", courses });
};
// learn page
module.exports.getLearningPage = async (req, res) => {
  try {
    const courses = await Course.findById(req.params.id);
    res.render("pages/learning", { title: "Trang học tập", courses });
  } catch (err) {
    console.error("Lỗi tải trang học tập:", err);
    res.status(500).send("Lỗi tải trang học tập");
  }
};