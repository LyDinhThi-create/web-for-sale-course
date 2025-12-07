const axios = require("axios");
const crypto = require("crypto");
const User = require("../models/User");
const Cart = require("../models/cart");
const Course = require("../models/Course");

const currentHost = "https://edemy-lxer.onrender.com";
const config = {
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  partnerCode: "MOMO",
  redirectUrl: `${currentHost}/payment/callback`,
  ipnUrl: `${currentHost}/payment/notify`,
  requestType: "payWithATM",
  extraData: "",
  orderGroupId: "",
  autoCapture: true,
  lang: "vi",
};

exports.createPayment = async (req, res) => {
  try {
    const { amount, orderInfo } = req.body; // Lấy số tiền và thông tin từ Client

    // Tạo mã đơn hàng ngẫu nhiên (hoặc lấy từ DB của bạn)
    const orderId = config.partnerCode + new Date().getTime();
    const requestId = orderId;

    // --- TẠO CHỮ KÝ (SIGNATURE) ---
    // Thứ tự tham số trong rawSignature PHẢI CHUẨN theo tài liệu MoMo
    const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=${config.extraData}&ipnUrl=${config.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${config.partnerCode}&redirectUrl=${config.redirectUrl}&requestId=${requestId}&requestType=${config.requestType}`;

    // Mã hóa HMAC SHA256
    const signature = crypto
      .createHmac("sha256", config.secretKey)
      .update(rawSignature)
      .digest("hex");

    // Tạo request body
    const requestBody = {
      partnerCode: config.partnerCode,
      partnerName: "Test Portfolio",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: config.redirectUrl,
      ipnUrl: config.ipnUrl,
      lang: config.lang,
      requestType: config.requestType,
      autoCapture: config.autoCapture,
      extraData: config.extraData,
      orderGroupId: config.orderGroupId,
      signature: signature,
    };

    // Gửi request sang MoMo
    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create", // Link Sandbox
      requestBody
    );

    // Trả về link thanh toán cho Client
    res.status(200).json(response.data);
  } catch (error) {
    console.error("MoMo Payment Error:", error);
    res.status(500).json({ message: "Lỗi tạo thanh toán MoMo" });
  }
};

// Xử lý khi người dùng thanh toán xong và quay lại web (Redirect)
exports.callback = async (req, res) => {
  console.log("Callback Params:", req.query);

  // Kiểm tra resultCode (0 là thành công)
  if (req.query.resultCode == "0") {
    // Render trang thành công
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
    res.render("pages/payment-success", { message: "Thanh toán thành công!" });
  } else {
    // Render trang thất bại
    res.render("pages/payment-failed", { message: "Thanh toán thất bại!" });
  }
};

// Xử lý thông báo từ MoMo (IPN - Instant Payment Notification)
// MoMo sẽ gọi ngầm vào API này để báo trạng thái cập nhật DB
exports.notify = async (req, res) => {
  console.log("IPN Body:", req.body);

  // Bạn cần kiểm tra lại chữ ký (signature) tại đây để bảo mật (tương tự lúc tạo)
  // Nếu hợp lệ và resultCode == 0 thì cập nhật trạng thái đơn hàng trong Database

  /* Ví dụ:
  if (req.body.resultCode == 0) {
     await Order.findOneAndUpdate({ orderId: req.body.orderId }, { status: 'paid' });
  }
  */

  res.status(204).json({}); // Trả về 204 No Content để MoMo biết đã nhận
};
