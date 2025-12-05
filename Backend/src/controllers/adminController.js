const Course = require("../models/Course.js");
const Blog = require("../models/Blog.js");
const cloudinary = require("../config/cloudinary.js");
const stream = require("stream");
const Admin = require("../models/Admin.js");
const User = require("../models/User.js");
// Hàm helper uploadStream (Giữ nguyên)
const uploadStream = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);
    bufferStream.pipe(upload);
  });
};
// Thay thế hàm parse cũ bằng hàm này trong cả hai controller:
const safeParseJSON = (data) => {
  // 1. Nếu đã là object hoặc array, trả về luôn (không cần parse)
  if (typeof data === "object" && data !== null) return data;

  // 2. Nếu là chuỗi rỗng, không parse để tránh lỗi SyntaxError
  if (typeof data === "string" && data.trim() === "") return undefined;

  // 3. Nếu là chuỗi, thử parse
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      // Log lỗi parse nhưng trả về undefined/data gốc để DB tự xử lý
      console.error("LỖI CÚ PHÁP JSON:", e.message, "Dữ liệu:", data);
      return undefined;
    }
  }
  return data;
};

// getDashboard (Giữ nguyên)
module.exports.getCourseAdmin = async (req, res) => {
  try {
    const [courseCount] = await Promise.all([Course.countDocuments()]);
    const courses = await Course.find();
    res.render("admin/course_admin", {
      title: "Bảng điều khiển - Admin",
      courseCount,
      courses,
    });
  } catch (err) {
    res.status(500).send("Lỗi khi tải trang admin");
  }
};
// trang blog
module.exports.getBlogAdmin = async (req, res) => {
  try {
    const [blogCount] = await Promise.all([Blog.countDocuments()]);
    const blogs = await Blog.find();
    res.render("admin/blog_admin", {
      title: "Bảng Blog - Admin",
      blogCount,
      blogs,
    });
  } catch (err) {
    res.status(500).send("Lỗi khi tải trang admin");
  }
};

// [POST] /admin/courses (ĐÃ SỬA)
module.exports.createCourse = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.instructor) body.instructor = safeParseJSON(body.instructor);
    if (body.curriculum) body.curriculum = safeParseJSON(body.curriculum);
    if (body.fullDescription)
      body.fullDescription = safeParseJSON(body.fullDescription);

    if (req.file) {
      const uploadResult = await uploadStream(req.file.buffer, "courses");
      body.image = uploadResult.secure_url;
    } // SỬA Ở ĐÂY: Dùng 'body' thay vì 'req.body'
    // Bỏ qua các trường có giá trị là undefined nếu Schema không yêu cầu
    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );
    const newCourse = await Course.create(body);

    res.status(201).json(newCourse);
  } catch (err) {
    console.error("LỖI KHI TẠO KHÓA HỌC:", err); // Thêm log này để debug
    res.status(500).send("Lỗi khi tạo khóa học mới");
  }
};

// [PUT] /admin/courses/:id (ĐÃ SỬA)
module.exports.updateCourse = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.instructor) body.instructor = safeParseJSON(body.instructor);
    if (body.curriculum) body.curriculum = safeParseJSON(body.curriculum);
    if (body.fullDescription)
      body.fullDescription = safeParseJSON(body.fullDescription);

    if (req.file) {
      const uploadResult = await uploadStream(req.file.buffer, "courses");
      body.image = uploadResult.secure_url;
    } // SỬA Ở ĐÂY: Dùng 'body' thay vì 'req.body'
    // Bỏ qua các trường có giá trị là undefined nếu Schema không yêu cầu
    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse)
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("LỖI KHI CẬP NHẬT KHÓA HỌC:", error); // Thêm log này
    res.status(500).json({ message: "Không thể cập nhật khóa học", error });
  }
};

// [DELETE] /admin/courses/:id (Giữ nguyên)
module.exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    res.status(200).json({ message: "Xóa khóa học thành công" });
  } catch (error) {
    res.status(500).json({ message: "Không thể xóa khóa học", error });
  }
};

