document.addEventListener("DOMContentLoaded", () => {
  const courseModal = document.getElementById("courseModal");
  const courseForm = document.getElementById("course-form");
  const saveCourseBtn = document.getElementById("save-course-btn");
  const addLessonBtn = document.getElementById("add-lesson-btn");
  const curriculumContainer = document.getElementById("curriculum-container");
  const courseTableBody = document.getElementById("course-table-body");

  const resetForm = () => {
    courseForm.reset();
    document.getElementById("course-id").value = "";
    curriculumContainer.innerHTML = "";
    document.getElementById("courseModalLabel").textContent =
      "Thêm khóa học mới";
    // Thêm 2 dòng này để reset input file và ảnh cũ
    document.getElementById("course-image-upload").value = null;
    document.getElementById("course-image").value = "";
  };

  const addLessonField = (
    lesson = { title: "", videoUrl: "", duration: "" }
  ) => {
    const lessonGroup = document.createElement("div");
    lessonGroup.className = "input-group mb-2 lesson-group";
    lessonGroup.innerHTML = `
      <input type="text" class="form-control lesson-title" placeholder="Tên bài học" value="${
        lesson.title || ""
      }">
      <input type="text" class="form-control lesson-video" placeholder="Link video" value="${
        lesson.videoUrl || ""
      }">
      <input type="text" class="form-control lesson-duration" placeholder="min" value="${
        lesson.duration || ""
      }" style="max-width: 100px;">
      <button class="btn btn-outline-danger remove-lesson-btn" type="button">Xóa</button>
    `;
    curriculumContainer.appendChild(lessonGroup);
  };

  courseModal.addEventListener("show.bs.modal", (event) => {
    resetForm();
    // Chỗ này cần kiểm tra vì nút "Thêm" không có 'data-course'
    const button = event.relatedTarget;
    const courseData = button.getAttribute("data-course");
    if (courseData) {
      const course = JSON.parse(courseData); // Chế độ Sửa
      document.getElementById("courseModalLabel").textContent =
        "Chỉnh sửa khóa học";
      document.getElementById("course-id").value = course._id;
      document.getElementById("course-title").value = course.title;
      document.getElementById("instructor-name").value = course.instructor.name;
      document.getElementById("instructor-avatar").value =
        course.instructor.avatar;
      // Dùng ô #course-image (readonly) để hiển thị link ảnh cũ
      document.getElementById("course-image").value = course.image || "";

      document.getElementById("course-price").value = course.price;
      document.getElementById("course-description").value = course.description;
      document.getElementById("course-access").value = course.access;
      document.getElementById("course-status").value = course.status;
      document.getElementById("course-fullDescription").value =
        course.fullDescription ? course.fullDescription.join("\n") : "";
      if (course.curriculum) course.curriculum.forEach(addLessonField);
    }
  });

  addLessonBtn.addEventListener("click", () => addLessonField());

  curriculumContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-lesson-btn"))
      e.target.closest(".lesson-group").remove();
  });

  // --- HÀM saveCourseBtn ĐÃ THAY ĐỔI HOÀN TOÀN ---
  saveCourseBtn.addEventListener("click", async () => {
    const courseId = document.getElementById("course-id").value;

    // 1. Tạo đối tượng FormData
    const formData = new FormData();

    // 2. Thêm file ảnh (nếu người dùng đã chọn)
    const imageFile = document.getElementById("course-image-upload").files[0];
    if (imageFile) {
      // 'imageFile' phải khớp với tên trong upload.single() ở route
      formData.append("imageFile", imageFile);
    }

    // 3. Thu thập các giá trị và thêm vào formData
    formData.append("title", document.getElementById("course-title").value);
    formData.append(
      "price",
      Number(document.getElementById("course-price").value) || 0
    );
    formData.append(
      "description",
      document.getElementById("course-description").value
    );
    formData.append("access", document.getElementById("course-access").value);
    formData.append("status", document.getElementById("course-status").value);

    // Thêm link ảnh cũ (để 'update' có thể giữ lại nếu không có ảnh mới)
    formData.append("image", document.getElementById("course-image").value);

    // 4. Thu thập các đối tượng/mảng và JSON.stringify() chúng
    const instructor = {
      name: document.getElementById("instructor-name").value,
      avatar: document.getElementById("instructor-avatar").value,
    };
    formData.append("instructor", JSON.stringify(instructor));

    const curriculum = [...document.querySelectorAll(".lesson-group")]
      .map((group) => ({
        title: group.querySelector(".lesson-title").value.trim(),
        // Đừng quên thêm videoUrl nếu bạn đã sửa schema
        // videoUrl: group.querySelector(".lesson-video").value.trim(),
        duration: group.querySelector(".lesson-duration").value.trim(),
      }))
      .filter((l) => l.title);
    formData.append("curriculum", JSON.stringify(curriculum));

    const fullDescription = document
      .getElementById("course-fullDescription")
      .value.split("\n")
      .map((p) => p.trim())
      .filter((p) => p);
    formData.append("fullDescription", JSON.stringify(fullDescription));

    // 5. Xác định URL, Method và gửi Fetch
    const url = courseId ? `/admin/courses/${courseId}` : "/admin/courses";
    const method = courseId ? "PUT" : "POST";

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

  courseTableBody.addEventListener("click", async (event) => {
    const deleteButton = event.target.closest(".btn-danger");
    if (deleteButton) {
      const courseId = deleteButton.getAttribute("data-course-id");
      if (confirm("Bạn có chắc chắn muốn xóa?")) {
        try {
          const response = await fetch(`/admin/courses/${courseId}`, {
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
