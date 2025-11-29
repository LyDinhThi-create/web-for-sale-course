document.addEventListener("DOMContentLoaded", function () {
  // Lấy 2 cái nút
  const btnProfile = document.getElementById("tab-profile");
  const btnSecurity = document.getElementById("tab-security");

  // Hàm xử lý chuyển tab
  function handleSwitch(tabName, clickedBtn) {
    // 1. Ẩn hết nội dung
    document
      .querySelectorAll(".tab-content")
      .forEach((el) => el.classList.remove("active"));

    // 2. Bỏ active hết nút
    document
      .querySelectorAll(".tab")
      .forEach((el) => el.classList.remove("active"));

    // 3. Hiện nội dung mới
    const target = document.getElementById(tabName);
    if (target) target.classList.add("active");

    // 4. Active nút mới
    if (clickedBtn) clickedBtn.classList.add("active");
  }

  // Gán sự kiện click (An toàn tuyệt đối)
  if (btnProfile) {
    btnProfile.addEventListener("click", function (e) {
      e.preventDefault(); // Chặn mọi hành vi lạ
      e.stopPropagation(); // Chặn sự kiện nổi bọt lên cha
      handleSwitch("profile", this);
    });
  }

  if (btnSecurity) {
    btnSecurity.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      handleSwitch("security", this);
    });
  }
  const formProfile = document.getElementById("profileForm");
  formProfile.addEventListener("submit", function (e) {
    e.preventDefault();
    // Lấy dữ liệu từ form
    const fullname = document.getElementById("firstName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Tạo đối tượng dữ liệu
    const data = {
      fullname: fullname,
      email: email,
      phone: phone,
    };
    // Gửi dữ liệu lên server bằng Fetch API
    fetch("/user/account-setting/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          alert(data.message);
          location.reload();
        } else {
          alert("Cập nhập Thành công");
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  });
  const passwordForm = document.getElementById("passwordForm");
  passwordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Lấy dữ liệu từ form
    const passWord = document.getElementById("currentPassword").value;
    const newPassWord = document.getElementById("newPassword").value;
    const confirmPassWord = document.getElementById("confirmPassword").value;
    if (newPassWord !== confirmPassWord) {
      alert("Mật khẩu mới không khớp");
    } else {
      // Tạo đối tượng dữ liệu
      const data = {
        password: passWord,
        newPassword: newPassWord,
      };
      // Gửi dữ liệu lên server bằng Fetch API
      fetch("/user/account-setting/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            alert(data.message);
            location.reload();
          } else {
            alert("Đổi mật khẩu Thất bại: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Lỗi:", error);
        });
    }
  });
});
