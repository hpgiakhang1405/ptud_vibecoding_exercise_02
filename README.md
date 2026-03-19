# Hệ Thống Quản Lý Thư Viện

Đây là ứng dụng quản lý thư viện dành cho môi trường đại học, hỗ trợ số hóa các nghiệp vụ chính như quản lý độc giả, sách, mượn/trả và báo cáo thống kê. Dự án được tách thành frontend và backend để dễ phát triển, bảo trì và mở rộng. README này đủ để người mới clone repo và chạy hệ thống ngay.

## Tính năng chính

1. Xác thực người dùng
2. Quản lý độc giả
3. Quản lý chuyên ngành
4. Quản lý sách
5. Quản lý mượn / trả sách
6. Báo cáo thống kê
7. Quản trị người dùng

## Tech stack

- Frontend: Next.js 14
- Backend: FastAPI
- Database: SQLite

## Yêu cầu hệ thống

- Python 3.11+
- Node.js 18+

## Hướng dẫn cài đặt và chạy

### 1. Clone repo

```bash
git clone <repo-url>
cd ptud_vibecoding_exercise_02
```

### 2. Cài đặt và chạy backend

```bash
cd backend
pip install -r requirements.txt
```

Copy file môi trường:

- Sao chép `backend/.env.example` thành `backend/.env`

Chạy migrate:

```bash
alembic upgrade head
```

Khởi động backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend mặc định chạy tại: `http://localhost:8000`

### 3. Cài đặt và chạy frontend

Mở terminal mới:

```bash
cd frontend
npm install
```

Copy file môi trường:

- Sao chép `frontend/.env.example` thành `frontend/.env.local`

Khởi động frontend:

```bash
npm run dev
```

Frontend mặc định chạy tại: `http://localhost:3000`

## Tài khoản mặc định

- Tài khoản: `admin`
- Mật khẩu: `Admin@123`
- Quyền: `Admin`

## Cấu trúc thư mục

```text
ptud_vibecoding_exercise_02/
├── backend/
│   ├── alembic/
│   ├── app/
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    └── .env.example
```

## Ghi chú nhanh

- Hãy chạy backend trước, sau đó mới chạy frontend.
- Nếu chưa có file môi trường, ứng dụng sẽ không hoạt động đúng.
- Sau khi chạy xong, truy cập `http://localhost:3000` và đăng nhập bằng tài khoản mặc định ở trên.
