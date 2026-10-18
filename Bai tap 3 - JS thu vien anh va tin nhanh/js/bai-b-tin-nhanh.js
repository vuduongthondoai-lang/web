document.addEventListener("DOMContentLoaded", () => {
    const oTimKiem = document.getElementById("o-tim-kiem");
    const list = document.getElementById("list");
    const boDem = document.getElementById("bo-dem");
    const khongThay = document.getElementById("khong-thay");
    
    const tinTieuDe = document.getElementById("tin-tieu-de");
    const tinNoiDung = document.getElementById("tin-noi-dung");
    const nutDang = document.getElementById("nut-dang");
    const baoLoi = document.getElementById("bao-loi");

    // F1. Cập nhật bộ đếm hiển thị x/y tin
    function capNhatBoDem() {
        if (!list || !boDem) return;
        const allLis = list.querySelectorAll("li");
        const total = allLis.length;
        let visible = 0;
        allLis.forEach(li => {
            if (!li.classList.contains("an")) {
                visible++;
            }
        });
        boDem.textContent = `Đang hiển thị ${visible}/${total} tin`;
    }

    // F2 & F3. Lọc tin và hiển thị thông báo không tìm thấy
    function locTin() {
        if (!oTimKiem || !list) return;
        const keyword = oTimKiem.value.trim().toLowerCase();
        const allLis = list.querySelectorAll("li");
        let matchCount = 0;

        allLis.forEach(li => {
            const h3 = li.querySelector("h3");
            const p = li.querySelector("p");
            const titleText = h3 ? h3.textContent.toLowerCase() : "";
            const contentText = p ? p.textContent.toLowerCase() : "";

            if (keyword === "" || titleText.includes(keyword) || contentText.includes(keyword)) {
                li.classList.remove("an");
                matchCount++;
            } else {
                li.classList.add("an");
            }
        });

        // Xử lý thông báo không tìm thấy (#khong-thay)
        if (khongThay) {
            if (matchCount === 0 && keyword !== "") {
                khongThay.classList.remove("an");
                // Giữ nguyên văn từ khóa người dùng gõ
                khongThay.textContent = `Không tìm thấy tin nào cho "${oTimKiem.value}"`;
            } else {
                khongThay.classList.add("an");
            }
        }

        capNhatBoDem();
    }

    // Lắng nghe sự kiện keyup để lọc tin
    if (oTimKiem) {
        oTimKiem.addEventListener("keyup", locTin);
    }

    // F4. Mở rộng / thu gọn (Sử dụng Event Delegation đặt duy nhất trên #list)
    if (list) {
        list.addEventListener("click", (e) => {
            if (e.target && e.target.classList.contains("more")) {
                const li = e.target.closest("li");
                if (!li) return;
                const p = li.querySelector("p");
                if (!p) return;

                if (p.classList.contains("day-du")) {
                    p.classList.remove("day-du");
                    e.target.textContent = "Read more >>";
                } else {
                    p.classList.add("day-du");
                    e.target.textContent = "Thu gọn <<";
                }
            }
        });
    }

    // F5. Đăng tin nhanh
    if (nutDang) {
        nutDang.addEventListener("click", () => {
            const tieuDeVal = tinTieuDe ? tinTieuDe.value : "";
            const noiDungVal = tinNoiDung ? tinNoiDung.value : "";

            // Kiểm tra rỗng
            if (!tieuDeVal.trim() || !noiDungVal.trim()) {
                if (baoLoi) {
                    baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
                    baoLoi.classList.remove("an");
                }
                return;
            }

            // Xóa lỗi nếu hợp lệ
            if (baoLoi) {
                baoLoi.textContent = "";
                baoLoi.classList.add("an");
            }

            // Tạo thẻ <li> mới
            const newLi = document.createElement("li");

            const timeSpan = document.createElement("span");
            timeSpan.className = "time";
            // Lấy ngày bằng hàm homNay() nếu có sẵn, nếu không dùng ngày hiện tại
            if (typeof homNay === "function") {
                timeSpan.textContent = homNay();
            } else {
                const now = new Date();
                timeSpan.textContent = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
            }

            const h3 = document.createElement("h3");
            h3.textContent = tieuDeVal; // Hiển thị nguyên văn (chống chạy script/HTML)

            const p = document.createElement("p");
            p.textContent = noiDungVal; // Hiển thị nguyên văn

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "more";
            btn.textContent = "Read more >>";

            newLi.appendChild(timeSpan);
            newLi.appendChild(h3);
            newLi.appendChild(p);
            newLi.appendChild(btn);

            // Chèn vào đầu #list
            list.insertBefore(newLi, list.firstChild);

            // Xoá trắng ô nhập
            if (tinTieuDe) tinTieuDe.value = "";
            if (tinNoiDung) tinNoiDung.value = "";

            // Đồng thời áp dụng bộ lọc hiện tại (nếu đang tìm kiếm dở dang)
            locTin();
        });
    }

    // Khởi tạo bộ đếm lúc vừa tải trang
    capNhatBoDem();
});