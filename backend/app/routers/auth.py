from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.auth import create_access_token, verify_password
from app.config import settings
from app.constants import (
    ACCESS_TOKEN_COOKIE_KEY,
    ACCOUNT_STATUS_ACTIVE,
    COOKIE_HTTP_ONLY,
    COOKIE_SAMESITE_LAX,
    COOKIE_SECURE,
)
from app.database import get_db
from app.dependencies import get_current_user
from app.errors import ACCOUNT_DISABLED_ERROR, INVALID_CREDENTIALS_ERROR
from app.models import NguoiDung
from app.schemas import AuthUser, LoginRequest, LoginResponse, MessageResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> LoginResponse:
    """Authenticate a user and issue a session cookie."""
    user = db.query(NguoiDung).filter(NguoiDung.tai_khoan == payload.tai_khoan).first()
    if user is None or not verify_password(payload.mat_khau, user.mat_khau):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_CREDENTIALS_ERROR,
        )

    if user.trang_thai != ACCOUNT_STATUS_ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=ACCOUNT_DISABLED_ERROR,
        )

    token = create_access_token(subject=user.ma_nguoi_dung, role=user.quyen)
    response.set_cookie(
        key=ACCESS_TOKEN_COOKIE_KEY,
        value=token,
        httponly=COOKIE_HTTP_ONLY,
        samesite=COOKIE_SAMESITE_LAX,
        secure=COOKIE_SECURE,
        max_age=settings.access_token_expire_seconds,
    )
    return LoginResponse(
        ma_nguoi_dung=user.ma_nguoi_dung,
        ho_ten=user.ho_ten,
        quyen=user.quyen,
    )


@router.post("/logout", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def logout(
    response: Response,
    _: AuthUser = Depends(get_current_user),
) -> MessageResponse:
    """Clear the current authentication cookie."""
    response.delete_cookie(
        ACCESS_TOKEN_COOKIE_KEY,
        httponly=COOKIE_HTTP_ONLY,
        samesite=COOKIE_SAMESITE_LAX,
        secure=COOKIE_SECURE,
    )
    return MessageResponse(detail="Đăng xuất thành công")


@router.get("/me", response_model=AuthUser)
def me(current_user: AuthUser = Depends(get_current_user)) -> AuthUser:
    """Return the authenticated user profile."""
    return current_user
