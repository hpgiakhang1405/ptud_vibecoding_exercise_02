from __future__ import annotations

from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.constants import (
    ACCOUNT_STATUS_ACTIVE,
    ACCOUNT_STATUS_INACTIVE,
    COPY_STATUS_AVAILABLE,
    COPY_STATUS_BORROWED,
    COPY_STATUS_DAMAGED,
    GENDER_FEMALE,
    GENDER_MALE,
    LOAN_STATUS_BORROWED,
    LOAN_STATUS_RETURNED,
    READER_STATUS_ACTIVE,
    READER_STATUS_LOCKED,
    ROLE_ADMIN,
    ROLE_THU_THU,
)
from app.database import Base


class NguoiDung(Base):
    __tablename__ = "NGUOI_DUNG"
    __table_args__ = (
        CheckConstraint(
            f"quyen IN ('{ROLE_ADMIN}', '{ROLE_THU_THU}')",
            name="ck_nguoi_dung_quyen",
        ),
        CheckConstraint(
            f"trang_thai IN ('{ACCOUNT_STATUS_ACTIVE}', '{ACCOUNT_STATUS_INACTIVE}')",
            name="ck_nguoi_dung_trang_thai",
        ),
    )

    ma_nguoi_dung: Mapped[str] = mapped_column(Text, primary_key=True)
    ho_ten: Mapped[str] = mapped_column(Text, nullable=False)
    tai_khoan: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    mat_khau: Mapped[str] = mapped_column(Text, nullable=False)
    quyen: Mapped[str] = mapped_column(Text, nullable=False)
    trang_thai: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default=ACCOUNT_STATUS_ACTIVE,
    )

    phieu_muon: Mapped[list["PhieuMuon"]] = relationship(back_populates="thu_thu")


class DocGia(Base):
    __tablename__ = "DOC_GIA"
    __table_args__ = (
        CheckConstraint(
            f"gioi_tinh IN ('{GENDER_MALE}', '{GENDER_FEMALE}')",
            name="ck_doc_gia_gioi_tinh",
        ),
        CheckConstraint(
            f"trang_thai IN ('{READER_STATUS_ACTIVE}', '{READER_STATUS_LOCKED}')",
            name="ck_doc_gia_trang_thai",
        ),
    )

    ma_doc_gia: Mapped[str] = mapped_column(Text, primary_key=True)
    ho_ten: Mapped[str] = mapped_column(Text, nullable=False)
    lop: Mapped[str] = mapped_column(Text, nullable=False)
    ngay_sinh: Mapped[str] = mapped_column(Text, nullable=False)
    gioi_tinh: Mapped[str] = mapped_column(Text, nullable=False)
    trang_thai: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default=READER_STATUS_ACTIVE,
    )

    phieu_muon: Mapped[list["PhieuMuon"]] = relationship(back_populates="doc_gia")


class ChuyenNganh(Base):
    __tablename__ = "CHUYEN_NGANH"

    ma_chuyen_nganh: Mapped[str] = mapped_column(Text, primary_key=True)
    ten_chuyen_nganh: Mapped[str] = mapped_column(Text, nullable=False)
    mo_ta: Mapped[str] = mapped_column(Text, nullable=False, default="")

    dau_sach: Mapped[list["DauSach"]] = relationship(back_populates="chuyen_nganh")


class DauSach(Base):
    __tablename__ = "DAU_SACH"

    ma_dau_sach: Mapped[str] = mapped_column(Text, primary_key=True)
    ten_dau_sach: Mapped[str] = mapped_column(Text, nullable=False)
    nha_xuat_ban: Mapped[str] = mapped_column(Text, nullable=False)
    so_trang: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    kich_thuoc: Mapped[str] = mapped_column(Text, nullable=False, default="")
    tac_gia: Mapped[str] = mapped_column(Text, nullable=False)
    so_luong: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    ma_chuyen_nganh: Mapped[str] = mapped_column(
        ForeignKey("CHUYEN_NGANH.ma_chuyen_nganh"), nullable=False
    )

    chuyen_nganh: Mapped[ChuyenNganh] = relationship(back_populates="dau_sach")
    ban_sao: Mapped[list["BanSao"]] = relationship(back_populates="dau_sach")


class BanSao(Base):
    __tablename__ = "BAN_SAO"
    __table_args__ = (
        CheckConstraint(
            (
                "tinh_trang IN "
                f"('{COPY_STATUS_AVAILABLE}', "
                f"'{COPY_STATUS_BORROWED}', "
                f"'{COPY_STATUS_DAMAGED}')"
            ),
            name="ck_ban_sao_tinh_trang",
        ),
        Index("ix_ban_sao_ma_dau_sach", "ma_dau_sach"),
        Index("ix_ban_sao_tinh_trang", "tinh_trang"),
    )

    ma_sach: Mapped[str] = mapped_column(Text, primary_key=True)
    ma_dau_sach: Mapped[str] = mapped_column(
        ForeignKey("DAU_SACH.ma_dau_sach"), nullable=False
    )
    tinh_trang: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default=COPY_STATUS_AVAILABLE,
    )
    ngay_nhap: Mapped[str] = mapped_column(Text, nullable=False)

    dau_sach: Mapped[DauSach] = relationship(back_populates="ban_sao")
    phieu_muon: Mapped[list["PhieuMuon"]] = relationship(back_populates="ban_sao")


class PhieuMuon(Base):
    __tablename__ = "PHIEU_MUON"
    __table_args__ = (
        CheckConstraint(
            f"tinh_trang IN ('{LOAN_STATUS_BORROWED}', '{LOAN_STATUS_RETURNED}')",
            name="ck_phieu_muon_tinh_trang",
        ),
        Index("ix_phieu_muon_ma_doc_gia", "ma_doc_gia"),
        Index("ix_phieu_muon_ma_sach", "ma_sach"),
        Index("ix_phieu_muon_tinh_trang", "tinh_trang"),
    )

    ma_phieu: Mapped[str] = mapped_column(Text, primary_key=True)
    ma_sach: Mapped[str] = mapped_column(ForeignKey("BAN_SAO.ma_sach"), nullable=False)
    ma_doc_gia: Mapped[str] = mapped_column(
        ForeignKey("DOC_GIA.ma_doc_gia"), nullable=False
    )
    ma_thu_thu: Mapped[str] = mapped_column(
        ForeignKey("NGUOI_DUNG.ma_nguoi_dung"), nullable=False
    )
    ngay_muon: Mapped[str] = mapped_column(Text, nullable=False)
    ngay_tra: Mapped[str | None] = mapped_column(Text, nullable=True)
    tinh_trang: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default=LOAN_STATUS_BORROWED,
    )

    ban_sao: Mapped[BanSao] = relationship(back_populates="phieu_muon")
    doc_gia: Mapped[DocGia] = relationship(back_populates="phieu_muon")
    thu_thu: Mapped[NguoiDung] = relationship(back_populates="phieu_muon")
