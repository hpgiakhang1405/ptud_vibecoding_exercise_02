from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.constants import COPY_STATUS_AVAILABLE, COPY_STATUS_BORROWED
from app.database import get_db
from app.dependencies import get_current_user
from app.errors import (
    BOOK_COPY_BORROWED_ERROR,
    BOOK_COPY_HAS_LOAN_HISTORY_ERROR,
    BOOK_COPY_NOT_FOUND_ERROR,
    BOOK_COPY_UPDATE_FORBIDDEN_ERROR,
    BOOK_TITLE_HAS_LOAN_HISTORY_ERROR,
    BOOK_TITLE_ID_IN_USE_ERROR,
    BOOK_TITLE_NOT_FOUND_ERROR,
    DUPLICATE_BOOK_TITLE_ID_ERROR,
    DUPLICATE_COPY_ID_ERROR,
    MAJOR_NOT_FOUND_ERROR,
)
from app.models import BanSao, ChuyenNganh, DauSach, PhieuMuon
from app.schemas import (
    BanSaoCreate,
    BanSaoResponse,
    BanSaoUpdate,
    DauSachCreate,
    DauSachDetailResponse,
    DauSachResponse,
    DauSachUpdate,
    MessageResponse,
)

router = APIRouter(prefix="/api/sach", tags=["sach"])


def _ensure_major_exists(db: Session, ma_chuyen_nganh: str) -> ChuyenNganh:
    """Ensure the referenced major exists before mutating books."""
    major = db.get(ChuyenNganh, ma_chuyen_nganh)
    if major is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=MAJOR_NOT_FOUND_ERROR,
        )
    return major


def _recalculate_book_quantity(db: Session, ma_dau_sach: str) -> None:
    """Synchronize the book quantity with the number of copies."""
    quantity = (
        db.query(func.count(BanSao.ma_sach))
        .filter(BanSao.ma_dau_sach == ma_dau_sach)
        .scalar()
    )
    dau_sach = db.query(DauSach).filter(DauSach.ma_dau_sach == ma_dau_sach).first()
    if dau_sach is not None:
        dau_sach.so_luong = int(quantity or 0)


def _build_dau_sach_response(item: DauSach) -> DauSachResponse:
    """Build the book title response payload."""
    return DauSachResponse(
        ma_dau_sach=item.ma_dau_sach,
        ten_dau_sach=item.ten_dau_sach,
        nha_xuat_ban=item.nha_xuat_ban,
        so_trang=item.so_trang,
        kich_thuoc=item.kich_thuoc,
        tac_gia=item.tac_gia,
        so_luong=item.so_luong,
        ma_chuyen_nganh=item.ma_chuyen_nganh,
        ten_chuyen_nganh=item.chuyen_nganh.ten_chuyen_nganh,
    )


def _build_ban_sao_response(item: BanSao) -> BanSaoResponse:
    """Build the book copy response payload."""
    return BanSaoResponse(
        ma_sach=item.ma_sach,
        ma_dau_sach=item.ma_dau_sach,
        ngay_nhap=item.ngay_nhap,
        tinh_trang=item.tinh_trang,
        ten_dau_sach=item.dau_sach.ten_dau_sach,
    )


@router.get("/dau-sach", response_model=list[DauSachResponse])
def list_dau_sach(
    search: str | None = Query(default=None),
    chuyen_nganh: str | None = Query(default=None),
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[DauSachResponse]:
    """List book titles with optional keyword and major filters."""
    query = db.query(DauSach).options(joinedload(DauSach.chuyen_nganh))
    if search:
        pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                DauSach.ten_dau_sach.ilike(pattern),
                DauSach.tac_gia.ilike(pattern),
            )
        )
    if chuyen_nganh:
        query = query.filter(DauSach.ma_chuyen_nganh == chuyen_nganh.strip())
    items = query.order_by(DauSach.ten_dau_sach.asc()).all()
    return [_build_dau_sach_response(item) for item in items]


