from __future__ import annotations

import logging
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.auth import get_password_hash
from app.config import settings
from app.constants import ACCOUNT_STATUS_ACTIVE, ROLE_ADMIN
from app.database import SessionLocal
from app.errors import INTERNAL_ERROR
from app.models import NguoiDung
from app.routers import auth, bao_cao, chuyen_nganh, doc_gia, muon_tra, quan_tri, sach

logger = logging.getLogger(__name__)

app = FastAPI(title="Library Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(doc_gia.router)
app.include_router(sach.router)
app.include_router(chuyen_nganh.router)
app.include_router(muon_tra.router)
app.include_router(bao_cao.router)
app.include_router(quan_tri.router)


@app.on_event("startup")
def ensure_default_admin_exists() -> None:
    """Create the configured admin account when it does not exist."""
    db = SessionLocal()
    try:
        existing_admin = (
            db.query(NguoiDung)
            .filter(NguoiDung.tai_khoan == settings.admin_username)
            .first()
        )
        if existing_admin is not None:
            return

        db.add(
            NguoiDung(
                ma_nguoi_dung=f"ND_{uuid4().hex[:10].upper()}",
                ho_ten="Administrator",
                tai_khoan=settings.admin_username,
                mat_khau=get_password_hash(settings.admin_password),
                quyen=ROLE_ADMIN,
                trang_thai=ACCOUNT_STATUS_ACTIVE,
            )
        )
        db.commit()
    finally:
        db.close()


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    del request
    if isinstance(exc.detail, dict):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "detail": exc.detail.get("detail", "Yêu cầu không hợp lệ"),
                "code": exc.detail.get("code", f"HTTP_{exc.status_code}"),
            },
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": str(exc.detail), "code": f"HTTP_{exc.status_code}"},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    del request
    first_error = exc.errors()[0] if exc.errors() else None
    error_path = "request"
    error_message = "dữ liệu không hợp lệ"

    if first_error:
        location = [str(part) for part in first_error.get("loc", ()) if part != "body"]
        if location:
            error_path = ".".join(location)
        error_message = first_error.get("msg", error_message)

    return JSONResponse(
        status_code=422,
        content={
            "detail": f"Dữ liệu không hợp lệ: {error_path} {error_message}",
            "code": "VALIDATION_ERROR",
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception(
        "Unhandled exception while processing %s %s", request.method, request.url.path
    )
    return JSONResponse(
        status_code=500,
        content=INTERNAL_ERROR,
    )
