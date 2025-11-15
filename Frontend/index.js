document.addEventListener("DOMContentLoaded", function() {
  const myCourses = []; 

  const container = document.getElementById("courses-container");
  const noCourses = document.getElementById("no-courses");

  if (!container || !noCourses) return; 

  if (myCourses.length === 0) {
    noCourses.classList.remove("d-none");
  } else {
    myCourses.forEach(course => {
      const card = document.createElement("div");
      card.className = "col-md-4";
      card.innerHTML = `
        <div class="card border-0 shadow-sm p-4">
          <h5 class="fw-semibold">${course.name}</h5>
          <div class="progress my-3" style="height: 10px;">
            <div class="progress-bar bg-success" style="width: ${course.progress}%;"></div>
          </div>
          <small class="text-muted">Hoàn thành ${course.progress}%</small>
        </div>`;
      container.appendChild(card);
    });
  }
});
