from __future__ import annotations

import argparse
import random
import sys
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.auth import get_password_hash  # noqa: E402
from app.config import settings  # noqa: E402
from app.constants import (  # noqa: E402
    ACCOUNT_STATUS_ACTIVE,
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
from app.database import SessionLocal  # noqa: E402
from app.models import (  # noqa: E402
    BanSao,
    ChuyenNganh,
    DauSach,
    DocGia,
    NguoiDung,
    PhieuMuon,
)

MAJOR_CATALOG: list[tuple[str, str, str]] = [
    (
        "CN001",
        "Công nghệ thông tin",
        "Chuyên ngành về lập trình, hệ thống và phần mềm.",
    ),
    (
        "CN002",
        "Khoa học dữ liệu",
        "Phân tích dữ liệu, thống kê ứng dụng và mô hình dự báo.",
    ),
    (
        "CN003",
        "An toàn thông tin",
        "Bảo mật hệ thống, kiểm thử và quản trị rủi ro số.",
    ),
    (
        "CN004",
        "Quản trị kinh doanh",
        "Kiến thức quản trị, vận hành doanh nghiệp và chiến lược.",
    ),
    (
        "CN005",
        "Tài chính ngân hàng",
        "Tài chính doanh nghiệp, đầu tư và nghiệp vụ ngân hàng.",
    ),
    (
        "CN006",
        "Marketing",
        "Truyền thông, thương hiệu và hành vi khách hàng.",
    ),
    ("CN007", "Kế toán", "Kế toán tài chính, thuế và kiểm toán cơ bản."),
    ("CN008", "Logistics", "Chuỗi cung ứng, kho vận và tối ưu vận hành."),
]

BOOK_CATALOG: dict[str, list[tuple[str, str]]] = {
    "CN001": [
        ("Kiến trúc phần mềm thực chiến", "Nguyễn Quốc Bình"),
        ("Lập trình Python ứng dụng", "Trần Minh Quân"),
        ("Thiết kế cơ sở dữ liệu", "Lê Thanh Phong"),
        ("Phát triển web hiện đại", "Phạm Nhật Minh"),
        ("Nhập môn kiểm thử phần mềm", "Đỗ Hải Nam"),
        ("Giải thuật và cấu trúc dữ liệu", "Vũ Thành Long"),
    ],
    "CN002": [
        ("Phân tích dữ liệu với Python", "Ngô Khánh Duy"),
        ("Thống kê ứng dụng cho dữ liệu", "Phan Hữu Tài"),
        ("Machine Learning căn bản", "Nguyễn Thanh Trúc"),
        ("Khai phá dữ liệu thực hành", "Trịnh Bảo Ngọc"),
        ("Trực quan hóa dữ liệu", "Hoàng Minh Tâm"),
    ],
    "CN003": [
        ("Nhập môn an toàn thông tin", "Bùi Thành Công"),
        ("Mạng máy tính và bảo mật", "Trần Đức Huy"),
        ("Kiểm thử xâm nhập cơ bản", "Lý Gia Hân"),
        ("Quản trị rủi ro an ninh mạng", "Nguyễn Khắc Duy"),
        ("Mật mã học ứng dụng", "Phạm Hải Yến"),
    ],
    "CN004": [
        ("Quản trị học hiện đại", "Nguyễn Phương Thảo"),
        ("Khởi nghiệp và đổi mới sáng tạo", "Lê Tuấn Khang"),
        ("Quản trị nhân sự", "Trần Thu Hà"),
        ("Hành vi tổ chức", "Phạm Hoàng Sơn"),
        ("Kỹ năng lãnh đạo", "Đặng Quỳnh Anh"),
    ],
    "CN005": [
        ("Tài chính doanh nghiệp", "Võ Đức Tài"),
        ("Nguyên lý đầu tư", "Nguyễn Minh Hiếu"),
        ("Ngân hàng thương mại", "Lâm Quốc Hưng"),
        ("Phân tích báo cáo tài chính", "Trần Thị Bích"),
        ("Quản trị vốn lưu động", "Phan Hoài Nam"),
    ],
    "CN006": [
        ("Marketing căn bản", "Nguyễn Thu Phương"),
        ("Hành vi người tiêu dùng", "Đỗ Thanh Hằng"),
        ("Truyền thông số", "Lê Bảo Anh"),
        ("Quản trị thương hiệu", "Trần Nam Anh"),
        ("Content Marketing thực hành", "Võ Hữu Tâm"),
    ],
    "CN007": [
        ("Nguyên lý kế toán", "Trịnh Mỹ Linh"),
        ("Kế toán tài chính", "Nguyễn Hải Đăng"),
        ("Kế toán quản trị", "Phạm Khánh Ly"),
        ("Thuế và khai báo thuế", "Đoàn Thanh Tùng"),
        ("Kiểm toán căn bản", "Bùi Ngọc Trâm"),
    ],
    "CN008": [
        ("Quản trị chuỗi cung ứng", "Lê Quốc Khánh"),
        ("Nghiệp vụ logistics", "Nguyễn Hoàng Yến"),
        ("Quản trị kho vận", "Trần Khả Hân"),
        ("Vận tải đa phương thức", "Phạm Đức Vinh"),
        ("Tối ưu vận hành", "Ngô Minh Đức"),
    ],
}

PUBLISHERS = [
    "NXB Đại học Quốc gia TP.HCM",
    "NXB Khoa học và Kỹ thuật",
    "NXB Lao động",
    "NXB Tổng hợp TP.HCM",
    "NXB Tài chính",
    "NXB Thống kê",
]

BOOK_SIZES = ["14x20.5 cm", "16x24 cm", "13x19 cm", "19x27 cm"]
FIRST_NAMES_MALE = [
    "An",
    "Bảo",
    "Đạt",
    "Duy",
    "Hiếu",
    "Hùng",
    "Khang",
    "Long",
    "Minh",
    "Nam",
    "Phúc",
    "Quân",
    "Sơn",
    "Tài",
    "Tuấn",
    "Việt",
]
FIRST_NAMES_FEMALE = [
    "Anh",
    "Chi",
    "Giang",
    "Hà",
    "Hân",
    "Khánh",
    "Lan",
    "Linh",
    "My",
    "Ngân",
    "Ngọc",
    "Như",
    "Phương",
    "Thảo",
    "Trang",
    "Vy",
]
MIDDLE_NAMES = ["Ngọc", "Thanh", "Minh", "Hoài", "Quỳnh", "Thu", "Hải", "Gia"]
LAST_NAMES = [
    "Nguyễn",
    "Trần",
    "Lê",
    "Phạm",
    "Hoàng",
    "Huỳnh",
    "Phan",
    "Võ",
    "Đặng",
    "Bùi",
]
CLASS_PREFIXES = ["CTK", "DHK", "QTKD", "DATA", "ATTT", "KETOAN", "MKT", "LOG"]
STAFF_NAMES = [
    "Nguyễn Hoàng Anh",
    "Trần Minh Tâm",
    "Lê Phương Linh",
    "Phạm Quốc Huy",
    "Đỗ Thanh Mai",
    "Võ Tuấn Kiệt",
    "Ngô Bảo Trâm",
]


@dataclass
class GenerationResult:
    majors: int = 0
    titles: int = 0
    copies: int = 0
    readers: int = 0
    staff: int = 0
    active_loans: int = 0
    returned_loans: int = 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Sinh dữ liệu test thực tế cho hệ thống quản lý thư viện."
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Xóa dữ liệu nghiệp vụ hiện tại trước khi generate lại.",
    )
    parser.add_argument(
        "--seed", type=int, default=20260320, help="Seed để tái tạo dataset."
    )
    parser.add_argument(
        "--readers", type=int, default=120, help="Số lượng độc giả cần tạo."
    )
    parser.add_argument(
        "--staff", type=int, default=5, help="Số lượng thủ thư cần tạo."
    )
    parser.add_argument(
        "--copies-min",
        type=int,
        default=2,
        help="Số bản sao tối thiểu mỗi đầu sách.",
    )
    parser.add_argument(
        "--copies-max",
        type=int,
        default=5,
        help="Số bản sao tối đa mỗi đầu sách.",
    )
    parser.add_argument(
        "--active-loans",
        type=int,
        default=28,
        help="Số phiếu mượn đang mượn.",
    )
    parser.add_argument(
        "--returned-loans",
        type=int,
        default=140,
        help="Số phiếu mượn đã trả.",
    )
    parser.add_argument(
        "--user-password",
        type=str,
        default="Test@123",
        help="Mật khẩu mặc định cho các tài khoản thủ thư được sinh.",
    )
    return parser.parse_args()