@router.get("/dau-sach/{item_id}", response_model=DauSachDetailResponse)
def get_dau_sach_detail(
    item_id: str,
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DauSachDetailResponse:
    """Return a book title with all of its copies."""
    item = (
        db.query(DauSach)
        .options(joinedload(DauSach.chuyen_nganh))
        .filter(DauSach.ma_dau_sach == item_id)
        .first()
    )
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BOOK_TITLE_NOT_FOUND_ERROR,
        )
    detail = _build_dau_sach_response(item)
    copies = (
        db.query(BanSao)
        .options(joinedload(BanSao.dau_sach))
        .filter(BanSao.ma_dau_sach == item_id)
        .order_by(BanSao.ngay_nhap.desc(), BanSao.ma_sach.asc())
        .all()
    )
    return DauSachDetailResponse(
        **detail.model_dump(),
        ban_sao=[_build_ban_sao_response(copy) for copy in copies],
    )


@router.post(
    "/dau-sach",
    response_model=DauSachResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_dau_sach(
    payload: DauSachCreate,
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DauSachResponse:
    """Create a new book title."""
    duplicate = (
        db.query(DauSach).filter(DauSach.ma_dau_sach == payload.ma_dau_sach).first()
    )
    if duplicate is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=DUPLICATE_BOOK_TITLE_ID_ERROR,
        )

    major = _ensure_major_exists(db, payload.ma_chuyen_nganh.strip())
    item = DauSach(
        ma_dau_sach=payload.ma_dau_sach.strip(),
        ten_dau_sach=payload.ten_dau_sach.strip(),
        nha_xuat_ban=payload.nha_xuat_ban.strip(),
        so_trang=payload.so_trang,
        kich_thuoc=payload.kich_thuoc.strip(),
        tac_gia=payload.tac_gia.strip(),
        so_luong=0,
        ma_chuyen_nganh=major.ma_chuyen_nganh,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _build_dau_sach_response(item)


@router.put("/dau-sach/{item_id}", response_model=DauSachResponse)
def update_dau_sach(
    item_id: str,
    payload: DauSachUpdate,
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DauSachResponse:
    """Update an existing book title."""
    item = (
        db.query(DauSach)
        .options(joinedload(DauSach.chuyen_nganh))
        .filter(DauSach.ma_dau_sach == item_id)
        .first()
    )
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BOOK_TITLE_NOT_FOUND_ERROR,
        )

    if payload.ma_dau_sach != item_id:
        duplicate = (
            db.query(DauSach).filter(DauSach.ma_dau_sach == payload.ma_dau_sach).first()
        )
        if duplicate is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=DUPLICATE_BOOK_TITLE_ID_ERROR,
            )
        if db.query(BanSao).filter(BanSao.ma_dau_sach == item_id).first() is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=BOOK_TITLE_ID_IN_USE_ERROR,
            )

    major = _ensure_major_exists(db, payload.ma_chuyen_nganh.strip())
    item.ma_dau_sach = payload.ma_dau_sach.strip()
    item.ten_dau_sach = payload.ten_dau_sach.strip()
    item.nha_xuat_ban = payload.nha_xuat_ban.strip()
    item.so_trang = payload.so_trang
    item.kich_thuoc = payload.kich_thuoc.strip()
    item.tac_gia = payload.tac_gia.strip()
    item.ma_chuyen_nganh = major.ma_chuyen_nganh
    db.commit()
    db.refresh(item)
    return _build_dau_sach_response(item)


@router.delete("/dau-sach/{item_id}", response_model=MessageResponse)
def delete_dau_sach(
    item_id: str,
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MessageResponse:
    """Delete a book title when it has no protected references."""
    item = db.query(DauSach).filter(DauSach.ma_dau_sach == item_id).first()
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BOOK_TITLE_NOT_FOUND_ERROR,
        )

    borrowed_copy = (
        db.query(BanSao)
        .filter(
            BanSao.ma_dau_sach == item_id,
            BanSao.tinh_trang == COPY_STATUS_BORROWED,
        )
        .first()
    )
    if borrowed_copy is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=BOOK_COPY_BORROWED_ERROR,
        )

    copies = db.query(BanSao).filter(BanSao.ma_dau_sach == item_id).all()
    copy_ids = [copy.ma_sach for copy in copies]
    if copy_ids:
        if (
            db.query(PhieuMuon).filter(PhieuMuon.ma_sach.in_(copy_ids)).first()
            is not None
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=BOOK_TITLE_HAS_LOAN_HISTORY_ERROR,
            )
        for copy in copies:
            db.delete(copy)

    db.delete(item)
    db.commit()
    return MessageResponse(detail="Xóa đầu sách thành công")


