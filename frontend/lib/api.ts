import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import type { AxiosRequestConfig } from "axios";

import { API_BASE_URL } from "@/lib/env";
import { persistToast, showToast } from "@/lib/toast";
import type {
  AuthUser,
  BookCopy,
  BookPayload,
  BookTitle,
  BorrowPayload,
  CopyFormValues,
  CreateCopyPayload,
  CreateUserPayload,
  LoanItem,
  LoanStatus,
  Major,
  MajorFormValues,
  ReaderFormValues,
  ReaderPreview,
  ReaderRecord,
  TopBookItem,
  UnreturnedLoanItem,
  UpdateCopyPayload,
  UpdateUserPayload,
  UserItem,
} from "@/lib/types";

type ApiErrorBody = {
  detail?: string;
  code?: string;
};

type ApiRequestConfig<D = unknown> = AxiosRequestConfig<D> & {
  _skipGlobalErrorHandler?: boolean;
  _skipAuthRedirect?: boolean;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirectingToLogin = false;

async function parseErrorBody(data: unknown): Promise<ApiErrorBody | null> {
  if (!data) {
    return null;
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    return data as ApiErrorBody;
  }

  if (
    typeof Blob !== "undefined" &&
    data instanceof Blob &&
    data.type.includes("application/json")
  ) {
    try {
      const rawText = await data.text();
      return JSON.parse(rawText) as ApiErrorBody;
    } catch {
      return null;
    }
  }

  return null;
}

function extractApiErrorMessage(error: AxiosError<ApiErrorBody>, fallback: string) {
  const detail = error.response?.data?.detail;
  return typeof detail === "string" && detail.trim() ? detail : fallback;
}

async function redirectToLogin() {
  if (typeof window === "undefined" || isRedirectingToLogin) {
    return;
  }

  isRedirectingToLogin = true;
  persistToast("Phiên đăng nhập hết hạn", "error");

  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Ignore logout cleanup failures and still force client back to login.
  }

  window.location.replace("/login");
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const requestConfig = error.config as ApiRequestConfig | undefined;
    if (!error.response) {
      showToast("Không thể kết nối đến server", "error");
      return Promise.reject(error);
    }

    const parsedBody = await parseErrorBody(error.response.data);
    if (parsedBody) {
      error.response.data = parsedBody;
    }

    const status = error.response.status;

    if (status === 401 && !requestConfig?._skipAuthRedirect) {
      await redirectToLogin();
      return Promise.reject(error);
    }

    if (status >= 500) {
      showToast("Lỗi hệ thống, vui lòng thử lại", "error");
      return Promise.reject(error);
    }

    if (requestConfig?._skipGlobalErrorHandler) {
      return Promise.reject(error);
    }

    if (status === 403) {
      showToast("Bạn không có quyền thực hiện thao tác này", "error");
      return Promise.reject(error);
    }

    if (status === 422) {
      showToast(extractApiErrorMessage(error, "Dữ liệu không hợp lệ"), "error");
      return Promise.reject(error);
    }

    const fallbackMessage =
      parsedBody?.detail && parsedBody.detail.trim()
        ? parsedBody.detail
        : "Yêu cầu không thành công";
    showToast(fallbackMessage, "error");
    return Promise.reject(error);
  },
);

export async function apiRequest<T>(request: Promise<AxiosResponse<T>>) {
  try {
    return await request;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return null;
    }
    throw error;
  }
}

async function apiRequestData<T>(request: Promise<AxiosResponse<T>>) {
  const response = await apiRequest(request);
  return response?.data ?? null;
}

async function apiRequestSuccess(request: Promise<AxiosResponse<unknown>>) {
  const response = await apiRequest(request);
  return Boolean(response);
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return extractApiErrorMessage(error, fallback);
  }
  return fallback;
}

type LoginPayload = {
  tai_khoan: string;
  mat_khau: string;
};

export async function login(payload: LoginPayload) {
  const config: ApiRequestConfig<LoginPayload> = {
    _skipGlobalErrorHandler: true,
    _skipAuthRedirect: true,
  };
  await api.post("/api/auth/login", payload, config);
}

export async function logout() {
  await api.post("/api/auth/logout");
}

export async function fetchCurrentUser() {
  const response = await api.get<AuthUser>("/api/auth/me");
  return response.data;
}

export async function fetchTopBooksReport() {
  return apiRequestData(api.get<TopBookItem[]>("/api/bao-cao/sach-muon-nhieu"));
}

export async function fetchUnreturnedLoansReport() {
  return apiRequestData(api.get<UnreturnedLoanItem[]>("/api/bao-cao/chua-tra"));
}

