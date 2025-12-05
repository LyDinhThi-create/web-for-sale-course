// Cấu hình chung cho Chart để responsive tốt hơn
Chart.defaults.maintainAspectRatio = false;

// Revenue Chart
const revenueCtx = document.getElementById("revenueChart").getContext("2d");
new Chart(revenueCtx, {
  type: "line",
  data: {
    labels: ["20/11", "21/11", "22/11", "23/11", "24/11", "25/11", "26/11"],
    datasets: [
      {
        label: "Doanh thu ($)",
        data: [32, 38, 35, 42, 48, 55, 62],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }, // Ẩn chú thích cho gọn
    scales: { y: { beginAtZero: true } },
  },
});

// Category Chart
const categoryCtx = document.getElementById("categoryChart").getContext("2d");
new Chart(categoryCtx, {
  type: "doughnut",
  data: {
    labels: ["Lập Trình", "Marketing", "Thiết Kế", "Kinh Doanh"],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
  },
});

// Time range filter - FIX: Nhận tham số element
function changeTimeRange(range, element) {
  // Xóa class active ở tất cả nút
  const buttons = document.querySelectorAll(".time-filter button");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Thêm class active cho nút được bấm (element)
  element.classList.add("active");

  console.log("Đã chọn mốc thời gian:", range);
  // Sau này bạn sẽ gọi API ở đây để cập nhật lại Chart
}
