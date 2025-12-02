const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/my-learning", userController.getMyLearning);
router.get("/my-purchases", userController.getMyPurchases);
router.get("/wish-list", userController.getWishList);
// Method POST hoặc PATCH đều được
router.post("/toggle/:courseId", userController.toggleWishlist);
router.get("/account-setting", userController.getAccountSettings);
// Cập nhật thông tin cá nhân
router.post("/account-setting/update", userController.updateProfile);
// Cập nhật mật khẩu
router.post("/account-setting/update-password", userController.updatePassword);
module.exports = router;