def build_reader_name(rng: random.Random, gender: str) -> str:
    first_name_pool = FIRST_NAMES_MALE if gender == GENDER_MALE else FIRST_NAMES_FEMALE
    return (
        f"{rng.choice(LAST_NAMES)} "
        f"{rng.choice(MIDDLE_NAMES)} "
        f"{rng.choice(first_name_pool)}"
    )


def build_class_name(rng: random.Random, index: int) -> str:
    prefix = CLASS_PREFIXES[index % len(CLASS_PREFIXES)]
    year = rng.choice([21, 22, 23, 24, 25])
    group = chr(ord("A") + (index % 5))
    return f"{prefix}{year}{group}"


def random_birth_date(rng: random.Random) -> str:
    start = date(2002, 1, 1)
    end = date(2007, 12, 31)
    return (start + timedelta(days=rng.randint(0, (end - start).days))).isoformat()


def random_recent_date(
    rng: random.Random, from_days_ago: int, to_days_ago: int
) -> str:
    today = date.today()
    delta = rng.randint(from_days_ago, to_days_ago)
    return (today - timedelta(days=delta)).isoformat()


def reset_business_data(session) -> None:
    session.query(PhieuMuon).delete()
    session.query(BanSao).delete()
    session.query(DauSach).delete()
    session.query(DocGia).delete()
    session.query(ChuyenNganh).delete()
    session.query(NguoiDung).filter(
        NguoiDung.tai_khoan != settings.admin_username
    ).delete()
    session.commit()