@router.get("/ban-sao", response_model=list[BanSaoResponse])
def list_ban_sao(
    ma_dau_sach: str | None = Query(default=None),
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[BanSaoResponse]:
    """List book copies with optional book-title filtering."""
    query = db.query(BanSao).options(joinedload(BanSao.dau_sach))
    if ma_dau_sach:
        query = query.filter(BanSao.ma_dau_sach == ma_dau_sach.strip())
    items = query.order_by(BanSao.ngay_nhap.desc(), BanSao.ma_sach.asc()).all()
    return [_build_ban_sao_response(item) for item in items]


@router.get("/ban-sao/{item_id}", response_model=BanSaoResponse)
def get_ban_sao_detail(
    item_id: str,
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BanSaoResponse:
    """Return a single book copy."""
    item = (
        db.query(BanSao)
        .options(joinedload(BanSao.dau_sach))
        .filter(BanSao.ma_sach == item_id)
        .first()
    )
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BOOK_COPY_NOT_FOUND_ERROR,
        )
    return _build_ban_sao_response(item)


@router.post(
    "/ban-sao",
    response_model=BanSaoResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_ban_sao(
    payload: BanSaoCreate,
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BanSaoResponse:
    """Create a new book copy."""
    duplicate = db.query(BanSao).filter(BanSao.ma_sach == payload.ma_sach).first()
    if duplicate is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=DUPLICATE_COPY_ID_ERROR,
        )

    book = (
        db.query(DauSach)
        .options(joinedload(DauSach.chuyen_nganh))
        .filter(DauSach.ma_dau_sach == payload.ma_dau_sach)
        .first()
    )
    if book is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=BOOK_TITLE_NOT_FOUND_ERROR,
        )

    item = BanSao(
        ma_sach=payload.ma_sach.strip(),
        ma_dau_sach=payload.ma_dau_sach.strip(),
        tinh_trang=COPY_STATUS_AVAILABLE,
        ngay_nhap=payload.ngay_nhap.strip(),
    )
    db.add(item)
    db.flush()
    _recalculate_book_quantity(db, item.ma_dau_sach)
    db.commit()
    db.refresh(item)
    return _build_ban_sao_response(item)


@router.put("/ban-sao/{item_id}", response_model=BanSaoResponse)
def update_ban_sao(
    item_id: str,
    payload: BanSaoUpdate,
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BanSaoResponse:
    """Update a book copy status."""
    item = (
        db.query(BanSao)
        .options(joinedload(BanSao.dau_sach))
        .filter(BanSao.ma_sach == item_id)
        .first()
    )
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BOOK_COPY_NOT_FOUND_ERROR,
        )
    if item.tinh_trang == COPY_STATUS_BORROWED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=BOOK_COPY_UPDATE_FORBIDDEN_ERROR,
        )

    item.tinh_trang = payload.tinh_trang
    db.commit()
    db.refresh(item)
    return _build_ban_sao_response(item)


@router.delete("/ban-sao/{item_id}", response_model=MessageResponse)
def delete_ban_sao(
    item_id: str,
    _: object = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MessageResponse:
    """Delete a book copy without loan references."""
    item = db.query(BanSao).filter(BanSao.ma_sach == item_id).first()
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BOOK_COPY_NOT_FOUND_ERROR,
        )
    if item.tinh_trang == COPY_STATUS_BORROWED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=BOOK_COPY_BORROWED_ERROR,
        )
    if db.query(PhieuMuon).filter(PhieuMuon.ma_sach == item_id).first() is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=BOOK_COPY_HAS_LOAN_HISTORY_ERROR,
        )

    ma_dau_sach = item.ma_dau_sach
    db.delete(item)
    db.flush()
    _recalculate_book_quantity(db, ma_dau_sach)
    db.commit()
    return MessageResponse(detail="Xóa bản sao thành công")
