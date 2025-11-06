// courseDetail
document.addEventListener("DOMContentLoaded", function () {
  // Tab switching functionality
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs and contents
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      // Show corresponding content
      const tabId = this.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Add to cart button effect
  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.6);
                    transform: scale(0);
                    animation: rippleEffect 0.6s linear;
                    left: ${e.clientX - rect.left - size / 2}px;
                    top: ${e.clientY - rect.top - size / 2}px;
                    width: ${size}px;
                    height: ${size}px;
                    pointer-events: none;
                `;

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
        alert("Course added to cart!");
      }, 600);
    });
  }

  // Share button effect
  const shareBtn = document.querySelector(".share-btn");
  if (shareBtn) {
    document.querySelector(".share-btn").addEventListener("click", function () {
      alert("Share options would appear here!");
    });
  }
});

// Add ripple animation style
const style = document.createElement("style");
style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);
// end courseDetail
// navbar
const menuItems = document.querySelectorAll(".nav-link");
menuItems.forEach((item) => {
  item.addEventListener("click", function () {
    menuItems.forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
  });
});
//end navbar
// login
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Login form handler
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;

      if (email && password) {
        alert(`Login successful!\nEmail: ${email}`);
        this.reset();
      }
    });

    // Register form handler
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fullName = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;

      // Validate password length
      if (password.length < 8) {
        alert("Password must be at least 8 characters long!");
        return;
      }

      alert(`Registration successful!\nName: ${fullName}\nEmail: ${email}`);
      this.reset();
    });

    // Add focus effects
    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.style.transform = "scale(1.02)";
      });

      input.addEventListener("blur", function () {
        this.parentElement.style.transform = "scale(1)";
      });
    });

    // Password validation feedback
    const passwordInput = registerForm.querySelector('input[type="password"]');
    passwordInput.addEventListener("input", function () {
      if (this.value.length >= 8) {
        this.style.borderColor = "#10b981";
      } else if (this.value.length > 0) {
        this.style.borderColor = "#f59e0b";
      } else {
        this.style.borderColor = "#e2e8f0";
      }
    });
  });
});
// end login
//sort course
// Lắng nghe sự kiện 'change' (thay đổi) trên dropdown
const sortSelect = document.getElementById("sort");
if (sortSelect) {
  sortSelect.addEventListener("change", function () {
    // Lấy giá trị đã chọn, ví dụ: "price:asc"
    const sortValue = this.value;

    // Lấy đường dẫn cơ bản của trang
    const baseUrl = window.location.pathname;

    // Tự động chuyển hướng trang với query 'sort' mới
    // Trình duyệt sẽ tải lại trang: /admin/dashboard?sort=price:asc
    window.location.href = `${baseUrl}?sort=${sortValue}`;
  });
}

// end sort