def ensure_clean_state(session, reset: bool) -> None:
    has_business_data = any(
        [
            session.query(ChuyenNganh).first(),
            session.query(DocGia).first(),
            session.query(DauSach).first(),
            session.query(BanSao).first(),
            session.query(PhieuMuon).first(),
        ]
    )
    if has_business_data and not reset:
        raise SystemExit(
            "Database đã có dữ liệu nghiệp vụ. "
            "Hãy chạy lại với --reset để generate lại an toàn."
        )
    if reset:
        reset_business_data(session)


def ensure_default_admin(session) -> None:
    existing_admin = (
        session.query(NguoiDung)
        .filter(NguoiDung.tai_khoan == settings.admin_username)
        .first()
    )
    if existing_admin is not None:
        return

    session.add(
        NguoiDung(
            ma_nguoi_dung="ND_ADMIN_DEFAULT",
            ho_ten="Administrator",
            tai_khoan=settings.admin_username,
            mat_khau=get_password_hash(settings.admin_password),
            quyen=ROLE_ADMIN,
            trang_thai=ACCOUNT_STATUS_ACTIVE,
        )
    )
    session.flush()


def create_staff(
    session, rng: random.Random, count: int, password: str
) -> list[NguoiDung]:
    staff_users: list[NguoiDung] = []
    hashed_password = get_password_hash(password)
    for index in range(count):
        user = NguoiDung(
            ma_nguoi_dung=f"ND_GEN_{index + 1:03d}",
            ho_ten=STAFF_NAMES[index % len(STAFF_NAMES)],
            tai_khoan=f"thuthu{index + 1:02d}",
            mat_khau=hashed_password,
            quyen=ROLE_THU_THU,
            trang_thai=ACCOUNT_STATUS_ACTIVE,
        )
        session.add(user)
        staff_users.append(user)
    session.flush()
    return staff_users


