document.addEventListener("DOMContentLoaded", () => {
  const blogModal = document.getElementById("blogModal");
  const blogForm = document.getElementById("blog-form");
  const saveBlogBtn = document.getElementById("save-blog-btn");
  const blogTableBody = document.getElementById("blog-table-body");

  const resetForm = () => {
    blogForm.reset();
    document.getElementById("blog-id").value = "";
    document.getElementById("blogModalLabel").textContent = "Thêm blog mới";
    // Thêm 2 dòng này để reset input file và ảnh cũ
    document.getElementById("blog-image-upload").value = null;
    document.getElementById("blog-image").value = "";
    document.getElementById("image-preview").src = "";
    document.getElementById("image-preview-old").src = "";
  };

  blogModal.addEventListener("show.bs.modal", (event) => {
    resetForm();
    // Chỗ này cần kiểm tra vì nút "Thêm" không có 'data-blog'
    const button = event.relatedTarget;
    const blogData = button.getAttribute("data-blog");
    if (blogData) {
      const blog = JSON.parse(blogData); // Chế độ Sửa
      document.getElementById("blogModalLabel").textContent = "Chỉnh sửa blog";
      document.getElementById("blog-id").value = blog._id;
      document.getElementById("blog-title").value = blog.title;
      document.getElementById("blog-viewCount").value = blog.viewCount;
      document.getElementById("instructor-name").value = blog.instructor.name;
      document.getElementById("instructor-avatar").value =
        blog.instructor.avatar;
      document.getElementById("blog-category").value = blog.category;
      // Dùng ô #blog-image (readonly) để hiển thị link ảnh cũ
      document.getElementById("blog-image").value = blog.image || "";
      document.getElementById("image-preview-old").src = blog.image || "";
      document.getElementById("blog-status").value = blog.status;
      document.getElementById("blog-fullDescription").value =
        blog.fullDescription ? blog.fullDescription.join("\n") : "";
    }
  });

  saveBlogBtn.addEventListener("click", async () => {
    const blogId = document.getElementById("blog-id").value;

    // 1. Tạo đối tượng FormData
    const formData = new FormData();

    // 2. Thêm file ảnh (nếu người dùng đã chọn)
    const imageFile = document.getElementById("blog-image-upload").files[0];
    if (imageFile) {
      // 'imageFile' phải khớp với tên trong upload.single() ở route
      formData.append("imageFile", imageFile);
    }

    // 3. Thu thập các giá trị và thêm vào formData
    formData.append("title", document.getElementById("blog-title").value);
    formData.append("status", document.getElementById("blog-status").value);

    // Thêm link ảnh cũ (để 'update' có thể giữ lại nếu không có ảnh mới)
    formData.append("image", document.getElementById("blog-image").value);
    formData.append("category", document.getElementById("blog-category").value);

    // 4. Thu thập các đối tượng/mảng và JSON.stringify() chúng
    const instructor = {
      name: document.getElementById("instructor-name").value,
      avatar: document.getElementById("instructor-avatar").value,
    };
    formData.append("instructor", JSON.stringify(instructor));

    const fullDescription = document
      .getElementById("blog-fullDescription")
      .value.split("\n")
      .map((p) => p.trim())
      .filter((p) => p);
    formData.append("fullDescription", JSON.stringify(fullDescription));

    // 5. Xác định URL, Method và gửi Fetch
    const url = blogId ? `/admin/blogs/${blogId}` : "/admin/blogs";
    const method = blogId ? "PUT" : "POST";
    console.log(formData);
    try {
      const response = await fetch(url, {
        method,
        // KHÔNG cần 'Content-Type', trình duyệt tự thêm
        // 'multipart/form-data' khi body là FormData
        body: formData,
      });
      if (!response.ok) throw new Error("Lỗi máy chủ");
      location.reload();
    } catch (error) {
      alert("Lưu thất bại!");
    }
  }); // ... (Phần 'deleteButton' giữ nguyên)

  blogTableBody.addEventListener("click", async (event) => {
    const deleteButton = event.target.closest(".btn-danger");
    if (deleteButton) {
      const blogId = deleteButton.getAttribute("data-blog-id");
      if (confirm("Bạn có chắc chắn muốn xóa?")) {
        try {
          const response = await fetch(`/admin/blogs/${blogId}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Lỗi máy chủ");
          location.reload();
        } catch (error) {
          alert("Xóa thất bại!");
        }
      }
    }
  });
});
// preview image
document
  .getElementById("blog-image-upload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    // Lấy thẻ <img> xem trước
    const imagePreview = document.getElementById("image-preview");

    if (file) {
      // Đọc và hiển thị ảnh xem trước
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      // Nếu người dùng bấm 'Cancel', xóa ảnh xem trước và tên file
      imagePreview.src = "";
    }
  });
//end preview
document.addEventListener('DOMContentLoaded', (event) => {
    const logoutAdminBtn = document.getElementById('logout-admin');
    if (logoutAdminBtn) {
        logoutAdminBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/admin/logout', {
                    method: 'POST',
                });
                if (response.ok) {
                    // Đăng xuất thành công, chuyển hướng về trang đăng nhập
                    window.location.href = '/admin/login';
                } else {
                    alert('Đăng xuất thất bại!');
                }
            } catch (error) {
                alert('Đăng xuất thất bại!');
            }
        });
    }
});
