"""initial_schema

Revision ID: 00b86611f800
Revises:
Create Date: 2026-03-19 13:37:55.538729

"""

from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "00b86611f800"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "CHUYEN_NGANH",
        sa.Column("ma_chuyen_nganh", sa.Text(), nullable=False),
        sa.Column("ten_chuyen_nganh", sa.Text(), nullable=False),
        sa.Column("mo_ta", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("ma_chuyen_nganh"),
    )
    op.create_table(
        "DOC_GIA",
        sa.Column("ma_doc_gia", sa.Text(), nullable=False),
        sa.Column("ho_ten", sa.Text(), nullable=False),
        sa.Column("lop", sa.Text(), nullable=False),
        sa.Column("ngay_sinh", sa.Text(), nullable=False),
        sa.Column("gioi_tinh", sa.Text(), nullable=False),
        sa.Column("trang_thai", sa.Text(), nullable=False),
        sa.CheckConstraint(
            "gioi_tinh IN ('nam', 'nu')",
            name="ck_doc_gia_gioi_tinh",
        ),
        sa.CheckConstraint(
            "trang_thai IN ('active', 'locked')",
            name="ck_doc_gia_trang_thai",
        ),
        sa.PrimaryKeyConstraint("ma_doc_gia"),
    )
    op.create_table(
        "NGUOI_DUNG",
        sa.Column("ma_nguoi_dung", sa.Text(), nullable=False),
        sa.Column("ho_ten", sa.Text(), nullable=False),
        sa.Column("tai_khoan", sa.Text(), nullable=False),
        sa.Column("mat_khau", sa.Text(), nullable=False),
        sa.Column("quyen", sa.Text(), nullable=False),
        sa.Column("trang_thai", sa.Text(), nullable=False),
        sa.CheckConstraint(
            "quyen IN ('admin', 'thu_thu')",
            name="ck_nguoi_dung_quyen",
        ),
        sa.CheckConstraint(
            "trang_thai IN ('active', 'inactive')",
            name="ck_nguoi_dung_trang_thai",
        ),
        sa.PrimaryKeyConstraint("ma_nguoi_dung"),
        sa.UniqueConstraint("tai_khoan"),
    )
    op.create_table(
        "DAU_SACH",
        sa.Column("ma_dau_sach", sa.Text(), nullable=False),
        sa.Column("ten_dau_sach", sa.Text(), nullable=False),
        sa.Column("nha_xuat_ban", sa.Text(), nullable=False),
        sa.Column("so_trang", sa.Integer(), nullable=False),
        sa.Column("kich_thuoc", sa.Text(), nullable=False),
        sa.Column("tac_gia", sa.Text(), nullable=False),
        sa.Column("so_luong", sa.Integer(), nullable=False),
        sa.Column("ma_chuyen_nganh", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(
            ["ma_chuyen_nganh"],
            ["CHUYEN_NGANH.ma_chuyen_nganh"],
        ),
        sa.PrimaryKeyConstraint("ma_dau_sach"),
    )
    op.create_table(
        "BAN_SAO",
        sa.Column("ma_sach", sa.Text(), nullable=False),
        sa.Column("ma_dau_sach", sa.Text(), nullable=False),
        sa.Column("tinh_trang", sa.Text(), nullable=False),
        sa.Column("ngay_nhap", sa.Text(), nullable=False),
        sa.CheckConstraint(
            "tinh_trang IN ('san_sang', 'dang_muon', 'hong')",
            name="ck_ban_sao_tinh_trang",
        ),
        sa.ForeignKeyConstraint(["ma_dau_sach"], ["DAU_SACH.ma_dau_sach"]),
        sa.PrimaryKeyConstraint("ma_sach"),
    )
    op.create_table(
        "PHIEU_MUON",
        sa.Column("ma_phieu", sa.Text(), nullable=False),
        sa.Column("ma_sach", sa.Text(), nullable=False),
        sa.Column("ma_doc_gia", sa.Text(), nullable=False),
        sa.Column("ma_thu_thu", sa.Text(), nullable=False),
        sa.Column("ngay_muon", sa.Text(), nullable=False),
        sa.Column("ngay_tra", sa.Text(), nullable=True),
        sa.Column("tinh_trang", sa.Text(), nullable=False),
        sa.CheckConstraint(
            "tinh_trang IN ('dang_muon', 'da_tra')",
            name="ck_phieu_muon_tinh_trang",
        ),
        sa.ForeignKeyConstraint(["ma_doc_gia"], ["DOC_GIA.ma_doc_gia"]),
        sa.ForeignKeyConstraint(["ma_sach"], ["BAN_SAO.ma_sach"]),
        sa.ForeignKeyConstraint(["ma_thu_thu"], ["NGUOI_DUNG.ma_nguoi_dung"]),
        sa.PrimaryKeyConstraint("ma_phieu"),
    )

    op.create_index(
        "ix_ban_sao_ma_dau_sach",
        "BAN_SAO",
        ["ma_dau_sach"],
        unique=False,
    )
    op.create_index(
        "ix_ban_sao_tinh_trang",
        "BAN_SAO",
        ["tinh_trang"],
        unique=False,
    )
    op.create_index(
        "ix_phieu_muon_ma_doc_gia",
        "PHIEU_MUON",
        ["ma_doc_gia"],
        unique=False,
    )
    op.create_index(
        "ix_phieu_muon_ma_sach",
        "PHIEU_MUON",
        ["ma_sach"],
        unique=False,
    )
    op.create_index(
        "ix_phieu_muon_tinh_trang",
        "PHIEU_MUON",
        ["tinh_trang"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_phieu_muon_tinh_trang", table_name="PHIEU_MUON")
    op.drop_index("ix_phieu_muon_ma_sach", table_name="PHIEU_MUON")
    op.drop_index("ix_phieu_muon_ma_doc_gia", table_name="PHIEU_MUON")
    op.drop_index("ix_ban_sao_tinh_trang", table_name="BAN_SAO")
    op.drop_index("ix_ban_sao_ma_dau_sach", table_name="BAN_SAO")

    op.drop_table("PHIEU_MUON")
    op.drop_table("BAN_SAO")
    op.drop_table("DAU_SACH")
    op.drop_table("NGUOI_DUNG")
    op.drop_table("DOC_GIA")
    op.drop_table("CHUYEN_NGANH")
