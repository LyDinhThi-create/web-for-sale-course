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
    const course = JSON.parse(event.relatedTarget.getAttribute("data-course"));
    if (course) {
      // Chế độ Sửa
      document.getElementById("courseModalLabel").textContent =
        "Chỉnh sửa khóa học";
      document.getElementById("course-id").value = course._id;
      document.getElementById("course-title").value = course.title;
      document.getElementById("instructor-name").value = course.instructor.name;
      document.getElementById("instructor-avatar").value = course.instructor.avatar;
      document.getElementById("course-image").value = course.image;
      document.getElementById("course-price").value = course.price;
      document.getElementById("course-description").value = course.description;
      document.getElementById("course-access").value = course.access;
      document.getElementById("course-status").value = course.status;
      // ... điền các trường khác tương tự
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

  saveCourseBtn.addEventListener("click", async () => {
    const courseId = document.getElementById("course-id").value;

    const curriculum = [...document.querySelectorAll(".lesson-group")]
      .map((group) => ({
        title: group.querySelector(".lesson-title").value.trim(),
        duration: group.querySelector(".lesson-duration").value.trim(),
      }))
      .filter((l) => l.title);

    const payload = {
      title: document.getElementById("course-title").value,
      instructor: {
        name: document.getElementById("instructor-name").value,
        avatar: document.getElementById("instructor-avatar").value,
      },
      image: document.getElementById("course-image").value,
      price: Number(document.getElementById("course-price").value) || 0,
      description: document.getElementById("course-description").value,
      access: document.getElementById("course-access").value,
      fullDescription: document
        .getElementById("course-fullDescription")
        .value.split("\n")
        .map((p) => p.trim())
        .filter((p) => p),
      status: document.getElementById("course-status").value,

      // ... lấy giá trị các trường khác
      curriculum,
    };

    const url = courseId ? `/admin/courses/${courseId}` : "/admin/courses";
    const method = courseId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Lỗi máy chủ");
      location.reload();
    } catch (error) {
      alert("Lưu thất bại!");
    }
  });

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