def create_majors(session) -> list[ChuyenNganh]:
    majors: list[ChuyenNganh] = []
    for major_id, name, description in MAJOR_CATALOG:
        major = ChuyenNganh(
            ma_chuyen_nganh=major_id,
            ten_chuyen_nganh=name,
            mo_ta=description,
        )
        session.add(major)
        majors.append(major)
    session.flush()
    return majors


def create_titles_and_copies(
    session,
    rng: random.Random,
    copies_min: int,
    copies_max: int,
) -> tuple[list[DauSach], list[BanSao]]:
    titles: list[DauSach] = []
    copies: list[BanSao] = []

    title_index = 1
    copy_index = 1
    for major_id, catalog in BOOK_CATALOG.items():
        for title_name, author in catalog:
            title = DauSach(
                ma_dau_sach=f"DS{title_index:04d}",
                ten_dau_sach=title_name,
                nha_xuat_ban=rng.choice(PUBLISHERS),
                so_trang=rng.randint(160, 520),
                kich_thuoc=rng.choice(BOOK_SIZES),
                tac_gia=author,
                so_luong=0,
                ma_chuyen_nganh=major_id,
            )
            session.add(title)
            titles.append(title)

            copy_count = rng.randint(copies_min, copies_max)
            title.so_luong = copy_count
            for _ in range(copy_count):
                copy = BanSao(
                    ma_sach=f"MS{copy_index:05d}",
                    ma_dau_sach=title.ma_dau_sach,
                    tinh_trang=COPY_STATUS_AVAILABLE,
                    ngay_nhap=random_recent_date(rng, 120, 900),
                )
                session.add(copy)
                copies.append(copy)
                copy_index += 1

            title_index += 1

    session.flush()
    return titles, copies


def create_readers(session, rng: random.Random, count: int) -> list[DocGia]:
    readers: list[DocGia] = []
    for index in range(count):
        gender = GENDER_MALE if rng.random() < 0.48 else GENDER_FEMALE
        reader = DocGia(
            ma_doc_gia=f"DG{index + 1:04d}",
            ho_ten=build_reader_name(rng, gender),
            lop=build_class_name(rng, index),
            ngay_sinh=random_birth_date(rng),
            gioi_tinh=gender,
            trang_thai=(
                READER_STATUS_LOCKED
                if rng.random() < 0.08
                else READER_STATUS_ACTIVE
            ),
        )
        session.add(reader)
        readers.append(reader)
    session.flush()
    return readers


def create_active_loans(
    session,
    rng: random.Random,
    readers: list[DocGia],
    copies: list[BanSao],
    staff_users: list[NguoiDung],
    target_count: int,
) -> int:
    eligible_readers = [
        reader for reader in readers if reader.trang_thai == READER_STATUS_ACTIVE
    ]
    rng.shuffle(eligible_readers)
    available_copies = [
        copy for copy in copies if copy.tinh_trang == COPY_STATUS_AVAILABLE
    ]
    rng.shuffle(available_copies)
    loan_count = min(target_count, len(eligible_readers), len(available_copies))

    for index in range(loan_count):
        reader = eligible_readers[index]
        copy = available_copies[index]
        borrow_date = random_recent_date(rng, 1, 45)
        loan = PhieuMuon(
            ma_phieu=f"PMA{index + 1:05d}",
            ma_sach=copy.ma_sach,
            ma_doc_gia=reader.ma_doc_gia,
            ma_thu_thu=rng.choice(staff_users).ma_nguoi_dung,
            ngay_muon=borrow_date,
            ngay_tra=None,
            tinh_trang=LOAN_STATUS_BORROWED,
        )
        copy.tinh_trang = COPY_STATUS_BORROWED
        session.add(loan)

    session.flush()
    return loan_count


