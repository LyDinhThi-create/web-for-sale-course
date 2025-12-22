const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// API tạo thanh toán
router.post('/create-url', paymentController.createPayment);

// Route xử lý kết quả trả về (User redirect)
router.get('/callback', paymentController.callback);

// Route xử lý IPN (MoMo gọi ngầm)
router.post('/notify', paymentController.notify);

//VNPAY
router.post('/create-url-vnpay', paymentController.createPaymentVNPAY);
router.get('/callback-vnpay', paymentController.callbackVNPAY);
router.post('/notify-vnpay', paymentController.notifyVNPAY);

module.exports = router;