export async function exportUnreturnedLoansPdf() {
  return apiRequestData(
    api.get<Blob>("/api/bao-cao/chua-tra/pdf", {
      responseType: "blob",
    }),
  );
}

export async function listMajors(search?: string) {
  return apiRequestData(
    api.get<Major[]>("/api/chuyen-nganh", {
      params: search?.trim() ? { search: search.trim() } : undefined,
    }),
  );
}

export async function createMajor(payload: MajorFormValues) {
  return apiRequestSuccess(api.post("/api/chuyen-nganh", payload));
}

export async function updateMajor(id: string, payload: MajorFormValues) {
  return apiRequestSuccess(api.put(`/api/chuyen-nganh/${id}`, payload));
}

export async function deleteMajor(id: string) {
  return apiRequestSuccess(api.delete(`/api/chuyen-nganh/${id}`));
}

export async function listReaders(search?: string) {
  return apiRequestData(
    api.get<ReaderRecord[]>("/api/doc-gia", {
      params: search?.trim() ? { search: search.trim() } : undefined,
    }),
  );
}

export async function getReaderById(id: string) {
  const config: ApiRequestConfig = {
    _skipGlobalErrorHandler: true,
  };
  const response = await api.get<ReaderPreview>(`/api/doc-gia/${id}`, config);
  return response.data;
}

export const fetchReaderPreview = getReaderById;

export async function createReader(payload: ReaderFormValues) {
  return apiRequestSuccess(api.post("/api/doc-gia", payload));
}

export async function updateReader(id: string, payload: ReaderFormValues) {
  return apiRequestSuccess(api.put(`/api/doc-gia/${id}`, payload));
}

export async function deleteReader(id: string) {
  return apiRequestSuccess(api.delete(`/api/doc-gia/${id}`));
}

export async function listUsers() {
  return apiRequestData(api.get<UserItem[]>("/api/quan-tri/nguoi-dung"));
}

export async function createUser(payload: CreateUserPayload) {
  return apiRequestSuccess(api.post("/api/quan-tri/nguoi-dung", payload));
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  return apiRequestSuccess(api.put(`/api/quan-tri/nguoi-dung/${id}`, payload));
}

export async function deleteUser(id: string) {
  return apiRequestSuccess(api.delete(`/api/quan-tri/nguoi-dung/${id}`));
}

export async function listBookTitles(search?: string, majorId?: string) {
  return apiRequestData(
    api.get<BookTitle[]>("/api/sach/dau-sach", {
      params: {
        ...(search?.trim() ? { search: search.trim() } : {}),
        ...(majorId ? { chuyen_nganh: majorId } : {}),
      },
    }),
  );
}

export async function createBookTitle(payload: BookPayload) {
  return apiRequestSuccess(api.post("/api/sach/dau-sach", payload));
}

export async function updateBookTitle(id: string, payload: BookPayload) {
  return apiRequestSuccess(api.put(`/api/sach/dau-sach/${id}`, payload));
}

export async function deleteBookTitle(id: string) {
  return apiRequestSuccess(api.delete(`/api/sach/dau-sach/${id}`));
}

export async function listBookCopies(bookId?: string) {
  return apiRequestData(
    api.get<BookCopy[]>("/api/sach/ban-sao", {
      params: bookId ? { ma_dau_sach: bookId } : undefined,
    }),
  );
}

export async function getBookCopyById(id: string) {
  const config: ApiRequestConfig = {
    _skipGlobalErrorHandler: true,
  };
  const response = await api.get<BookCopy>(`/api/sach/ban-sao/${id}`, config);
  return response.data;
}

export async function fetchBookCopyPreview(id: string) {
  const response = await getBookCopyById(id);
  return response;
}

export async function createBookCopy(payload: CreateCopyPayload) {
  return apiRequestSuccess(api.post("/api/sach/ban-sao", payload));
}

export async function updateBookCopy(id: string, payload: UpdateCopyPayload) {
  return apiRequestSuccess(api.put(`/api/sach/ban-sao/${id}`, payload));
}

export async function deleteBookCopy(id: string) {
  return apiRequestSuccess(api.delete(`/api/sach/ban-sao/${id}`));
}

export async function listLoanHistory(status?: LoanStatus) {
  return apiRequestData(
    api.get<LoanItem[]>("/api/muon-tra/lich-su", {
      params: status ? { tinh_trang: status } : undefined,
    }),
  );
}

export async function borrowBook(payload: BorrowPayload) {
  return apiRequestSuccess(api.post("/api/muon-tra/muon", payload));
}

export async function returnBook(loanId: string) {
  return apiRequestSuccess(api.put(`/api/muon-tra/tra/${loanId}`));
}

export default api;