def create_returned_loans(
    session,
    rng: random.Random,
    readers: list[DocGia],
    copies: list[BanSao],
    staff_users: list[NguoiDung],
    target_count: int,
) -> int:
    returned_count = 0
    for index in range(target_count):
        copy = rng.choice(copies)
        reader = rng.choice(readers)
        borrow_days_ago = rng.randint(20, 360)
        return_gap = rng.randint(2, 20)
        borrow_date = date.today() - timedelta(days=borrow_days_ago)
        return_date = min(
            date.today() - timedelta(days=1), borrow_date + timedelta(days=return_gap)
        )
        if return_date <= borrow_date:
            return_date = borrow_date + timedelta(days=1)

        loan = PhieuMuon(
            ma_phieu=f"PMR{index + 1:05d}",
            ma_sach=copy.ma_sach,
            ma_doc_gia=reader.ma_doc_gia,
            ma_thu_thu=rng.choice(staff_users).ma_nguoi_dung,
            ngay_muon=borrow_date.isoformat(),
            ngay_tra=return_date.isoformat(),
            tinh_trang=LOAN_STATUS_RETURNED,
        )
        session.add(loan)
        returned_count += 1

    damaged_candidates = [
        copy for copy in copies if copy.tinh_trang == COPY_STATUS_AVAILABLE
    ]
    rng.shuffle(damaged_candidates)
    damaged_count = max(3, len(copies) // 20)
    for copy in damaged_candidates[:damaged_count]:
        copy.tinh_trang = COPY_STATUS_DAMAGED

    session.flush()
    return returned_count


def generate_data(args: argparse.Namespace) -> GenerationResult:
    rng = random.Random(args.seed)
    result = GenerationResult()
    session = SessionLocal()

    try:
        ensure_clean_state(session, args.reset)
        ensure_default_admin(session)

        majors = create_majors(session)
        titles, copies = create_titles_and_copies(
            session,
            rng,
            copies_min=args.copies_min,
            copies_max=args.copies_max,
        )
        readers = create_readers(session, rng, args.readers)
        staff_users = create_staff(session, rng, args.staff, args.user_password)
        active_loans = create_active_loans(
            session,
            rng,
            readers,
            copies,
            staff_users,
            args.active_loans,
        )
        returned_loans = create_returned_loans(
            session,
            rng,
            readers,
            copies,
            staff_users,
            args.returned_loans,
        )

        session.commit()

        result.majors = len(majors)
        result.titles = len(titles)
        result.copies = len(copies)
        result.readers = len(readers)
        result.staff = len(staff_users)
        result.active_loans = active_loans
        result.returned_loans = returned_loans
        return result
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def main() -> None:
    args = parse_args()
    if args.copies_min < 1 or args.copies_max < args.copies_min:
        raise SystemExit("--copies-min/--copies-max không hợp lệ.")

    result = generate_data(args)
    print("Da generate xong du lieu test.")
    print(f"- Chuyen nganh: {result.majors}")
    print(f"- Dau sach: {result.titles}")
    print(f"- Ban sao: {result.copies}")
    print(f"- Doc gia: {result.readers}")
    print(f"- Thu thu: {result.staff}")
    print(f"- Phieu muon dang muon: {result.active_loans}")
    print(f"- Phieu muon da tra: {result.returned_loans}")
    print(
        "- Tai khoan admin mac dinh van su dung theo backend/.env: "
        f"{settings.admin_username}"
    )
    print(f"- Mat khau mac dinh cua tai khoan thu thu moi: {args.user_password}")


if __name__ == "__main__":
    main()
