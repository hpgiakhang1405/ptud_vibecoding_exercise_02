# CONTEXT — Hệ thống Quản lý Thư viện

## Tech Stack
| Layer | Công nghệ |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | FastAPI (Python 3.11+) |
| Database | SQLite (file: `library.db`) |
| Auth | JWT — lưu trong httpOnly cookie |
| ORM | SQLAlchemy 2.x + Alembic (migration) |
| HTTP Client | Axios hoặc fetch (Next.js → FastAPI) |
| PDF Export | WeasyPrint (Python) hoặc react-pdf (Next.js) |

## Cấu trúc thư mục

### Backend (FastAPI)
```
backend/
  app/
    routers/
      auth.py
      doc_gia.py
      sach.py           # đầu sách + bản sao
      chuyen_nganh.py
      muon_tra.py
      bao_cao.py
      quan_tri.py       # admin only
    models.py           # SQLAlchemy models
    schemas.py          # Pydantic schemas
    database.py         # SQLite engine, session
    auth.py             # JWT utils, password hash
    dependencies.py     # get_current_user, require_admin
  main.py
  library.db
```

### Frontend (Next.js)
```
frontend/
  app/
    (auth)/
      login/page.tsx
    (main)/
      layout.tsx        # sidebar + auth guard
      doc-gia/page.tsx
      sach/page.tsx
      chuyen-nganh/page.tsx
      muon-tra/page.tsx
      bao-cao/page.tsx
      quan-tri/page.tsx  # admin only
  components/
  lib/
    api.ts              # axios instance, base URL
```

## API Convention
```
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/doc-gia
POST   /api/doc-gia
PUT    /api/doc-gia/{id}
DELETE /api/doc-gia/{id}

GET    /api/sach/dau-sach
POST   /api/sach/dau-sach
PUT    /api/sach/dau-sach/{id}
DELETE /api/sach/dau-sach/{id}

GET    /api/sach/ban-sao
POST   /api/sach/ban-sao
PUT    /api/sach/ban-sao/{id}
DELETE /api/sach/ban-sao/{id}

POST   /api/muon-tra/muon
PUT    /api/muon-tra/tra/{ma_phieu}
GET    /api/muon-tra/lich-su

GET    /api/bao-cao/sach-muon-nhieu
GET    /api/bao-cao/chua-tra
GET    /api/bao-cao/chua-tra/pdf

GET    /api/quan-tri/nguoi-dung        # admin only
POST   /api/quan-tri/nguoi-dung
PUT    /api/quan-tri/nguoi-dung/{id}
DELETE /api/quan-tri/nguoi-dung/{id}
```

## Error format
```json
{ "detail": "Mô tả lỗi", "code": "ERROR_CODE" }
```

## Phân quyền
| Nhóm route | Admin | Thủ thư |
|---|---|---|
| `/api/auth/*` | ✅ | ✅ |
| `/api/doc-gia/*` | ✅ | ✅ |
| `/api/sach/*` | ✅ | ✅ |
| `/api/chuyen-nganh/*` | ✅ | ✅ |
| `/api/muon-tra/*` | ✅ | ✅ |
| `/api/bao-cao/*` | ✅ | ✅ |
| `/api/quan-tri/*` | ✅ | ❌ |

## Conventions
- FastAPI: validate input bằng Pydantic, không xử lý logic ở router
- SQLite: luôn bật `PRAGMA foreign_keys = ON` khi mở connection
- Next.js: dùng Server Components mặc định, Client Component khi cần state/event
- Mọi API call từ Next.js đều gửi kèm cookie (credentials: 'include')

## Cách chạy
```bash
# Backend
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm install
npm run dev   # localhost:3000
```

## Trạng thái hiện tại
- [ ] Khởi tạo project backend + frontend
- [ ] Schema SQLite + migration
- [ ] Auth (login/logout/JWT)
- [ ] CRUD Chuyên ngành
- [ ] CRUD Đầu sách + Bản sao
- [ ] CRUD Độc giả
- [ ] Mượn / Trả sách
- [ ] Báo cáo + xuất PDF
- [ ] Quản trị tài khoản (Admin)
