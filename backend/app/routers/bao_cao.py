from __future__ import annotations

from datetime import date
from io import BytesIO

from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.constants import LOAN_STATUS_BORROWED
from app.database import get_db
from app.dependencies import get_current_user
from app.models import BanSao, DauSach, DocGia, PhieuMuon
from app.schemas import BaoCaoChuaTraResponse, BaoCaoSachMuonNhieuResponse

router = APIRouter(
    prefix="/api/bao-cao",
    tags=["bao-cao"],
    dependencies=[Depends(get_current_user)],
)


def get_top_sach_muon_nhieu(
    db: Session,
    limit: int,
) -> list[BaoCaoSachMuonNhieuResponse]:
    """Build the top borrowed books report."""
    rows = (
        db.query(
            DauSach.ten_dau_sach,
            DauSach.tac_gia,
            func.count(PhieuMuon.ma_phieu).label("so_luot_muon"),
        )
        .join(BanSao, BanSao.ma_dau_sach == DauSach.ma_dau_sach)
        .join(PhieuMuon, PhieuMuon.ma_sach == BanSao.ma_sach)
        .group_by(DauSach.ma_dau_sach, DauSach.ten_dau_sach, DauSach.tac_gia)
        .order_by(desc("so_luot_muon"), DauSach.ten_dau_sach.asc())
        .limit(limit)
        .all()
    )

    return [
        BaoCaoSachMuonNhieuResponse(
            ten_dau_sach=ten_dau_sach,
            tac_gia=tac_gia,
            so_luot_muon=so_luot_muon,
        )
        for ten_dau_sach, tac_gia, so_luot_muon in rows
    ]


def get_ds_chua_tra(db: Session) -> list[BaoCaoChuaTraResponse]:
    """Build the overdue borrowed books report."""
    rows = (
        db.query(
            DocGia.ho_ten,
            DocGia.lop,
            DauSach.ten_dau_sach,
            BanSao.ma_sach,
            PhieuMuon.ngay_muon,
        )
        .join(DocGia, DocGia.ma_doc_gia == PhieuMuon.ma_doc_gia)
        .join(BanSao, BanSao.ma_sach == PhieuMuon.ma_sach)
        .join(DauSach, DauSach.ma_dau_sach == BanSao.ma_dau_sach)
        .filter(PhieuMuon.tinh_trang == LOAN_STATUS_BORROWED)
        .order_by(PhieuMuon.ngay_muon.asc(), DocGia.ho_ten.asc(), BanSao.ma_sach.asc())
        .all()
    )

    return [
        BaoCaoChuaTraResponse(
            ho_ten_doc_gia=ho_ten,
            lop=lop,
            ten_dau_sach=ten_dau_sach,
            ma_sach=ma_sach,
            ngay_muon=ngay_muon,
        )
        for ho_ten, lop, ten_dau_sach, ma_sach, ngay_muon in rows
    ]


def build_chua_tra_pdf(items: list[BaoCaoChuaTraResponse]) -> bytes:
    """Render the overdue report as a PDF document."""
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
    )

    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    title_style.fontName = "Helvetica-Bold"
    title_style.fontSize = 18
    title_style.leading = 22

    meta_style = styles["Normal"]
    meta_style.fontName = "Helvetica"
    meta_style.fontSize = 10
    meta_style.textColor = colors.HexColor("#475569")

    body_style = styles["BodyText"]
    body_style.fontName = "Helvetica"
    body_style.fontSize = 9
    body_style.leading = 12

    story = [
        Paragraph("Danh sach doc gia chua tra sach", title_style),
        Spacer(1, 4 * mm),
        Paragraph(f"Ngay xuat: {date.today().strftime('%d/%m/%Y')}", meta_style),
        Spacer(1, 8 * mm),
    ]

    table_data: list[list[str | Paragraph]] = [
        ["STT", "Ho ten doc gia", "Lop", "Ten sach", "Ma sach", "Ngay muon"]
    ]

    if items:
        for index, item in enumerate(items, start=1):
            table_data.append(
                [
                    str(index),
                    Paragraph(item.ho_ten_doc_gia, body_style),
                    Paragraph(item.lop, body_style),
                    Paragraph(item.ten_dau_sach, body_style),
                    Paragraph(item.ma_sach, body_style),
                    Paragraph(item.ngay_muon, body_style),
                ]
            )
    else:
        table_data.append(["", "Khong co doc gia dang muon sach.", "", "", "", ""])

    table = Table(
        table_data,
        colWidths=[12 * mm, 42 * mm, 20 * mm, 58 * mm, 24 * mm, 24 * mm],
        repeatRows=1,
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("LEADING", (0, 0), (-1, -1), 12),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (0, 0), (0, -1), "CENTER"),
                ("ALIGN", (4, 1), (5, -1), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )

    story.append(table)
    doc.build(story)
    return buffer.getvalue()


@router.get("/sach-muon-nhieu", response_model=list[BaoCaoSachMuonNhieuResponse])
def sach_muon_nhieu(
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[BaoCaoSachMuonNhieuResponse]:
    """Return the most borrowed book titles."""
    return get_top_sach_muon_nhieu(db, limit)


@router.get("/chua-tra", response_model=list[BaoCaoChuaTraResponse])
def doc_gia_chua_tra(
    db: Session = Depends(get_db),
) -> list[BaoCaoChuaTraResponse]:
    """Return readers with currently borrowed books."""
    return get_ds_chua_tra(db)


@router.get("/chua-tra/pdf")
def doc_gia_chua_tra_pdf(
    db: Session = Depends(get_db),
) -> Response:
    """Export the overdue report as a PDF file."""
    items = get_ds_chua_tra(db)
    pdf_bytes = build_chua_tra_pdf(items)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="bao-cao-doc-gia-chua-tra.pdf"'
        },
    )