// [POST] /admin/blog
module.exports.createBlog = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.instructor) body.instructor = JSON.parse(body.instructor);
    if (body.fullDescription)
      body.fullDescription = JSON.parse(body.fullDescription);

    if (req.file) {
      const uploadResult = await uploadStream(req.file.buffer, "blogs");
      body.image = uploadResult.secure_url;
    } // SỬA Ở ĐÂY: Dùng 'body' thay vì 'req.body'

    const newBlog = await Blog.create(body);

    res.status(201).json(newBlog);
  } catch (err) {
    console.error("LỖI KHI TẠO Blog:", err); // Thêm log này để debug
    res.status(500).send("Lỗi khi tạo Blog mới");
  }
};

// [PUT] /admin/courses/:id (ĐÃ SỬA)
module.exports.updateBlog = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.instructor) body.instructor = JSON.parse(body.instructor);
    if (body.fullDescription)
      body.fullDescription = JSON.parse(body.fullDescription);

    if (req.file) {
      const uploadResult = await uploadStream(req.file.buffer, "blogs");
      body.image = uploadResult.secure_url;
    } // SỬA Ở ĐÂY: Dùng 'body' thay vì 'req.body'

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog)
      return res.status(404).json({ message: "Không tìm thấy blog" });
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("LỖI KHI CẬP NHẬT BLOG:", error); // Thêm log này
    res.status(500).json({ message: "Không thể cập nhật blog", error });
  }
};

// [DELETE] /admin/courses/:id (Giữ nguyên)
module.exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Không tìm thấy blog" });
    res.status(200).json({ message: "Xóa blog thành công" });
  } catch (error) {
    res.status(500).json({ message: "Không thể xóa blog", error });
  }
};
// [GET] /admin/login
module.exports.getLogin = async (req, res) => {
  try {
    res.render("admin/loginAdmin", { title: "Đăng nhập - Admin" });
  } catch (err) {
    res.status(500).send("Lỗi khi tải trang đăng nhập admin");
  }
};
// [POST] /admin/login
module.exports.loginAdmin = async (req, res) => {
  try {
    const { loginname, password } = req.body;
    const admin = await Admin.findOne({ loginname });
    if (!admin) {
      req.flash("errorMsg", "Tên đăng nhập không tồn tại. Vui lòng thử lại.");
      return res.redirect("/admin/login");
    }
    const match = await Admin.findOne({ loginname, password });
    if (!match) {
      req.flash("errorMsg", "Mật khẩu không đúng. Vui lòng thử lại.");
      return res.redirect("/admin/login");
    }
    req.session.admin = {
      _id: admin._id,
      loginname: admin.loginname,
      avatar: admin.avatar,
    };
    admin.statusLogin = true;
    await admin.save();
    res.redirect("/admin/course");
  } catch (err) {
    res.status(500).send("Lỗi khi đăng nhập admin");
  }
};
// [POST] /admin/logout
module.exports.logoutAdmin = async (req, res) => {
  try {
    const adminLoginname = req.session.admin.loginname;
    const admin = await Admin.findOne({ loginname: adminLoginname });
    if (admin) {
      admin.statusLogin = false;
      await admin.save();
    }
    req.session.destroy();
    res.redirect("/admin/login");
  } catch (err) {
    res.status(500).send("Lỗi khi đăng xuất admin");
  }
};
// [GET] /admin/dashboard
module.exports.getDashboard = async (req, res) => {
  try {
    // Chúng ta chạy song song các tác vụ thống kê
    const [statsData, topCoursesData, recentActivityData, totalStudents] =
      await Promise.all([
        // A. TÍNH DOANH THU & SỐ LƯỢNG BÁN
        // Logic: Lấy tất cả user -> Tách mảng purchasedCourses -> Join sang Course lấy giá -> Cộng lại
        User.aggregate([
          { $match: { role: "user" } }, // Chỉ lấy user thường
          { $unwind: "$purchasedCourses" }, // Tách mảng ID ra từng dòng
          {
            $lookup: {
              from: "courses", // Tên collection trong MongoDB (thường là số nhiều)
              localField: "purchasedCourses", // ID trong bảng User
              foreignField: "_id", // ID trong bảng Course
              as: "courseDetails",
            },
          },
          { $unwind: "$courseDetails" }, // Tách mảng kết quả lookup
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$courseDetails.price" }, // Cộng giá tiền từ bảng Course
              totalSold: { $sum: 1 }, // Đếm số lượng khóa học đã bán
            },
          },
        ]),

        // B. TOP KHÓA HỌC BÁN CHẠY
        User.aggregate([
          { $unwind: "$purchasedCourses" },
          {
            $group: {
              _id: "$purchasedCourses", // Group theo ID khóa học
              sold: { $sum: 1 },
            },
          },
          { $sort: { sold: -1 } }, // Sắp xếp giảm dần
          { $limit: 5 },
          {
            $lookup: {
              from: "courses",
              localField: "_id",
              foreignField: "_id",
              as: "courseInfo",
            },
          },
          { $unwind: "$courseInfo" },
          {
            $project: {
              title: "$courseInfo.title",
              price: "$courseInfo.price",
              image: "$courseInfo.image", // Nếu cần hiển thị ảnh
              sold: 1,
              revenue: { $multiply: ["$sold", "$courseInfo.price"] }, // Doanh thu ước tính
            },
          },
        ]),

        // C. HOẠT ĐỘNG GẦN ĐÂY
        // Vì mảng purchasedCourses chỉ chứa ID (không có ngày mua),
        // ta tạm thời lấy danh sách User mới cập nhật (có thể là mới mua hàng)
        User.find({
          role: "user",
          purchasedCourses: { $exists: true, $not: { $size: 0 } },
        })
          .sort({ updatedAt: -1 }) // Sắp xếp theo ngày cập nhật gần nhất
          .limit(5)
          .populate("purchasedCourses", "title price"), // Populate để lấy tên khóa học

        // D. Tổng số học viên
        User.countDocuments({ role: "user" }),
      ]);

    // Xử lý dữ liệu stats (đề phòng mảng rỗng)
    const stats = {
      revenue: statsData.length > 0 ? statsData[0].totalRevenue : 0,
      sold: statsData.length > 0 ? statsData[0].totalSold : 0,
      students: totalStudents,
      completionRate: 0, // Cần logic khác để tính cái này
    };

    // Chuẩn bị dữ liệu biểu đồ (Chart Data)
    // Lưu ý: Do cấu trúc dữ liệu không lưu "ngày mua" trong purchasedCourses,
    // ta không thể vẽ biểu đồ doanh thu theo ngày chính xác 100%.
    // Dưới đây là ví dụ giả lập hoặc bạn cần thay đổi schema để lưu ngày mua.
    // Tạm thời để trống hoặc fake data để không lỗi giao diện
    const chartLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const chartValues = [0, 0, 0, 0, 0, 0, 0];

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      stats,
      topCourses: topCoursesData,
      activities: recentActivityData,
      chartData: {
        labels: JSON.stringify(chartLabels),
        data: JSON.stringify(chartValues),
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).send("Lỗi Server: " + error.message);
  }
};

