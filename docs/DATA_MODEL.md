# DATA_MODEL — Hệ thống Quản lý Thư viện

## Entities

### NGUOI_DUNG
| Trường | Kiểu | Ghi chú |
|---|---|---|
| ma_nguoi_dung | TEXT PK | |
| ho_ten | TEXT | |
| tai_khoan | TEXT UNIQUE | Username đăng nhập |
| mat_khau | TEXT | Bcrypt hash |
| quyen | TEXT | `admin` / `thu_thu` |
| trang_thai | TEXT | `active` / `inactive` |

### DOC_GIA
| Trường | Kiểu | Ghi chú |
|---|---|---|
| ma_doc_gia | TEXT PK | |
| ho_ten | TEXT | |
| lop | TEXT | |
| ngay_sinh | TEXT | ISO 8601 |
| gioi_tinh | TEXT | `nam` / `nu` |
| trang_thai | TEXT | `active` / `locked` |

### CHUYEN_NGANH
| Trường | Kiểu | Ghi chú |
|---|---|---|
| ma_chuyen_nganh | TEXT PK | |
| ten_chuyen_nganh | TEXT | |
| mo_ta | TEXT | |

### DAU_SACH
| Trường | Kiểu | Ghi chú |
|---|---|---|
| ma_dau_sach | TEXT PK | |
| ten_dau_sach | TEXT | |
| nha_xuat_ban | TEXT | |
| so_trang | INTEGER | |
| kich_thuoc | TEXT | VD: "14x20 cm" |
| tac_gia | TEXT | |
| so_luong | INTEGER | Tổng số bản sao |
| ma_chuyen_nganh | TEXT FK | → CHUYEN_NGANH |

### BAN_SAO
| Trường | Kiểu | Ghi chú |
|---|---|---|
| ma_sach | TEXT PK | Mã bản sao cụ thể |
| ma_dau_sach | TEXT FK | → DAU_SACH |
| tinh_trang | TEXT | `san_sang` / `dang_muon` / `hong` |
| ngay_nhap | TEXT | ISO 8601 |

### PHIEU_MUON
| Trường | Kiểu | Ghi chú |
|---|---|---|
| ma_phieu | TEXT PK | |
| ma_sach | TEXT FK | → BAN_SAO |
| ma_doc_gia | TEXT FK | → DOC_GIA |
| ma_thu_thu | TEXT FK | → NGUOI_DUNG |
| ngay_muon | TEXT | ISO 8601 |
| ngay_tra | TEXT | NULL nếu chưa trả |
| tinh_trang | TEXT | `dang_muon` / `da_tra` |

## Quan hệ
```
CHUYEN_NGANH  1 ──< DAU_SACH
DAU_SACH      1 ──< BAN_SAO
DOC_GIA       1 ──< PHIEU_MUON
BAN_SAO       1 ──< PHIEU_MUON
NGUOI_DUNG    1 ──< PHIEU_MUON   (thủ thư ghi nhận)
```

## Business Rules
- 1 độc giả chỉ có **1 phiếu `dang_muon`** tại một thời điểm
- Chỉ xóa BAN_SAO khi `tinh_trang != 'dang_muon'`
- Chỉ xóa DOC_GIA khi không còn phiếu mượn chưa trả
- Tạo phiếu mượn → set `BAN_SAO.tinh_trang = 'dang_muon'`
- Trả sách → set `BAN_SAO.tinh_trang = 'san_sang'` + ghi `ngay_tra`

## Queries quan trọng
```sql
-- Độc giả chưa trả sách
SELECT d.ho_ten, d.lop, p.ngay_muon, ds.ten_dau_sach
FROM PHIEU_MUON p
JOIN DOC_GIA d ON p.ma_doc_gia = d.ma_doc_gia
JOIN BAN_SAO b ON p.ma_sach = b.ma_sach
JOIN DAU_SACH ds ON b.ma_dau_sach = ds.ma_dau_sach
WHERE p.tinh_trang = 'dang_muon';

-- Đầu sách mượn nhiều nhất
SELECT ds.ten_dau_sach, COUNT(*) AS so_luot
FROM PHIEU_MUON p
JOIN BAN_SAO b ON p.ma_sach = b.ma_sach
JOIN DAU_SACH ds ON b.ma_dau_sach = ds.ma_dau_sach
GROUP BY ds.ma_dau_sach
ORDER BY so_luot DESC;
```

## Lưu ý SQLite
- Không có kiểu ENUM — dùng TEXT + CHECK constraint
- Không có kiểu BOOLEAN — dùng INTEGER (0/1)
- Ngày tháng lưu dạng TEXT ISO 8601: `YYYY-MM-DD`
- Bật foreign key bắt buộc: `PRAGMA foreign_keys = ON;`
