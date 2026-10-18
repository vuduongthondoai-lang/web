// Dữ liệu mẫu danh mục sản phẩm (nếu file chưa có sẵn)
if (typeof DANH_MUC === 'undefined') {
    var DANH_MUC = {
        // Các sản phẩm mẫu có thể được định nghĩa ở đây hoặc từ file kiểm tra
    };
}

class GioHang {
    constructor() {
        // Đề bài yêu cầu lưu các dòng trong this.dsDong
        this.dsDong = [];
    }

    // 1. Thêm sản phẩm vào giỏ hàng
    them(sanPham, soLuong) {
        if (!sanPham || typeof sanPham !== 'object') return false;

        // Xác định số lượng từ tham số truyền vào hoặc từ thuộc tính của sản phẩm
        let sl = 1;
        if (arguments.length > 1) {
            sl = soLuong;
        } else if ('soLuong' in sanPham) {
            sl = sanPham.soLuong;
        }

        // Kiểm tra tính hợp lệ của số lượng: phải là number, số nguyên và lớn hơn 0
        if (
            sl === null || 
            sl === undefined || 
            typeof sl !== 'number' || 
            isNaN(sl) || 
            !Number.isInteger(sl) || 
            sl <= 0
        ) {
            return false;
        }

        // Kiểm tra xem sản phẩm (theo id) đã có trong giỏ hàng chưa
        const existingIndex = this.dsDong.findIndex(item => item.id === sanPham.id);
        
        if (existingIndex !== -1) {
            // Đã có -> cộng dồn số lượng
            this.dsDong[existingIndex].soLuong += sl;
        } else {
            // Chưa có -> thêm dòng mới (sao chép độc lập để không làm thay đổi DANH_MUC hay object bên ngoài)
            this.dsDong.push({
                id: sanPham.id,
                ten: sanPham.ten,
                loai: sanPham.loai || sanPham.danhMuc || "Khác",
                gia: sanPham.gia,
                soLuong: sl
            });
        }
        return true;
    }

    // 2. Xoá sản phẩm theo id
    xoa(id) {
        const initialLength = this.dsDong.length;
        this.dsDong = this.dsDong.filter(item => item.id !== id);
        return this.dsDong.length < initialLength;
    }

    // 3. Tính tổng tiền của giỏ hàng
    tongTien() {
        return this.dsDong.reduce((tong, item) => tong + (item.gia * item.soLuong), 0);
    }

    // 4. Thống kê tổng tiền theo loại
    thongKeTheoLoai() {
        const thongKe = {};
        this.dsDong.forEach(item => {
            const loai = item.loai || "Khác";
            const thanhTien = item.gia * item.soLuong;
            thongKe[loai] = (thongKe[loai] || 0) + thanhTien;
        });
        return thongKe;
    }

    // 5. Tìm sản phẩm có thành tiền đắt nhất (bằng nhau lấy dòng đứng trước)
    dongDatNhat() {
        if (this.dsDong.length === 0) return null;

        let maxItem = this.dsDong[0];
        let maxThanhTien = maxItem.gia * maxItem.soLuong;

        for (let i = 1; i < this.dsDong.length; i++) {
            const current = this.dsDong[i];
            const currentThanhTien = current.gia * current.soLuong;
            if (currentThanhTien > maxThanhTien) {
                maxThanhTien = currentThanhTien;
                maxItem = current;
            }
        }

        // Trả về bản sao chứa thêm thuộc tính thanhTien, tránh rò rỉ tham chiếu
        return {
            ...maxItem,
            thanhTien: maxItem.gia * maxItem.soLuong
        };
    }

    // 6. Lấy danh sách kèm theo thanhTien cho từng dòng
    layDanhSach() {
        return this.dsDong.map(item => ({
            ...item,
            thanhTien: item.gia * item.soLuong
        }));
    }

    // 7. Xuất giỏ hàng ra chuỗi JSON (chỉ gồm 5 thuộc tính chuẩn)
    xuatJSON() {
        const cleanData = this.dsDong.map(item => ({
            id: item.id,
            ten: item.ten,
            loai: item.loai,
            gia: item.gia,
            soLuong: item.soLuong
        }));
        return JSON.stringify(cleanData);
    }
}

// 8. Hàm ngoài class: Nạp giỏ hàng từ chuỗi JSON
function napGioHang(chuoiJSON) {
    const gioHangMoi = new GioHang();
    try {
        const parsedData = JSON.parse(chuoiJSON);
        if (Array.isArray(parsedData)) {
            gioHangMoi.dsDong = parsedData.map(item => ({ ...item }));
        }
    } catch (e) {
        gioHangMoi.dsDong = [];
    }
    return gioHangMoi;
}
