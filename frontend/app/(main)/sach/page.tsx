"use client";

import { PlusIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/modal";

import { BookCopyModal } from "./book-copy-modal";
import { BookCopyTableCard } from "./book-copy-table-card";
import { BookTabButton } from "./book-tab-button";
import { BookTitleModal } from "./book-title-modal";
import { BookTitleTableCard } from "./book-title-table-card";
import { useBookManagement } from "./use-book-management";

export default function SachPage() {
  const {
    bookDelete,
    bookForm,
    bookLoading,
    bookModal,
    bookSearch,
    books,
    closeBookModal,
    closeCopyModal,
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
  } = useBookManagement();

  return (
    <section>
      <PageHeader
        breadcrumb={["Kho sách", "Quản lý sách"]}
        title="Quản lý Sách"
        description="Quản lý đầu sách và từng bản sao theo chuyên ngành, cùng trạng thái khai thác hiện tại."
        actions={
          <div className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-1 shadow-[var(--shadow-sm)]">
            <div className="flex gap-1">
              <BookTabButton active={tab === "dau_sach"} onClick={() => setTab("dau_sach")}>
                Đầu sách
              </BookTabButton>
              <BookTabButton active={tab === "ban_sao"} onClick={() => setTab("ban_sao")}>
                Bản sao
              </BookTabButton>
            </div>
          </div>
        }
      />

      {tab === "dau_sach" ? (
        <BookTitleTableCard
          books={books}
          majors={majors}
          bookSearch={bookSearch}
          majorFilter={majorFilter}
          loading={bookLoading}
          onBookSearchChange={setBookSearch}
          onMajorFilterChange={setMajorFilter}
          onCreate={openBookCreate}
          onEdit={openBookEdit}
          onDelete={setBookDelete}
        />
      ) : (
        <BookCopyTableCard
          books={books}
          copies={copies}
          copyBookFilter={copyBookFilter}
          loading={copyLoading}
          onCopyBookFilterChange={setCopyBookFilter}
          onCreate={openCopyCreate}
          onEdit={openCopyEdit}
          onDelete={setCopyDelete}
        />
      )}

      <BookTitleModal
        open={bookModal}
        majors={majors}
        form={bookForm}
        editingBook={editingBook}
        submitting={submitting}
        onClose={closeBookModal}
        onSubmit={submitBook}
        onFieldChange={updateBookField}
      />

      <BookCopyModal
        open={copyModal}
        books={books}
        form={copyForm}
        editingCopy={editingCopy}
        currentCopyBookName={currentCopyBookName}
        submitting={submitting}
        onClose={closeCopyModal}
        onSubmit={submitCopy}
        onFieldChange={updateCopyField}
      />

      <ConfirmModal
        open={Boolean(bookDelete)}
        title="Xác nhận xóa đầu sách"
        description={
          bookDelete ? `Bạn có chắc muốn xóa đầu sách "${bookDelete.ten_dau_sach}"?` : ""
        }
        confirmLabel="Xóa đầu sách"
        loading={submitting}
        onCancel={() => setBookDelete(null)}
        onConfirm={confirmDeleteBook}
      />

      <ConfirmModal
        open={Boolean(copyDelete)}
        title="Xác nhận xóa bản sao"
        description={copyDelete ? `Bạn có chắc muốn xóa bản sao "${copyDelete.ma_sach}"?` : ""}
        confirmLabel="Xóa bản sao"
        loading={submitting}
        onCancel={() => setCopyDelete(null)}
        onConfirm={confirmDeleteCopy}
      />
    </section>
  );
}
