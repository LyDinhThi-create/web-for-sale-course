const Cart = require("../models/cart.js");
const Course = require("../models/Course.js");

module.exports.getAllCart = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
      _id: cartId,
    });
    const courses = [];
    if (cart.course.length > 0) {
      for (const item of cart.course) {
        const course = await Course.findOne({
          _id: item.courseId,
        }).select("title price image");

        courses.push(course);
      }
    }
    const totalPrice = courses.reduce((sum, course) => sum + course.price, 0);
    res.render("pages/cart", {
      pageTitle: "Giỏ hàng khóa học",
      courses: courses,
      totalPrice: totalPrice || 0,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/courses");
  }
};
module.exports.addCourseCart = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const courseId = req.params.courseId;
    const cart = await Cart.findOne({ _id: cartId });
    const existCourse = cart.course.find((item) => item.courseId == courseId);

    if (existCourse) {
      // Thay vì redirect, trả về JSON báo lỗi hoặc thông báo
      return res.json({
        code: 400,
        message: "Khóa học này đã có trong giỏ hàng!",
      });
    }

    const objectCart = {
      courseId: courseId,
    };

    await Cart.updateOne({ _id: cartId }, { $push: { course: objectCart } });
    const totalCourse = cart.course.length + 1;

    // Trả về JSON thành công
    return res.json({
      code: 200,
      message: "Đã thêm vào giỏ hàng thành công!",
      newCount: totalCourse,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      code: 500,
      message: "Lỗi Server",
    });
  }
};
module.exports.deleteCourseCart = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const courseId = req.params.courseId;
    const objectCart = {
      courseId: courseId,
    };

    await Cart.updateOne({ _id: cartId }, { $pull: { course: objectCart } });

    // Trả về JSON thành công
    return res.json({
      code: 200,
      message: "Đã xóa khỏi giỏ hàng thành công!",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      code: 500,
      message: "Lỗi Server",
    });
  }
};
