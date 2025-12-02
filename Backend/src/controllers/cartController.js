const { request } = require("express");
const Cart = require("../models/cart.js");
const Course = require("../models/Course.js");
const User = require("../models/User.js");
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

module.exports.checkoutCart = async (req, res) => {
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
    const user = await User.findById(req.session.user._id);
    for (const course of courses) {
      if (!user.purchasedCourses.includes(course._id)) {
        user.purchasedCourses.push(course._id);
        user.enrolledCourses.push(course._id);

      const course_study = await Course.findById(course._id);
      if (!course_study.students.includes(user._id)) { 
        course_study.students.push(user._id);
        }
      await course_study.save();
      }
    }
    
    await user.save();
    req.session.user = user;  
    await req.session.save();
    await Cart.updateOne({ _id: cartId }, { $set: { course: [] } });
    return res.json({
      code: 200,
      message: "Thanh toán thành công!",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      code: 500,
      message: "Lỗi Server",
    });
  }
};
