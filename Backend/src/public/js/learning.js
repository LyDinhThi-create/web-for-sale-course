// learn page

document.addEventListener('DOMContentLoaded', function() {
            
            // const Course = require("../models/Course");
             
            // Lấy các element cần thiết
            const lessonListContainer = document.getElementById('lesson-list');
            const videoPlayer = document.getElementById('video-player');
            const videoTitle = document.getElementById('video-title');
            
            const lessonSidebar = document.getElementById('lesson-sidebar');
            const sidebarExpanded = document.getElementById('sidebar-expanded');
            const sidebarCollapsed = document.getElementById('sidebar-collapsed');
            
            const hideButton = document.getElementById('sidebar-toggle-hide');
            const showButton = document.getElementById('sidebar-toggle-show');
            const mobileToggleButton = document.getElementById('mobile-sidebar-toggle');

            // Hàm hiển thị danh sách bài học
            // function renderLessons() {
            //     lessonListContainer.innerHTML = lessons.map((lesson, index) => `
            //         <div class="lesson-item flex items-center p-4 rounded-lg cursor-pointer hover:bg-red-100 transition-colors ${index === 0 ? 'active' : ''}"
            //              data-video-id="${lesson.videoId}"
            //              data-title="${lesson.id}. ${lesson.title}">
            //             <div class="lesson-icon text-gray-400 mr-4">
            //                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            //             </div>
            //             <div class="flex-1">
            //                 <h3 class="font-semibold text-sm leading-tight">${lesson.id}. ${lesson.title}</h3>
            //                 <p class="lesson-duration text-xs text-gray-500 mt-1">${lesson.duration}</p>
            //             </div>
            //             <div class="lesson-status text-[#fe4a55]">
            //                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
            //             </div>
            //         </div>
            //     `).join('');
            // }
            
            // Xử lý khi click vào một bài học
            function handleLessonClick(event) {
                const clickedItem = event.target.closest('.lesson-item');
                if (!clickedItem) return;

                document.querySelectorAll('.lesson-item').forEach(item => item.classList.remove('active'));
                clickedItem.classList.add('active');
                
                videoPlayer.src = `https://www.youtube.com/embed/${clickedItem.dataset.videoUrl}?autoplay=1`;
                videoTitle.textContent = clickedItem.dataset.title;

                // Tự động đóng sidebar trên mobile sau khi chọn bài
                if (window.innerWidth < 768) {
                    closeMobileSidebar();
                }
            }
            
            // --- Logic cho Mobile ---
            function openMobileSidebar() {
                lessonSidebar.classList.remove('translate-x-full');
            }
            function closeMobileSidebar() {
                lessonSidebar.classList.add('translate-x-full');
            }
            
            mobileToggleButton.addEventListener('click', openMobileSidebar);


            // --- Logic cho Desktop ---
            function hideDesktopSidebar() {
                lessonSidebar.style.width = '56px';
                sidebarExpanded.classList.add('hidden');
                sidebarCollapsed.classList.remove('hidden');
                sidebarCollapsed.style.display = 'flex';
            }

            function showDesktopSidebar() {
                lessonSidebar.style.width = '400px';
                sidebarExpanded.classList.remove('hidden');
                sidebarCollapsed.classList.add('hidden');
                sidebarCollapsed.style.display = 'none';
            }

            const showSidebarHandler = () => {
                if (window.innerWidth >= 768) showDesktopSidebar();
            };

            // Nút đóng/thu gọn chính
            hideButton.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    closeMobileSidebar();
                } else {
                    hideDesktopSidebar();
                }
            });

            showButton.addEventListener('click', showSidebarHandler);
            sidebarCollapsed.addEventListener('click', showSidebarHandler);


            // Chạy các hàm khởi tạo
            
            lessonListContainer.addEventListener('click', handleLessonClick);
        });
  //end learn page
