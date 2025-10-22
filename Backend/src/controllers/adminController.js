const Course = require("../models/Course.js");
const cloudinary = require("../config/cloudinary.js");
const stream = require("stream");

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
