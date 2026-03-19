from __future__ import annotations


def error_detail(detail: str, code: str) -> dict[str, str]:
    return {"detail": detail, "code": code}


UNAUTHENTICATED_ERROR = error_detail("Chưa xác thực", "UNAUTHENTICATED")
INVALID_TOKEN_ERROR = error_detail("Token không hợp lệ", "INVALID_TOKEN")
FORBIDDEN_ERROR = error_detail("Không có quyền truy cập", "FORBIDDEN")
INVALID_CREDENTIALS_ERROR = error_detail(
    "Tài khoản hoặc mật khẩu không đúng",
    "INVALID_CREDENTIALS",
)
ACCOUNT_DISABLED_ERROR = error_detail(
    "Tài khoản đã bị vô hiệu hóa",
    "ACCOUNT_DISABLED",
)
MAJOR_NOT_FOUND_ERROR = error_detail("Không tìm thấy chuyên ngành", "MAJOR_NOT_FOUND")
DUPLICATE_MAJOR_ID_ERROR = error_detail(
    "Mã chuyên ngành đã tồn tại",
    "DUPLICATE_MAJOR_ID",
)
BOOK_TITLE_NOT_FOUND_ERROR = error_detail(
    "Không tìm thấy đầu sách",
    "BOOK_TITLE_NOT_FOUND",
)
BOOK_COPY_NOT_FOUND_ERROR = error_detail(
    "Không tìm thấy bản sao",
    "BOOK_COPY_NOT_FOUND",
)
INVALID_LOAN_ERROR = error_detail("Phiếu mượn không hợp lệ", "INVALID_LOAN")
USER_NOT_FOUND_ERROR = error_detail(
    "Không tìm thấy người dùng",
    "USER_NOT_FOUND",
)
READER_NOT_FOUND_ERROR = error_detail("Không tìm thấy độc giả", "READER_NOT_FOUND")
INTERNAL_ERROR = error_detail("Lỗi hệ thống, vui lòng thử lại", "INTERNAL_ERROR")
MAJOR_ID_IN_USE_ERROR = error_detail(
    "Không thể đổi mã chuyên ngành khi vẫn còn đầu sách đang sử dụng",
    "MAJOR_ID_IN_USE",
)
MAJOR_IN_USE_ERROR = error_detail(
    "Không thể xóa chuyên ngành đang được đầu sách sử dụng",
    "MAJOR_IN_USE",
)
READER_EXISTS_ERROR = error_detail("Mã độc giả đã tồn tại", "DOC_GIA_EXISTS")
READER_ID_IMMUTABLE_ERROR = error_detail(
    "Không được thay đổi mã độc giả",
    "DOC_GIA_ID_IMMUTABLE",
)
READER_HAS_ACTIVE_LOAN_ERROR = error_detail(
    "Không thể xóa độc giả đang có phiếu mượn chưa trả",
    "DOC_GIA_HAS_ACTIVE_LOAN",
)
BOOK_NOT_AVAILABLE_ERROR = error_detail("Sách không có sẵn", "BOOK_NOT_AVAILABLE")
INVALID_BOOK_LOAN_DATA_ERROR = error_detail(
    "Dữ liệu mượn sách không hợp lệ",
    "INVALID_BOOK_LOAN_DATA",
)
DUPLICATE_USERNAME_ERROR = error_detail("Tài khoản đã tồn tại", "DUPLICATE_USERNAME")
CANNOT_DELETE_SELF_ERROR = error_detail(
    "Không thể xóa tài khoản đang đăng nhập",
    "CANNOT_DELETE_SELF",
)
DUPLICATE_BOOK_TITLE_ID_ERROR = error_detail(
    "Mã đầu sách đã tồn tại",
    "DUPLICATE_BOOK_TITLE_ID",
)
BOOK_TITLE_ID_IN_USE_ERROR = error_detail(
    "Không thể đổi mã đầu sách khi vẫn còn bản sao liên kết",
    "BOOK_TITLE_ID_IN_USE",
)
BOOK_COPY_BORROWED_ERROR = error_detail(
    "Không thể xóa bản sao đang được mượn",
    "BOOK_COPY_BORROWED",
)
BOOK_COPY_UPDATE_FORBIDDEN_ERROR = error_detail(
    "Không thể cập nhật bản sao đang được mượn",
    "BOOK_COPY_BORROWED",
)
BOOK_COPY_HAS_LOAN_HISTORY_ERROR = error_detail(
    "Không thể xóa bản sao đã có lịch sử mượn trả",
    "BOOK_COPY_HAS_LOAN_HISTORY",
)
BOOK_TITLE_HAS_LOAN_HISTORY_ERROR = error_detail(
    "Không thể xóa đầu sách đã có lịch sử mượn trả",
    "BOOK_TITLE_HAS_LOAN_HISTORY",
)
DUPLICATE_COPY_ID_ERROR = error_detail("Mã bản sao đã tồn tại", "DUPLICATE_COPY_ID")
