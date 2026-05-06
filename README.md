# 🎓 EDEMY - Nền tảng khóa học trực tuyến

Một ứng dụng web hiện đại để bán và quản lý khóa học trực tuyến, được xây dựng bằng Node.js, Express, MongoDB và Pug.

---

## 🚀 **LINK DEPLOY**

### **👉 https://edemy-lxer.onrender.com/**

---

## 📋 **THÔNG TIN ĐĂNG NHẬP**

### **👤 Tài khoản Người dùng**
```
Email: cuonguyenmanh18@gmail.com
Mật khẩu: 12345678
```

### **🔐 Tài khoản Admin**
```
`/admin/dashboard`
Tên đăng nhập: cuongit
Mật khẩu: 123456
```

---

## ✨ **Tính năng chính**

### **Cho người dùng:**
- 📚 Xem danh sách và tìm kiếm khóa học
- 🛒 Thêm khóa học vào giỏ hàng
- ❤️ Thêm khóa học yêu thích
- 💳 Thanh toán khóa học
- 🎬 Học các khóa học đã mua
- 👤 Quản lý hồ sơ cá nhân
- 📖 Đọc blog

### **Cho quản trị viên:**
- 📊 Dashboard quản lý
- 📚 Quản lý khóa học (thêm, sửa, xóa)
- 👥 Quản lý người dùng
- 📰 Quản lý blog
- 🛍️ Xem lịch sử mua hàng

---

## 🛠️ **Công nghệ sử dụng**

### **Backend:**
- Node.js
- Express.js
- MongoDB
- Bcrypt (mã hóa mật khẩu)
- Cloudinary (lưu trữ hình ảnh)

### **Frontend:**
- HTML5
- CSS3
- JavaScript
- Pug (Template Engine)

### **Thanh toán:**
- Stripe/VNPay (thanh toán trực tuyến)

---

## 📁 **Cấu trúc dự án**

```
web-for-sale-course/
├── Backend/
│   ├── src/
│   │   ├── config/          # Cấu hình (DB, Cloudinary)
│   │   ├── controllers/     # Logic xử lý
│   │   ├── middlewares/     # Middleware (auth, upload, etc)
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # Các route
│   │   ├── views/           # Pug templates
│   │   └── server.js        # Entry point
│   └── public/              # CSS, JS, images
└── Frontend/                # Các file HTML tĩnh
```

---

## 🚀 **Cách chạy dự án**

### **Yêu cầu:**
- Node.js (phiên bản 14+)
- MongoDB
- Cloudinary account
- Stripe/VNPay account

### **Hướng dẫn cài đặt:**

1. **Clone dự án:**
   ```bash
   git clone <repo-url>
   cd web-for-sale-course
   ```

2. **Cài đặt dependencies:**
   ```bash
   cd Backend
   npm install
   ```

3. **Tạo file .env:**
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Chạy server:**
   ```bash
   npm start
   ```

5. **Truy cập ứng dụng:**
   ```
   http://localhost:3000
   ```

---

## 📱 **Các page chính**

| Page | Đường dẫn | Mô tả |
|------|-----------|-------|
| Trang chủ | `/` | Hiển thị khóa học nổi bật |
| Danh sách khóa học | `/courses` | Xem tất cả khóa học |
| Chi tiết khóa học | `/courseDetail/:slug` | Xem thông tin chi tiết khóa học |
| Giỏ hàng | `/cart` | Xem giỏ hàng |
| Thanh toán | `/payment` | Trang thanh toán |
| Học tập | `/learning/:slug` | Xem video bài học |
| Tài khoản | `/account-setting` | Cài đặt hồ sơ |
| Blog | `/blog` | Xem bài viết blog |
| Admin | `/admin/dashboard` | Dashboard quản lý |

---

## 👨‍💼 **Tác giả**

- **LyDinhThi-create**

---

## 📝 **Ghi chú**

- Ứng dụng được deploy trên Render
- Database sử dụng MongoDB Atlas
- Hình ảnh được lưu trữ trên Cloudinary

---

## 📞 **Liên hệ & Hỗ trợ**

Nếu có bất kỳ câu hỏi hoặc vấn đề, vui lòng liên hệ qua:
- Email: cuonguyenmanh18@gmail.com

---

**Cảm ơn đã sử dụng EDEMY! 🎉**
