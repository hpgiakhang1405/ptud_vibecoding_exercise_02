"use client";

import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  exportUnreturnedLoansPdf,
  fetchTopBooksReport,
  fetchUnreturnedLoansReport,
} from "@/lib/api";
import type { TopBookItem, UnreturnedLoanItem } from "@/lib/types";
import { showToast } from "@/lib/toast";

import { ReportStats } from "./report-stats";
import { TopBooksTable } from "./top-books-table";
import { UnreturnedLoansTable } from "./unreturned-loans-table";

export default function BaoCaoPage() {
  const [topBooks, setTopBooks] = useState<TopBookItem[]>([]);
  const [unreturnedLoans, setUnreturnedLoans] = useState<UnreturnedLoanItem[]>([]);
  const [topBooksLoading, setTopBooksLoading] = useState(true);
  const [unreturnedLoading, setUnreturnedLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);

  const totalBorrowingDays = useMemo(
    () =>
      unreturnedLoans.reduce((sum, item) => sum + calculateBorrowedDays(item.ngay_muon), 0),
    [unreturnedLoans],
  );

  useEffect(() => {
    void Promise.all([loadTopBooks(), loadUnreturnedLoans()]);
  }, []);

  async function loadTopBooks() {
    setTopBooksLoading(true);
    try {
      const data = await fetchTopBooksReport();
      if (!data) {
        return;
      }
      setTopBooks(data);
    } finally {
      setTopBooksLoading(false);
    }
  }

  async function loadUnreturnedLoans() {
    setUnreturnedLoading(true);
    try {
      const data = await fetchUnreturnedLoansReport();
      if (!data) {
        return;
      }
      setUnreturnedLoans(data);
    } finally {
      setUnreturnedLoading(false);
    }
  }

  async function exportPdf() {
    setExportingPdf(true);
    try {
      const pdfBlob = await exportUnreturnedLoansPdf();
      if (!pdfBlob) {
        return;
      }

      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "bao-cao-doc-gia-chua-tra.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast("Xuất PDF thành công", "success");
    } finally {
      setExportingPdf(false);
    }
  }

  return (
    <section>
      <PageHeader
        breadcrumb={["Báo cáo", "Tổng hợp"]}
        title="Báo cáo thư viện"
        description="Theo dõi các đầu sách được mượn nhiều nhất và danh sách độc giả đang giữ sách để phục vụ công tác vận hành."
        actions={
          <Button loading={exportingPdf} onClick={() => void exportPdf()}>
            Xuất PDF
          </Button>
        }
      />

      <ReportStats
        topBooks={topBooks}
        unreturnedLoans={unreturnedLoans}
        totalBorrowingDays={totalBorrowingDays}
      />

      <div className="space-y-6">
        <TopBooksTable items={topBooks} loading={topBooksLoading} />
        <UnreturnedLoansTable
          items={unreturnedLoans}
          loading={unreturnedLoading}
          getBorrowedDays={calculateBorrowedDays}
        />
      </div>
    </section>
  );
}

function calculateBorrowedDays(ngayMuon: string) {
  const borrowedAt = new Date(`${ngayMuon}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - borrowedAt.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
