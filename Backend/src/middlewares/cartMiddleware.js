const Cart = require("../models/cart.js");

module.exports.cartId = async (req, res, next) => {
  // Kiểm tra xem trong Cookie đã có cartId chưa
  if (!req.cookies.cartId) {
    // 1. Nếu chưa có -> Tạo giỏ hàng mới trong Database
    const cart = new Cart();
    await cart.save();

    // 2. Lấy ID của giỏ hàng vừa tạo
    const expiresTime = 1000 * 60 * 60 * 24 * 365; // Hết hạn sau 1 năm

    // 3. Lưu ID đó vào Cookie trình duyệt của khách
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresTime),
    });

    console.log("Đã tạo giỏ hàng mới:", cart.id);
  } else {
    // Nếu có rồi thì thôi, đi tiếp
    // console.log("Khách cũ, đã có cartId:", req.cookies.cartId);
    const count = await Cart.findOne({ _id: req.cookies.cartId });
    res.locals.countCart = count.course.length;
  }

  next(); // Quan trọng: Cho phép chạy tiếp sang các controller khác
};
