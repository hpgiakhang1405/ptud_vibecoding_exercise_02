from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_password_hash
from app.database import get_db
from app.dependencies import require_admin
from app.errors import (
    CANNOT_DELETE_SELF_ERROR,
    DUPLICATE_USERNAME_ERROR,
    USER_NOT_FOUND_ERROR,
)
from app.models import NguoiDung
from app.schemas import (
    AuthUser,
    MessageResponse,
    NguoiDungCreate,
    NguoiDungResponse,
    NguoiDungUpdate,
)

router = APIRouter(
    prefix="/api/quan-tri",
    tags=["quan-tri"],
    dependencies=[Depends(require_admin)],
)


@router.get("/nguoi-dung", response_model=list[NguoiDungResponse])
def list_nguoi_dung(
    db: Session = Depends(get_db),
) -> list[NguoiDungResponse]:
    """List all user accounts."""
    users = (
        db.query(NguoiDung)
        .order_by(NguoiDung.ho_ten.asc(), NguoiDung.tai_khoan.asc())
        .all()
    )
    return [NguoiDungResponse.model_validate(user) for user in users]


@router.post("/nguoi-dung", response_model=NguoiDungResponse, status_code=201)
def create_nguoi_dung(
    payload: NguoiDungCreate,
    db: Session = Depends(get_db),
) -> NguoiDungResponse:
    """Create a new user account."""
    existing_user = (
        db.query(NguoiDung).filter(NguoiDung.tai_khoan == payload.tai_khoan).first()
    )
    if existing_user is not None:
        raise HTTPException(
            status_code=400,
            detail=DUPLICATE_USERNAME_ERROR,
        )

    user = NguoiDung(
        ma_nguoi_dung=f"ND_{uuid4().hex[:10].upper()}",
        ho_ten=payload.ho_ten,
        tai_khoan=payload.tai_khoan,
        mat_khau=get_password_hash(payload.mat_khau),
        quyen=payload.quyen,
        trang_thai=payload.trang_thai,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return NguoiDungResponse.model_validate(user)


@router.put("/nguoi-dung/{item_id}", response_model=NguoiDungResponse)
def update_nguoi_dung(
    item_id: str,
    payload: NguoiDungUpdate,
    db: Session = Depends(get_db),
) -> NguoiDungResponse:
    """Update a user account."""
    user = db.get(NguoiDung, item_id)
    if user is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND_ERROR)

    user.ho_ten = payload.ho_ten
    user.quyen = payload.quyen
    user.trang_thai = payload.trang_thai
    if payload.mat_khau:
        user.mat_khau = get_password_hash(payload.mat_khau)

    db.commit()
    db.refresh(user)
    return NguoiDungResponse.model_validate(user)


@router.delete("/nguoi-dung/{item_id}", response_model=MessageResponse)
def delete_nguoi_dung(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(require_admin),
) -> MessageResponse:
    """Delete a user account other than the current admin."""
    if item_id == current_user.ma_nguoi_dung:
        raise HTTPException(
            status_code=400,
            detail=CANNOT_DELETE_SELF_ERROR,
        )

    user = db.get(NguoiDung, item_id)
    if user is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND_ERROR)

    db.delete(user)
    db.commit()
    return MessageResponse(detail=f"Đã xóa người dùng {item_id}")
