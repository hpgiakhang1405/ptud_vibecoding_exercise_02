import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  createBookCopy,
  createBookTitle,
  deleteBookCopy,
  deleteBookTitle,
  listBookCopies,
  listBookTitles,
  listMajors,
  updateBookCopy,
  updateBookTitle,
} from "@/lib/api";
import { showToast } from "@/lib/toast";
import type {
  BookCopy,
  BookFormValues,
  BookPayload,
  BookTitle,
  CopyFormValues,
  CreateCopyPayload,
  Major,
  UpdateCopyPayload,
} from "@/lib/types";

export type BookTab = "dau_sach" | "ban_sao";

const EMPTY_BOOK: BookFormValues = {
  ma_dau_sach: "",
  ten_dau_sach: "",
  nha_xuat_ban: "",
  so_trang: "",
  kich_thuoc: "",
  tac_gia: "",
  ma_chuyen_nganh: "",
};

const EMPTY_COPY: CopyFormValues = {
  ma_sach: "",
  ma_dau_sach: "",
  ngay_nhap: "",
  tinh_trang: "san_sang",
};

export function useBookManagement() {
  const [tab, setTab] = useState<BookTab>("dau_sach");
  const [majors, setMajors] = useState<Major[]>([]);
  const [books, setBooks] = useState<BookTitle[]>([]);
  const [copies, setCopies] = useState<BookCopy[]>([]);
  const [bookSearch, setBookSearch] = useState("");
  const [majorFilter, setMajorFilter] = useState("");
  const [copyBookFilter, setCopyBookFilter] = useState("");
  const [bookModal, setBookModal] = useState(false);
  const [copyModal, setCopyModal] = useState(false);
  const [editingBook, setEditingBook] = useState<string | null>(null);
  const [editingCopy, setEditingCopy] = useState<string | null>(null);
  const [bookDelete, setBookDelete] = useState<BookTitle | null>(null);
  const [copyDelete, setCopyDelete] = useState<BookCopy | null>(null);
  const [bookForm, setBookForm] = useState<BookFormValues>(EMPTY_BOOK);
  const [copyForm, setCopyForm] = useState<CopyFormValues>(EMPTY_COPY);
  const [bookLoading, setBookLoading] = useState(true);
  const [copyLoading, setCopyLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadMajors = useCallback(async (): Promise<void> => {
    const data = await listMajors();
    if (!data) {
      return;
    }
    setMajors(data);
  }, []);

  const loadBooks = useCallback(async (): Promise<void> => {
    setBookLoading(true);
    try {
      const data = await listBookTitles(bookSearch, majorFilter);
      if (!data) {
        return;
      }
      setBooks(data);
    } finally {
      setBookLoading(false);
    }
  }, [bookSearch, majorFilter]);

  const loadCopies = useCallback(async (): Promise<void> => {
    setCopyLoading(true);
    try {
      const data = await listBookCopies(copyBookFilter || undefined);
      if (!data) {
        return;
      }
      setCopies(data);
    } finally {
      setCopyLoading(false);
    }
  }, [copyBookFilter]);

  useEffect(() => {
    void loadMajors();
    void loadBooks();
    void loadCopies();
  }, [loadBooks, loadCopies, loadMajors]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadBooks(), 250);
    return () => window.clearTimeout(timer);
  }, [loadBooks]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadCopies(), 250);
    return () => window.clearTimeout(timer);
  }, [loadCopies]);

  const currentCopyBookName = useMemo(
    () => books.find((item) => item.ma_dau_sach === copyForm.ma_dau_sach)?.ten_dau_sach ?? "",
    [books, copyForm.ma_dau_sach],
  );

  const updateBookField = useCallback(
    <K extends keyof BookFormValues>(field: K, value: BookFormValues[K]): void => {
      setBookForm((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const updateCopyField = useCallback(
    <K extends keyof CopyFormValues>(field: K, value: CopyFormValues[K]): void => {
      setCopyForm((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const refreshAll = useCallback(async (): Promise<void> => {
    await Promise.all([loadBooks(), loadCopies()]);
  }, [loadBooks, loadCopies]);

  const openBookCreate = useCallback((): void => {
    setEditingBook(null);
    setBookForm({ ...EMPTY_BOOK, ma_chuyen_nganh: majors[0]?.ma_chuyen_nganh ?? "" });
    setBookModal(true);
  }, [majors]);

  const openBookEdit = useCallback((item: BookTitle): void => {
    setEditingBook(item.ma_dau_sach);
    setBookForm({
      ma_dau_sach: item.ma_dau_sach,
      ten_dau_sach: item.ten_dau_sach,
      nha_xuat_ban: item.nha_xuat_ban,
      so_trang: String(item.so_trang),
      kich_thuoc: item.kich_thuoc,
      tac_gia: item.tac_gia,
      ma_chuyen_nganh: item.ma_chuyen_nganh,
    });
    setBookModal(true);
  }, []);

  const openCopyCreate = useCallback((): void => {
    setEditingCopy(null);
    setCopyForm({
      ...EMPTY_COPY,
      ma_dau_sach: copyBookFilter || books[0]?.ma_dau_sach || "",
      ngay_nhap: new Date().toISOString().slice(0, 10),
    });
    setCopyModal(true);
  }, [books, copyBookFilter]);

  const openCopyEdit = useCallback((item: BookCopy): void => {
    setEditingCopy(item.ma_sach);
    setCopyForm({
      ma_sach: item.ma_sach,
      ma_dau_sach: item.ma_dau_sach,
      ngay_nhap: item.ngay_nhap,
      tinh_trang: item.tinh_trang === "hong" ? "hong" : "san_sang",
    });
    setCopyModal(true);
  }, []);

  const closeBookModal = useCallback((): void => {
    setBookModal(false);
  }, []);

  const closeCopyModal = useCallback((): void => {
    setCopyModal(false);
  }, []);

  const submitBook = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      setSubmitting(true);
      try {
        const payload: BookPayload = { ...bookForm, so_trang: Number(bookForm.so_trang) };
        if (editingBook) {
          const success = await updateBookTitle(editingBook, payload);
          if (!success) {
            return;
          }
          showToast("Cập nhật đầu sách thành công", "success");
        } else {
          const success = await createBookTitle(payload);
          if (!success) {
            return;
          }
          showToast("Tạo đầu sách thành công", "success");
        }
        setBookModal(false);
        setBookForm(EMPTY_BOOK);
        await refreshAll();
      } finally {
        setSubmitting(false);
      }
    },
    [bookForm, editingBook, refreshAll],
  );

  const submitCopy = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      setSubmitting(true);
      try {
        if (editingCopy) {
          const payload: UpdateCopyPayload = { tinh_trang: copyForm.tinh_trang };
          const success = await updateBookCopy(editingCopy, payload);
          if (!success) {
            return;
          }
          showToast("Cập nhật bản sao thành công", "success");
        } else {
          const payload: CreateCopyPayload = {
            ma_sach: copyForm.ma_sach,
            ma_dau_sach: copyForm.ma_dau_sach,
            ngay_nhap: copyForm.ngay_nhap,
          };
          const success = await createBookCopy(payload);
          if (!success) {
            return;
          }
          showToast("Tạo bản sao thành công", "success");
        }
        setCopyModal(false);
        setCopyForm(EMPTY_COPY);
        await refreshAll();
      } finally {
        setSubmitting(false);
      }
    },
    [copyForm, editingCopy, refreshAll],
  );

  const confirmDeleteBook = useCallback(async (): Promise<void> => {
    if (!bookDelete) {
      return;
    }
    setSubmitting(true);
    try {
      const success = await deleteBookTitle(bookDelete.ma_dau_sach);
      if (!success) {
        return;
      }
      showToast("Xóa đầu sách thành công", "success");
      setBookDelete(null);
      await refreshAll();
    } finally {
      setSubmitting(false);
    }
  }, [bookDelete, refreshAll]);

  const confirmDeleteCopy = useCallback(async (): Promise<void> => {
    if (!copyDelete) {
      return;
    }
    setSubmitting(true);
    try {
      const success = await deleteBookCopy(copyDelete.ma_sach);
      if (!success) {
        return;
      }
      showToast("Xóa bản sao thành công", "success");
      setCopyDelete(null);
      await refreshAll();
    } finally {
      setSubmitting(false);
    }
  }, [copyDelete, refreshAll]);

  return {
    bookDelete,
    bookForm,
    bookLoading,
    bookModal,
    bookSearch,
    books,
    confirmDeleteBook,
    confirmDeleteCopy,
    copyBookFilter,
    copyDelete,
    copyForm,
    copyLoading,
    copyModal,
    copies,
    currentCopyBookName,
    editingBook,
    editingCopy,
    majorFilter,
    majors,
    openBookCreate,
    openBookEdit,
    openCopyCreate,
    openCopyEdit,
    setBookDelete,
    setBookSearch,
    setCopyBookFilter,
    setCopyDelete,
    setMajorFilter,
    setTab,
    submitting,
    submitBook,
    submitCopy,
    tab,
    updateBookField,
    updateCopyField,
    closeBookModal,
    closeCopyModal,
  };
}
