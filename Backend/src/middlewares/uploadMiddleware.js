const multer = require("multer");

const storage = multer.memoryStorage(); // không lưu file vào ổ cứng
const upload = multer({ storage });

module.exports = upload;
