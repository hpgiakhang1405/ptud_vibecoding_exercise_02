from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.constants import (
    COPY_STATUS_AVAILABLE,
    COPY_STATUS_BORROWED,
    LOAN_STATUS_BORROWED,
    LOAN_STATUS_RETURNED,
)
from app.database import get_db
from app.dependencies import get_current_user
from app.errors import (
    BOOK_NOT_AVAILABLE_ERROR,
    INVALID_BOOK_LOAN_DATA_ERROR,
    INVALID_LOAN_ERROR,
    READER_HAS_ACTIVE_LOAN_ERROR,
    READER_NOT_FOUND_ERROR,
)
from app.models import BanSao, DauSach, DocGia, NguoiDung, PhieuMuon
from app.schemas import AuthUser, PhieuMuonCreate, PhieuMuonResponse

router = APIRouter(prefix="/api/muon-tra", tags=["muon-tra"])


def serialize_phieu_muon(
    phieu_muon: PhieuMuon,
    doc_gia: DocGia,
    dau_sach: DauSach,
    thu_thu: NguoiDung,
) -> PhieuMuonResponse:
    """Convert a loan record into its API response shape."""
    return PhieuMuonResponse(
        ma_phieu=phieu_muon.ma_phieu,
        ma_sach=phieu_muon.ma_sach,
        ma_doc_gia=phieu_muon.ma_doc_gia,
        ma_thu_thu=phieu_muon.ma_thu_thu,
        ngay_muon=phieu_muon.ngay_muon,
        ngay_tra=phieu_muon.ngay_tra,
        tinh_trang=phieu_muon.tinh_trang,
        ho_ten_doc_gia=doc_gia.ho_ten,
        ten_sach=dau_sach.ten_dau_sach,
        ten_thu_thu=thu_thu.ho_ten,
    )


@router.post("/muon", response_model=PhieuMuonResponse, status_code=201)
def create_phieu_muon(
    payload: PhieuMuonCreate,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_user),
) -> PhieuMuonResponse:
    """Create a new borrowing transaction."""
    ban_sao = db.get(BanSao, payload.ma_sach)
    if ban_sao is None or ban_sao.tinh_trang != COPY_STATUS_AVAILABLE:
        raise HTTPException(
            status_code=400,
            detail=BOOK_NOT_AVAILABLE_ERROR,
        )

    doc_gia = db.get(DocGia, payload.ma_doc_gia)
    if doc_gia is None:
        raise HTTPException(status_code=404, detail=READER_NOT_FOUND_ERROR)

    active_loan = (
        db.query(PhieuMuon)
        .filter(
            PhieuMuon.ma_doc_gia == payload.ma_doc_gia,
            PhieuMuon.tinh_trang == LOAN_STATUS_BORROWED,
        )
        .first()
    )
    if active_loan is not None:
        raise HTTPException(
            status_code=400,
            detail=READER_HAS_ACTIVE_LOAN_ERROR,
        )

    dau_sach = db.get(DauSach, ban_sao.ma_dau_sach)
    thu_thu = db.get(NguoiDung, current_user.ma_nguoi_dung)
    if dau_sach is None or thu_thu is None:
        raise HTTPException(
            status_code=400,
            detail=INVALID_BOOK_LOAN_DATA_ERROR,
        )

    phieu_muon = PhieuMuon(
        ma_phieu=f"PM_{uuid4().hex[:10].upper()}",
        ma_sach=payload.ma_sach,
        ma_doc_gia=payload.ma_doc_gia,
        ma_thu_thu=current_user.ma_nguoi_dung,
        ngay_muon=datetime.now().date().isoformat(),
        ngay_tra=None,
        tinh_trang=LOAN_STATUS_BORROWED,
    )
    ban_sao.tinh_trang = COPY_STATUS_BORROWED

    db.add(phieu_muon)
    db.commit()
    db.refresh(phieu_muon)

    return serialize_phieu_muon(phieu_muon, doc_gia, dau_sach, thu_thu)


@router.put("/tra/{ma_phieu}", response_model=PhieuMuonResponse)
def tra_sach(
    ma_phieu: str,
    db: Session = Depends(get_db),
    _: AuthUser = Depends(get_current_user),
) -> PhieuMuonResponse:
    """Mark a borrowing transaction as returned."""
    phieu_muon = db.get(PhieuMuon, ma_phieu)
    if phieu_muon is None or phieu_muon.tinh_trang != LOAN_STATUS_BORROWED:
        raise HTTPException(
            status_code=400,
            detail=INVALID_LOAN_ERROR,
        )

    ban_sao = db.get(BanSao, phieu_muon.ma_sach)
    doc_gia = db.get(DocGia, phieu_muon.ma_doc_gia)
    thu_thu = db.get(NguoiDung, phieu_muon.ma_thu_thu)
    if ban_sao is None or doc_gia is None or thu_thu is None:
        raise HTTPException(
            status_code=400,
            detail=INVALID_LOAN_ERROR,
        )

    dau_sach = db.get(DauSach, ban_sao.ma_dau_sach)
    if dau_sach is None:
        raise HTTPException(
            status_code=400,
            detail=INVALID_LOAN_ERROR,
        )

    phieu_muon.tinh_trang = LOAN_STATUS_RETURNED
    phieu_muon.ngay_tra = datetime.now().date().isoformat()
    ban_sao.tinh_trang = COPY_STATUS_AVAILABLE

    db.commit()
    db.refresh(phieu_muon)

    return serialize_phieu_muon(phieu_muon, doc_gia, dau_sach, thu_thu)


@router.get("/lich-su", response_model=list[PhieuMuonResponse])
def lich_su_muon_tra(
    ma_doc_gia: str | None = None,
    ma_sach: str | None = None,
    tinh_trang: str | None = None,
    db: Session = Depends(get_db),
    _: AuthUser = Depends(get_current_user),
) -> list[PhieuMuonResponse]:
    """List borrowing history with optional filters."""
    query = (
        db.query(PhieuMuon, DocGia, DauSach, NguoiDung)
        .join(DocGia, DocGia.ma_doc_gia == PhieuMuon.ma_doc_gia)
        .join(BanSao, BanSao.ma_sach == PhieuMuon.ma_sach)
        .join(DauSach, DauSach.ma_dau_sach == BanSao.ma_dau_sach)
        .join(NguoiDung, NguoiDung.ma_nguoi_dung == PhieuMuon.ma_thu_thu)
    )

    if ma_doc_gia:
        query = query.filter(PhieuMuon.ma_doc_gia == ma_doc_gia)
    if ma_sach:
        query = query.filter(PhieuMuon.ma_sach == ma_sach)
    if tinh_trang:
        query = query.filter(PhieuMuon.tinh_trang == tinh_trang)

    rows = query.order_by(PhieuMuon.ngay_muon.desc(), PhieuMuon.ma_phieu.desc()).all()
    return [
        serialize_phieu_muon(phieu_muon, doc_gia, dau_sach, thu_thu)
        for phieu_muon, doc_gia, dau_sach, thu_thu in rows
    ]
