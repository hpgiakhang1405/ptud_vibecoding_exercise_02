# PRD — Hệ thống Quản lý Thư viện Đại học

## Vấn đề
Thư viện đại học cần số hóa toàn bộ quy trình: quản lý sách, độc giả, mượn/trả sách và báo cáo định kỳ, thay thế hồ sơ giấy tờ thủ công.

## Actors
| Actor | Mô tả |
|---|---|
| **Admin** | Quản trị hệ thống, quản lý tài khoản nhân viên |
| **Thủ thư** | Nghiệp vụ chính: quản lý sách, độc giả, mượn/trả |

> Mọi actor đều phải đăng nhập trước khi thao tác.

---

## Chức năng đầy đủ

### 1. Xác thực
- Đăng nhập bằng tài khoản / mật khẩu
- Đăng xuất
- Phân quyền theo role: `admin`, `thu_thu`
- Bảo vệ toàn bộ route — redirect về trang login nếu chưa xác thực

### 2. Quản lý Độc giả
- Thêm thẻ thư viện (mã, họ tên, lớp, ngày sinh, giới tính)
- Sửa thông tin thẻ
- Xóa thẻ (chỉ khi không có phiếu mượn đang mở)
- In thẻ thư viện (print view / export PDF)
- Tìm kiếm, lọc danh sách độc giả

### 3. Quản lý Chuyên ngành
- Thêm / Sửa / Xóa chuyên ngành (mã, tên, mô tả)

### 4. Quản lý Sách
- CRUD đầu sách (mã, tên, NXB, số trang, kích thước, tác giả, chuyên ngành)
- CRUD bản sao sách (mã sách, tình trạng, ngày nhập) — nhiều bản/đầu sách
- Tìm kiếm, lọc sách theo tên, tác giả, chuyên ngành

### 5. Quản lý Mượn / Trả sách
- Tạo phiếu mượn (mã sách, mã độc giả, mã thủ thư, ngày mượn)
- Validate: 1 độc giả chỉ được có 1 phiếu đang mượn tại một thời điểm
- Validate: bản sao phải ở trạng thái `san_sang` mới cho mượn
- Ghi nhận trả sách → cập nhật tình trạng phiếu + bản sao
- Xem lịch sử mượn/trả theo độc giả hoặc theo sách

### 6. Báo cáo
- Đầu sách được mượn nhiều nhất
- Độc giả chưa trả sách (kèm ngày mượn, tên sách)
- Xuất báo cáo ra PDF

### 7. Quản trị người dùng (Admin only)
- Thêm tài khoản thủ thư (thông tin + cấp quyền)
- Sửa thông tin, xóa / vô hiệu hóa tài khoản
- Xem danh sách tài khoản hệ thống

---

## Tiêu chí hoàn thành
- Toàn bộ 7 nhóm chức năng hoạt động đúng
- Phân quyền chính xác (thủ thư không truy cập được trang quản trị)
- Validate business rules mượn/trả đúng
- Báo cáo xuất ra số liệu chính xác
