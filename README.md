# Hệ Thống Quản Lý Thư Viện

Ứng dụng quản lý thư viện cho môi trường đại học, hỗ trợ các nghiệp vụ cốt lõi như đăng nhập, quản lý độc giả, chuyên ngành, đầu sách, bản sao sách, mượn trả và báo cáo thống kê. Dự án tách riêng frontend và backend để dễ phát triển, kiểm thử và bảo trì.

## Mục lục

- [Tính năng chính](#tính-năng-chính)
- [Tech Stack](#tech-stack)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Hướng dẫn chạy local](#hướng-dẫn-chạy-local)
- [Tài khoản mặc định](#tài-khoản-mặc-định)
- [Biến môi trường](#biến-môi-trường)
- [Các lệnh thường dùng](#các-lệnh-thường-dùng)
- [Luồng khởi tạo database](#luồng-khởi-tạo-database)
- [Ghi chú phát triển](#ghi-chú-phát-triển)

## Tính năng chính

1. Đăng nhập bằng tài khoản nội bộ.
2. Quản lý độc giả.
3. Quản lý chuyên ngành.
4. Quản lý đầu sách và bản sao sách.
5. Quản lý mượn và trả sách.
6. Báo cáo thống kê sách mượn nhiều và danh sách chưa trả.
7. Quản trị tài khoản người dùng cho admin.

## Tech Stack

- `⚛️ Frontend`: Next.js 14, React 18, TypeScript, Tailwind CSS
- `🔌 HTTP Client`: Axios
- `⚡ Backend`: FastAPI, Uvicorn
- `🗃️ ORM / Migration`: SQLAlchemy 2.x, Alembic
- `🛢️ Database`: SQLite (`backend/library.db`)
- `🔐 Auth`: JWT lưu trong httpOnly cookie, `python-jose`, `passlib[bcrypt]`
- `📄 Báo cáo`: ReportLab
- `🧹 Quality`: Black, isort, flake8, ESLint, TypeScript

## Cấu trúc thư mục

```text
ptud_vibecoding_exercise_02/
├── .gitignore
├── README.md
├── docs/
│   └── CONTEXT.md
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── routers/
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── constants.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── errors.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── .env.example
│   ├── .flake8
│   ├── alembic.ini
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── .env.example
    ├── .eslintrc.json
    ├── next.config.mjs
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.ts
    └── tsconfig.json
```

## Yêu cầu hệ thống

- Python `3.11+`
- Node.js `18+`
- npm `9+` hoặc phiên bản tương thích với Node.js 18+

## Hướng dẫn chạy local

### 1. Clone project

```bash
git clone <repo-url>
cd ptud_vibecoding_exercise_02
```

### 2. Chạy backend

Tạo môi trường ảo và cài dependency:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Tạo file môi trường:

```bash
copy .env.example .env
```

Khởi tạo database từ migration:

```bash
alembic upgrade head
```

Khởi động backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Hoặc nếu bạn quen entrypoint cũ:

```bash
uvicorn main:app --reload --port 8000
```

Backend chạy tại:

```text
http://localhost:8000
```

Swagger docs:

```text
http://localhost:8000/docs
```

### 3. Chạy frontend

Mở terminal mới:

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend chạy tại:

```text
http://localhost:3000
```

### 4. Quick start cho người mới clone

Nếu project chưa có sẵn file `backend/library.db`, đó là bình thường. Chỉ cần chạy:

```bash
cd backend
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Lệnh `alembic upgrade head` sẽ tự tạo file SQLite mới từ migration hiện tại.

## Tài khoản mặc định

Backend sẽ tự tạo tài khoản admin mặc định khi khởi động nếu tài khoản này chưa tồn tại.

- Tài khoản: lấy từ `ADMIN_USERNAME` trong `backend/.env`
- Mật khẩu: lấy từ `ADMIN_PASSWORD` trong `backend/.env`
- Quyền: `admin`

Ví dụ cho môi trường local:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123
```

## Biến môi trường

### Backend

Tạo `backend/.env` từ `backend/.env.example`.

Các biến chính:

- `SECRET_KEY`: khóa ký JWT
- `DATABASE_URL`: chuỗi kết nối database, ví dụ `sqlite:///./library.db`
- `ACCESS_TOKEN_EXPIRE_HOURS`: thời hạn token theo giờ
- `ADMIN_USERNAME`: tài khoản admin mặc định
- `ADMIN_PASSWORD`: mật khẩu admin mặc định
- `ALLOWED_ORIGINS`: danh sách origin frontend được phép gọi API

### Frontend

Tạo `frontend/.env.local` từ `frontend/.env.example`.

Biến chính:

- `NEXT_PUBLIC_API_URL`: URL backend, ví dụ `http://localhost:8000`

## Các lệnh thường dùng

### Backend

```bash
cd backend

# chạy migration
alembic upgrade head

# format code
black app

# sắp xếp import
isort app

# kiểm tra lint Python
flake8 app
```

### Frontend

```bash
cd frontend

# chạy dev server
npm run dev

# lint
npm run lint

# type check
npx tsc --noEmit

# build production
npm run build
```

## Luồng khởi tạo database

Project dùng SQLite local tại:

```text
backend/library.db
```

Nguyên tắc:

1. File DB local không được commit.
2. Schema luôn được khởi tạo bằng Alembic.
3. Nếu xóa DB local, chỉ cần chạy lại:

```bash
cd backend
alembic upgrade head
```

4. Sau khi backend khởi động, tài khoản admin mặc định sẽ được tạo nếu chưa có.

## Ghi chú phát triển

- Chạy backend trước rồi mới chạy frontend.
- Không commit các file local như `.env`, `.env.local`, `library.db`, `.next`, `__pycache__`, `*.log`.
- Nếu backend không lên sau khi xóa DB local, hãy chạy lại migration trước khi start server.
- Nếu bạn đang dùng lệnh `uvicorn main:app`, repo hiện vẫn hỗ trợ để tương thích với cách chạy cũ.

## Ghi chú chất lượng mã nguồn

Project đã được dọn và chuẩn hóa theo các tiêu chí sau:

- Backend sạch theo `black`, `isort`, `flake8`
- Frontend sạch theo `ESLint` và `TypeScript`
- Không còn `console.log` debug trong source
- Không còn `any` trong source frontend
- API fetch logic được gom vào `frontend/lib/api.ts`

## Tóm tắt chạy nhanh

```bash
# Terminal 1
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# Terminal 2
cd frontend
npm install
copy .env.example .env.local
npm run dev
```
