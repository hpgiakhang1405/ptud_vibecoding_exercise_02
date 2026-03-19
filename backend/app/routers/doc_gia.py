from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.constants import LOAN_STATUS_BORROWED
from app.database import get_db
from app.dependencies import get_current_user
from app.errors import (
    READER_EXISTS_ERROR,
    READER_HAS_ACTIVE_LOAN_ERROR,
    READER_ID_IMMUTABLE_ERROR,
    READER_NOT_FOUND_ERROR,
)
from app.models import BanSao, DauSach, DocGia, PhieuMuon
from app.schemas import (
    DocGiaCreate,
    DocGiaDetailResponse,
    DocGiaResponse,
    DocGiaUpdate,
    LichSuMuonResponse,
    MessageResponse,
)

router = APIRouter(prefix="/api/doc-gia", tags=["doc-gia"])


@router.get("", response_model=list[DocGiaResponse])
def list_doc_gia(
    search: str | None = None,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
) -> list[DocGiaResponse]:
    """List readers with optional keyword filtering."""
    query = db.query(DocGia)
    if search and search.strip():
        keyword = f"%{search.strip()}%"
        query = query.filter(
            or_(DocGia.ho_ten.ilike(keyword), DocGia.lop.ilike(keyword))
        )

    return query.order_by(DocGia.ho_ten.asc()).all()


@router.get("/{item_id}", response_model=DocGiaDetailResponse)
def get_doc_gia_detail(
    item_id: str,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
) -> DocGiaDetailResponse:
    """Return a reader profile with loan history."""
    doc_gia = db.get(DocGia, item_id)
    if doc_gia is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=READER_NOT_FOUND_ERROR,
        )

    lich_su = (
        db.query(PhieuMuon, DauSach.ten_dau_sach)
        .join(BanSao, BanSao.ma_sach == PhieuMuon.ma_sach)
        .join(DauSach, DauSach.ma_dau_sach == BanSao.ma_dau_sach)
        .filter(PhieuMuon.ma_doc_gia == item_id)
        .order_by(PhieuMuon.ngay_muon.desc(), PhieuMuon.ma_phieu.desc())
        .all()
    )

    return DocGiaDetailResponse(
        ma_doc_gia=doc_gia.ma_doc_gia,
        ho_ten=doc_gia.ho_ten,
        lop=doc_gia.lop,
        ngay_sinh=doc_gia.ngay_sinh,
        gioi_tinh=doc_gia.gioi_tinh,
        trang_thai=doc_gia.trang_thai,
        lich_su_muon=[
            LichSuMuonResponse(
                ma_phieu=phieu.ma_phieu,
                ma_sach=phieu.ma_sach,
                ten_dau_sach=ten_dau_sach,
                ngay_muon=phieu.ngay_muon,
                ngay_tra=phieu.ngay_tra,
                tinh_trang=phieu.tinh_trang,
            )
            for phieu, ten_dau_sach in lich_su
        ],
    )


@router.post("", response_model=DocGiaResponse, status_code=201)
def create_doc_gia(
    payload: DocGiaCreate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
) -> DocGiaResponse:
    """Create a new reader."""
    if db.get(DocGia, payload.ma_doc_gia) is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=READER_EXISTS_ERROR,
        )

    doc_gia = DocGia(**payload.model_dump())
    db.add(doc_gia)
    db.commit()
    db.refresh(doc_gia)
    return doc_gia


@router.put("/{item_id}", response_model=DocGiaResponse)
def update_doc_gia(
    item_id: str,
    payload: DocGiaUpdate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
) -> DocGiaResponse:
    """Update reader information."""
    doc_gia = db.get(DocGia, item_id)
    if doc_gia is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=READER_NOT_FOUND_ERROR,
        )

    if payload.ma_doc_gia != item_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=READER_ID_IMMUTABLE_ERROR,
        )

    for field, value in payload.model_dump().items():
        setattr(doc_gia, field, value)

    db.commit()
    db.refresh(doc_gia)
    return doc_gia


@router.delete("/{item_id}", response_model=MessageResponse)
def delete_doc_gia(
    item_id: str,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
) -> MessageResponse:
    """Delete a reader without active loans."""
    doc_gia = db.get(DocGia, item_id)
    if doc_gia is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=READER_NOT_FOUND_ERROR,
        )

    active_loan = (
        db.query(PhieuMuon)
        .filter(
            PhieuMuon.ma_doc_gia == item_id,
            PhieuMuon.tinh_trang == LOAN_STATUS_BORROWED,
        )
        .first()
    )
    if active_loan is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=READER_HAS_ACTIVE_LOAN_ERROR,
        )

    db.delete(doc_gia)
    db.commit()
    return MessageResponse(detail="Xóa độc giả thành công")
