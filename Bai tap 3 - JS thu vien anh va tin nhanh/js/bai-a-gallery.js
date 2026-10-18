document.addEventListener("DOMContentLoaded", () => {
    const mainImage = document.querySelector(".main-image img") || document.querySelector("#anh-lon");
    const caption = document.querySelector(".caption") || document.querySelector("#chu-thich");
    const thumbnails = document.querySelectorAll(".thumbnails img, .thumb, .gallery-thumb");
    const searchInput = document.querySelector("#o-tim-kiem, input[type='search']");
    const lockButton = document.querySelector("#khoa-thu-vien, .lock-gallery");
    
    let isLocked = false;

    // Tính năng Khóa thư viện ảnh
    if (lockButton) {
        lockButton.addEventListener("click", () => {
            isLocked = !isLocked;
            lockButton.textContent = isLocked ? "Mở khoá thư viện" : "Khoá thư viện ảnh";
        });
    }

    // Tính năng click ảnh nhỏ đổi ảnh lớn và chú thích
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener("click", (e) => {
                if (isLocked) return; // Nếu đang khóa thì không làm gì

                const src = thumb.getAttribute("src");
                const filename = src.split("/").pop();

                mainImage.src = src;
                if (caption) {
                    caption.textContent = `Đang xem: ${filename}`;
                }

                // Đánh dấu viền cho ảnh nhỏ được chọn
                thumbnails.forEach(t => t.classList.remove("active", "border", "selected"));
                thumb.classList.add("active", "border", "selected");
            });
        });
    }

    // Xử lý ô tìm kiếm (mất chữ gợi ý khi focus, hiện lại khi blur nếu để trống)
    if (searchInput) {
        const originalPlaceholder = searchInput.placeholder;
        searchInput.addEventListener("focus", () => {
            searchInput.placeholder = "";
        });
        searchInput.addEventListener("blur", () => {
            if (searchInput.value === "") {
                searchInput.placeholder = originalPlaceholder;
            }
        });
    }

    // Thêm một mục vào đầu danh sách cột bên phải
    const rightList = document.querySelector(".sidebar ul, .right-column ul, .col-md-4 ul");
    if (rightList) {
        const newItem = document.createElement("li");
        newItem.className = "list-group-item";
        newItem.textContent = "Mục thông báo mới (Bài 3a)";
        rightList.insertBefore(newItem, rightList.firstChild);
    }
});