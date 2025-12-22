const axios = require("axios");
const crypto = require("crypto");
const moment = require("moment");
const querystring = require("qs");
const User = require("../models/User");
const Cart = require("../models/cart");
const Course = require("../models/Course");

const currentHost = "https://edemy-lxer.onrender.com";
const tmnCode = "QN93A2JM"; // <--- Thay mã TmnCode của bạn vào đây
const secretKey = "C47ZHCLNAZVGYV0VDDJ76N8WED3YN3OO"; // <--- Thay HashSecret của bạn vào đây
const vnpUrl = " https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const returnUrl = `${currentHost}/payment/callback`;
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
//VNPAY

exports.createPaymentVNPAY = async (req, res) => {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh"; // Cài múi giờ để VNPAY không lỗi giờ
    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");

    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const { amount, orderInfo } = req.body;

    // Tạo mã đơn hàng ngẫu nhiên
    const orderId = moment(date).format("DDHHmmss");

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo || "Thanh toan khoa hoc";
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100; // VNPAY bắt buộc nhân 100
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    // --- TẠO URL VÀ CHỮ KÝ ---
    // VNPAY yêu cầu sắp xếp tham số theo alphabet trước khi ký
    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac
      .update(new Buffer.from(signData, "utf-8"))
      .digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    const paymentUrl =
      vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false });

    // Trả về link thanh toán cho Frontend
    res.status(200).json({ payUrl: paymentUrl });
  } catch (error) {
    console.error("VNPAY Error:", error);
    res.status(500).json({ message: "Lỗi tạo thanh toán VNPAY" });
  }
};

// Xử lý khi người dùng thanh toán xong và quay lại web (Redirect)
exports.callbackVNPAY = async (req, res) => {
  console.log("VNPAY Callback Params:", req.query);

  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    // Xóa 2 tham số này để kiểm tra lại chữ ký
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac
      .update(new Buffer.from(signData, "utf-8"))
      .digest("hex");

    // Kiểm tra chữ ký bảo mật
    if (secureHash === signed) {
      // Kiểm tra mã lỗi: 00 là thành công
      if (vnp_Params["vnp_ResponseCode"] === "00") {
        // --- LOGIC CẬP NHẬT DB CỦA BẠN (GIỮ NGUYÊN) ---
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({ _id: cartId });

        const courses = [];
        if (cart && cart.course.length > 0) {
          for (const item of cart.course) {
            const course = await Course.findOne({ _id: item.courseId }).select(
              "title price image"
            );
            if (course) courses.push(course);
          }
        }

        const user = await User.findById(req.session.user._id);
        if (user) {
          for (const course of courses) {
            if (!user.purchasedCourses.includes(course._id)) {
              user.purchasedCourses.push(course._id);
              user.enrolledCourses.push(course._id);

              const course_study = await Course.findById(course._id);
              if (course_study && !course_study.students.includes(user._id)) {
                course_study.students.push(user._id);
                await course_study.save();
              }
            }
          }

          await user.save();
          req.session.user = user;
          await req.session.save();
        }

        if (cartId) {
          await Cart.updateOne({ _id: cartId }, { $set: { course: [] } });
        }

        // Render trang thành công
        return res.render("pages/payment-success", {
          message: "Thanh toán thành công!",
        });
      } else {
        // Giao dịch thất bại (Khách hủy hoặc lỗi thẻ)
        return res.render("pages/payment-failed", {
          message: "Giao dịch không thành công!",
        });
      }
    } else {
      // Sai chữ ký (Có dấu hiệu giả mạo)
      return res.render("pages/payment-failed", {
        message: "Chữ ký không hợp lệ!",
      });
    }
  } catch (error) {
    console.error("Callback Error:", error);
    res.render("pages/payment-failed", { message: "Lỗi hệ thống!" });
  }
};

// Hàm sắp xếp tham số (Bắt buộc với VNPAY)
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

// IPN (Tùy chọn, dùng để cập nhật ngầm nếu user tắt trình duyệt)
exports.notifyVNPAY = async (req, res) => {
  // Logic tương tự callback nhưng trả về JSON {RspCode: '00', Message: 'Success'}
  // Nếu bạn chỉ cần demo đồ án thì tập trung vào hàm callback là đủ.
  res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
};
