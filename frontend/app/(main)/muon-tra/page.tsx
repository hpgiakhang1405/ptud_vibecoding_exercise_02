"use client";

import { PageHeader } from "@/components/page-header";

import { LoanBorrowPanel } from "./loan-borrow-panel";
import { LoanHistoryTableCard } from "./loan-history-table-card";
import { LoanStatusSidebar } from "./loan-status-sidebar";
import { TabButton } from "./loan-ui";
import { useLoanManagement } from "./use-loan-management";

export default function MuonTraPage() {
  const {
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
  } = useLoanManagement();

  return (
    <section>
      <PageHeader
        breadcrumb={["Lưu thông", "Mượn / Trả"]}
        title="Mượn / Trả sách"
        description="Thủ thư có thể kiểm tra nhanh độc giả, bản sao sách và xử lý phiếu mượn trả trên cùng một giao diện."
        actions={
          <div className="w-full rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-1 shadow-[var(--shadow-sm)] sm:w-auto">
            <div className="flex gap-1">
              <TabButton active={tab === "muon"} onClick={() => setTab("muon")}>
                Mượn sách
              </TabButton>
              <TabButton active={tab === "lich_su"} onClick={() => setTab("lich_su")}>
                Lịch sử
              </TabButton>
            </div>
          </div>
        }
      />

      {tab === "muon" ? (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <LoanBorrowPanel
            maDocGia={maDocGia}
            maSach={maSach}
            reader={reader}
            book={book}
            readerLoading={readerLoading}
            bookLoading={bookLoading}
            readerError={readerError}
            bookError={bookError}
            canBorrow={canBorrow}
            submittingBorrow={submittingBorrow}
            onSubmit={submitBorrow}
            onReaderChange={setMaDocGia}
            onBookChange={setMaSach}
          />

          <LoanStatusSidebar activeLoanCount={activeLoanCount} />
        </div>
      ) : (
        <LoanHistoryTableCard
          statusFilter={statusFilter}
          loans={loans}
          historyLoading={historyLoading}
          returningId={returningId}
          onStatusFilterChange={setStatusFilter}
          onConfirmReturn={(loanId) => void confirmReturn(loanId)}
        />
      )}
    </section>
  );
}
