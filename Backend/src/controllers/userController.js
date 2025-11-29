const Order = require("../models/Order");
const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcryptjs");

module.exports.getMyPurchases = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const orders = await Order.find({ userId }).populate("courseId");
    const courses = await Course.find();
    res.render("pages/myPurchases", { orders, courses });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
module.exports.getWishList = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const courses = await Course.find({
      _id: { $in: user.wishlist },
    });
    res.render("pages/wishList", { courses });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
module.exports.toggleWishlist = async (req, res) => {
  try {
    // 1. Lấy ID người dùng (từ session hoặc token đăng nhập)
    const userId = req.session.user._id;
    const courseId = req.params.courseId;

    const user = await User.findById(userId);

    // 2. Kiểm tra xem khóa học đã có trong wishlist chưa
    const isExist = user.wishlist.includes(courseId);

    if (isExist) {
      // CÓ RỒI -> XÓA ĐI ($pull)
      await User.findByIdAndUpdate(userId, {
        $pull: { wishlist: courseId },
      });
      return res.json({
        code: 200,
        message: "Đã xóa khỏi yêu thích",
        action: "remove",
      });
    } else {
      // CHƯA CÓ -> THÊM VÀO ($addToSet để tránh trùng lặp)
      await User.findByIdAndUpdate(userId, {
        $addToSet: { wishlist: courseId },
      });
      return res.json({
        code: 200,
        message: "Đã thêm vào yêu thích",
        action: "add",
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({ code: 500, message: "Lỗi server" });
  }
};

module.exports.getAccountSettings = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    res.render("pages/accountsetting", {
      title: "Account settings",
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
// Update user profile
module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const body = { ...req.body };
    const updateProfile = await User.findByIdAndUpdate(userId, body, {
      new: true,
      runValidators: true,
    });
    req.session.user = updateProfile;
    if (!updateProfile) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(updateProfile);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
// Update user password
module.exports.updatePassword = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { password, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({
        code: 400,
        message: "Mật khẩu hiện tại không đúng. Vui lòng thử lại.",
      });
    }
    user.password = newPassword;
    await user.save();
    return res.json({
      code: 200,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    console.error(error);
    return res.json({
      code: 500,
      message: "Lỗi Server: " + error.message,
    });
  }
};
