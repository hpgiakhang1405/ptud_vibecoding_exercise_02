from __future__ import annotations

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import decode_access_token
from app.constants import ACCESS_TOKEN_COOKIE_KEY, ACCOUNT_STATUS_ACTIVE, ROLE_ADMIN
from app.database import get_db
from app.errors import FORBIDDEN_ERROR, INVALID_TOKEN_ERROR, UNAUTHENTICATED_ERROR
from app.models import NguoiDung
from app.schemas import AuthUser


def get_current_user(
    access_token: str | None = Cookie(default=None, alias=ACCESS_TOKEN_COOKIE_KEY),
    db: Session = Depends(get_db),
) -> AuthUser:
    """Resolve the authenticated user from the access-token cookie."""
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=UNAUTHENTICATED_ERROR,
        )

    try:
        payload = decode_access_token(access_token)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_TOKEN_ERROR,
        ) from exc

    user = db.query(NguoiDung).filter(NguoiDung.ma_nguoi_dung == payload["sub"]).first()
    if user is None or user.trang_thai != ACCOUNT_STATUS_ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_TOKEN_ERROR,
        )

    return AuthUser(
        ma_nguoi_dung=user.ma_nguoi_dung,
        ho_ten=user.ho_ten,
        quyen=user.quyen,
    )


def require_admin(current_user: AuthUser = Depends(get_current_user)) -> AuthUser:
    """Ensure the current user has administrator privileges."""
    if current_user.quyen != ROLE_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=FORBIDDEN_ERROR,
        )
    return current_user
