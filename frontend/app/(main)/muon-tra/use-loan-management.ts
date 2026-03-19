import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  borrowBook,
  fetchBookCopyPreview,
  fetchReaderPreview,
  getApiErrorMessage,
  listLoanHistory,
  returnBook,
} from "@/lib/api";
import { showToast } from "@/lib/toast";
import type {
  BookCopyPreview,
  LoanItem,
  LoanStatus,
  ReaderPreview,
} from "@/lib/types";

export type LoanTab = "muon" | "lich_su";

export function useLoanManagement() {
  const [tab, setTab] = useState<LoanTab>("muon");
  const [maSach, setMaSach] = useState("");
  const [maDocGia, setMaDocGia] = useState("");
  const [reader, setReader] = useState<ReaderPreview | null>(null);
  const [book, setBook] = useState<BookCopyPreview | null>(null);
  const [readerLoading, setReaderLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [readerError, setReaderError] = useState("");
  const [bookError, setBookError] = useState("");
  const [submittingBorrow, setSubmittingBorrow] = useState(false);
  const [loans, setLoans] = useState<LoanItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | LoanStatus>("all");
  const [returningId, setReturningId] = useState<string | null>(null);

  const loadReaderPreview = useCallback(async (id: string): Promise<void> => {
    setReaderLoading(true);
    setReaderError("");
    try {
      const data = await fetchReaderPreview(id);
      setReader(data);
    } catch (error) {
      setReader(null);
      setReaderError(getApiErrorMessage(error, "Không tìm thấy độc giả"));
    } finally {
      setReaderLoading(false);
    }
  }, []);

  const loadBookPreview = useCallback(async (id: string): Promise<void> => {
    setBookLoading(true);
    setBookError("");
    try {
      const data = await fetchBookCopyPreview(id);
      setBook(data);
    } catch (error) {
      setBook(null);
      setBookError(getApiErrorMessage(error, "Không tìm thấy bản sao"));
    } finally {
      setBookLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async (): Promise<void> => {
    setHistoryLoading(true);
    try {
      const data = await listLoanHistory(statusFilter === "all" ? undefined : statusFilter);
      if (!data) {
        return;
      }
      setLoans(data);
    } finally {
      setHistoryLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const value = maDocGia.trim();
    if (!value) {
      setReader(null);
      setReaderError("");
      return;
    }

    const timer = window.setTimeout(() => {
      void loadReaderPreview(value);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [loadReaderPreview, maDocGia]);

  useEffect(() => {
    const value = maSach.trim();
    if (!value) {
      setBook(null);
      setBookError("");
      return;
    }

    const timer = window.setTimeout(() => {
      void loadBookPreview(value);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [loadBookPreview, maSach]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadHistory();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [loadHistory]);

  const canBorrow = useMemo(() => {
    return Boolean(maSach.trim() && maDocGia.trim() && reader && book && !readerError && !bookError);
  }, [book, bookError, maDocGia, maSach, reader, readerError]);

  const activeLoanCount = useMemo(
    () => loans.filter((loan) => loan.tinh_trang === "dang_muon").length,
    [loans],
  );

  const submitBorrow = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      if (!canBorrow) {
        return;
      }

      setSubmittingBorrow(true);
      try {
        const success = await borrowBook({
          ma_sach: maSach.trim(),
          ma_doc_gia: maDocGia.trim(),
        });
        if (!success) {
          return;
        }
        showToast("Tạo phiếu mượn thành công", "success");
        setMaSach("");
        setMaDocGia("");
        setReader(null);
        setBook(null);
        setReaderError("");
        setBookError("");
        await loadHistory();
        setTab("lich_su");
      } finally {
        setSubmittingBorrow(false);
      }
    },
    [canBorrow, loadHistory, maDocGia, maSach],
  );

  const confirmReturn = useCallback(
    async (maPhieu: string): Promise<void> => {
      setReturningId(maPhieu);
      try {
        const success = await returnBook(maPhieu);
        if (!success) {
          return;
        }
        showToast("Trả sách thành công", "success");
        await loadHistory();
        if (book?.ma_sach) {
          await loadBookPreview(book.ma_sach);
        }
      } finally {
        setReturningId(null);
      }
    },
    [book?.ma_sach, loadBookPreview, loadHistory],
  );

  return {
    activeLoanCount,
    book,
    bookError,
    bookLoading,
    canBorrow,
    confirmReturn,
    historyLoading,
    loans,
    maDocGia,
    maSach,
    reader,
    readerError,
    readerLoading,
    returningId,
    setMaDocGia,
    setMaSach,
    setStatusFilter,
    setTab,
    statusFilter,
    submitBorrow,
    submittingBorrow,
    tab,
  };
}