// [GET] /admin/users
module.exports.getUsers = async (req, res) => {
  try {
    // 1. Bộ lọc tìm kiếm & Trạng thái
    let find = {
      deleted: false,
    };

    if (req.query.status) {
      find.status = req.query.status;
    }

    if (req.query.keyword) {
      const regex = new RegExp(req.query.keyword, "i");
      find.fullName = regex;
    }

    // 2. Phân trang
    const pagination = {
      currentPage: 1,
      limitItems: 10,
    };

    if (req.query.page) {
      pagination.currentPage = parseInt(req.query.page);
    }

    pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;

    // Đếm tổng số lượng để tính số trang
    const countUsers = await User.countDocuments(find);
    const totalPage = Math.ceil(countUsers / pagination.limitItems);

    // 3. Lấy dữ liệu
    const users = await User.find(find)
      .limit(pagination.limitItems)
      .skip(pagination.skip)
      .sort({ createdAt: -1 }); // Người mới nhất lên đầu

    res.render("admin/user_admin", {
      Title: "Quản lý học viên",
      users: users,
      pagination: {
        ...pagination,
        totalPage: totalPage,
      },
      keyword: req.query.keyword || "",
      status: req.query.status || "",
    });
  } catch (error) {
    console.log(error);
    res.redirect("/admin/dashboard");
  }
};

// [PUT] /admin/users/:id/status
module.exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );    
    res.status(200).json({ message: "Cập nhật trạng thái thành công", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái người dùng" });
  }
};
// [Delete] /admin/users/:id
module.exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    res.status(200).json({ message: "Xóa người dùng thanh cong", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi khi xóa người dùng" });
  }
};