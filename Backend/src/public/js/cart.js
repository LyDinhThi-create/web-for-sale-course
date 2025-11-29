  // // DOM Elements
  //       const tableBody = document.getElementById('cart-items-container');
  //       const totalPriceElement = document.getElementById('cart-total-price');

  //       // 2. Hàm render giao diện
  //       function renderCart() {
  //           tableBody.innerHTML = ''; // Xóa nội dung cũ
  //           let total = 0;

  //           cartData.forEach(item => {
  //               total += item.price;

  //               const row = document.createElement('tr');
  //               row.innerHTML = `
  //                   <td class="thumb-col">
  //                       <div class="product-thumb">
  //                           <i class="fa-regular fa-image" style="color:#ccc;"></i>
  //                           <span style="font-size:10px; margin-left:2px;">${item.image}</span>
  //                       </div>
  //                   </td>
  //                   <td class="title-col">
  //                       <h3>${item.title}</h3>
  //                   </td>
  //                   <td class="price-col">
  //                       $${item.price}
  //                   </td>
  //                   <td class="action-col">
  //                       <button class="delete-btn" onclick="removeItem(${item.id})">
  //                           <i class="fa-solid fa-trash-can"></i>
  //                       </button>
  //                   </td>
  //               `;
  //               tableBody.appendChild(row);
  //           });

  //           // Cập nhật tổng tiền (format số tiền có .00)
  //           totalPriceElement.textContent = `$${total.toFixed(2)}`;
  //       }

  //       // 3. Hàm xóa sản phẩm
  //       function removeItem(id) {
  //           // Lọc bỏ item có id tương ứng
  //           cartData = cartData.filter(item => item.id !== id);
  //           // Render lại bảng
  //           renderCart();
  //       }

  //       // Chạy hàm lần đầu khi trang tải xong
  //       renderCart();

  

    
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {    
    try {
      const courseId = e.target.dataset.courseId
      console.log("Xóa khóa học với ID:", courseId);
      const response = await fetch(`/cart/delete/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.code == 200) {
        alert(result.message);
        location.reload();
      } else if (result.code == 400) {
        alert(result.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
    });
    })

    // Xử lý sự kiện cho nút Thanh Toán
    const checkoutButton = document.querySelector('.checkout-btn');
    checkoutButton.addEventListener('click', async () => {
      try 
      { 
        const response = await fetch('/cart/checkout', {
          method: "POST",
          headers: {
            "Content-Type": "application/json", }
        });

        const result = await response.json();
        if (result.code == 200) {
        alert(result.message);
        location.reload();
        } else if (result.code == 400) {
        alert(result.message);
        }
      }
      catch (error)
      {
        console.error("Lỗi:", error);
      } 
    });

