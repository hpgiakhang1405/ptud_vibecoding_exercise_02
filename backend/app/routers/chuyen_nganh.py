from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.errors import (
    DUPLICATE_MAJOR_ID_ERROR,
    MAJOR_ID_IN_USE_ERROR,
    MAJOR_IN_USE_ERROR,
    MAJOR_NOT_FOUND_ERROR,
)
from app.models import ChuyenNganh, DauSach
from app.schemas import (
    ChuyenNganhCreate,
    ChuyenNganhResponse,
    ChuyenNganhUpdate,
    MessageResponse,
)

router = APIRouter(prefix="/api/chuyen-nganh", tags=["chuyen-nganh"])


@router.get("", response_model=list[ChuyenNganhResponse])
def list_chuyen_nganh(
    search: str | None = Query(default=None),
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ChuyenNganhResponse]:
    """List majors with optional keyword filtering."""
    query = db.query(ChuyenNganh)
    if search:
        pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ChuyenNganh.ma_chuyen_nganh.ilike(pattern),
                ChuyenNganh.ten_chuyen_nganh.ilike(pattern),
                ChuyenNganh.mo_ta.ilike(pattern),
            )
        )
    return query.order_by(ChuyenNganh.ten_chuyen_nganh.asc()).all()


@router.post(
    "",
    response_model=ChuyenNganhResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_chuyen_nganh(
    payload: ChuyenNganhCreate,
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ChuyenNganhResponse:
    """Create a new major."""
    existing = (
        db.query(ChuyenNganh)
        .filter(ChuyenNganh.ma_chuyen_nganh == payload.ma_chuyen_nganh)
        .first()
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=DUPLICATE_MAJOR_ID_ERROR,
        )

    chuyen_nganh = ChuyenNganh(
        ma_chuyen_nganh=payload.ma_chuyen_nganh.strip(),
        ten_chuyen_nganh=payload.ten_chuyen_nganh.strip(),
        mo_ta=payload.mo_ta.strip(),
    )
    db.add(chuyen_nganh)
    db.commit()
    db.refresh(chuyen_nganh)
    return chuyen_nganh


@router.put("/{item_id}", response_model=ChuyenNganhResponse)
def update_chuyen_nganh(
    item_id: str,
    payload: ChuyenNganhUpdate,
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ChuyenNganhResponse:
    """Update an existing major."""
    chuyen_nganh = (
        db.query(ChuyenNganh).filter(ChuyenNganh.ma_chuyen_nganh == item_id).first()
    )
    if chuyen_nganh is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=MAJOR_NOT_FOUND_ERROR,
        )

    if payload.ma_chuyen_nganh != item_id:
        duplicate = (
            db.query(ChuyenNganh)
            .filter(ChuyenNganh.ma_chuyen_nganh == payload.ma_chuyen_nganh)
            .first()
        )
        if duplicate is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=DUPLICATE_MAJOR_ID_ERROR,
            )

    if payload.ma_chuyen_nganh != item_id:
        in_use = db.query(DauSach).filter(DauSach.ma_chuyen_nganh == item_id).first()
        if in_use is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=MAJOR_ID_IN_USE_ERROR,
            )

    chuyen_nganh.ma_chuyen_nganh = payload.ma_chuyen_nganh.strip()
    chuyen_nganh.ten_chuyen_nganh = payload.ten_chuyen_nganh.strip()
    chuyen_nganh.mo_ta = payload.mo_ta.strip()
    db.commit()
    db.refresh(chuyen_nganh)
    return chuyen_nganh


@router.delete("/{item_id}", response_model=MessageResponse)
def delete_chuyen_nganh(
    item_id: str,
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MessageResponse:
    """Delete a major when it is no longer referenced."""
    chuyen_nganh = (
        db.query(ChuyenNganh).filter(ChuyenNganh.ma_chuyen_nganh == item_id).first()
    )
    if chuyen_nganh is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=MAJOR_NOT_FOUND_ERROR,
        )

    in_use = db.query(DauSach).filter(DauSach.ma_chuyen_nganh == item_id).first()
    if in_use is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=MAJOR_IN_USE_ERROR,
        )

    db.delete(chuyen_nganh)
    db.commit()
    return MessageResponse(detail="Xóa chuyên ngành thành công")
