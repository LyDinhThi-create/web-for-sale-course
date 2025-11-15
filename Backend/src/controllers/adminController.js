const Course = require("../models/Course.js");
const Blog = require("../models/Blog.js");
const cloudinary = require("../config/cloudinary.js");
const stream = require("stream");
const Admin = require("../models/Admin.js");
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
    if (body.instructor) body.instructor = JSON.parse(body.instructor);
    if (body.curriculum) body.curriculum = JSON.parse(body.curriculum);
    if (body.fullDescription)
      body.fullDescription = JSON.parse(body.fullDescription);

    if (req.file) {
      const uploadResult = await uploadStream(req.file.buffer, "courses");
      body.image = uploadResult.secure_url;
    } // SỬA Ở ĐÂY: Dùng 'body' thay vì 'req.body'

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
    if (body.instructor) body.instructor = JSON.parse(body.instructor);
    if (body.curriculum) body.curriculum = JSON.parse(body.curriculum);
    if (body.fullDescription)
      body.fullDescription = JSON.parse(body.fullDescription);

    if (req.file) {
      const uploadResult = await uploadStream(req.file.buffer, "courses");
      body.image = uploadResult.secure_url;
    } // SỬA Ở ĐÂY: Dùng 'body' thay vì 'req.body'

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
    res.redirect("/admin/dashboard");
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