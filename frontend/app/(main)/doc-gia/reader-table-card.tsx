"use client";

import { InboxIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/form";
import { DataTable, TableCard, TableCell, TableState } from "@/components/ui/table";
import { formatVietnameseDate } from "@/lib/date";
import { formatGenderLabel } from "@/lib/format";
import type { ReaderRecord } from "@/lib/types";

import { ReaderTableMobileList } from "./reader-table-mobile-list";

type ReaderTableCardProps = {
  readers: ReaderRecord[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  onPrint: (reader: ReaderRecord) => void;
  onEdit: (reader: ReaderRecord) => void;
  onDelete: (reader: ReaderRecord) => void;
};

export function ReaderTableCard({
  readers,
  loading,
  search,
  onSearchChange,
  onCreate,
  onPrint,
  onEdit,
  onDelete,
}: ReaderTableCardProps) {
  return (
    <TableCard
      title="Danh sách độc giả"
      description="Tìm theo họ tên hoặc lớp. Mọi thao tác in thẻ và quản lý trạng thái đều thực hiện ngay tại đây."
      actions={
        <div className="w-full lg:w-80">
          <TextInput
            leftIcon={<SearchIcon className="h-4 w-4" />}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo họ tên hoặc lớp..."
          />
        </div>
      }
    >
      <ReaderTableMobileList
        readers={readers}
        loading={loading}
        onCreate={onCreate}
        onDelete={onDelete}
        onEdit={onEdit}
        onPrint={onPrint}
      />

      <div className="hidden md:block">
        <DataTable
          columns={[
            { label: "Mã" },
            { label: "Họ tên" },
            { label: "Lớp", className: "hidden lg:table-cell" },
            { label: "Ngày sinh", className: "hidden lg:table-cell" },
            { label: "Giới tính", className: "hidden lg:table-cell" },
            { label: "Trạng thái" },
            { label: "Actions", align: "right" },
          ]}
        >
          <TableState
            loading={loading}
            isEmpty={readers.length === 0}
            columns={7}
            empty={{
              icon: <InboxIcon className="h-7 w-7" />,
              title: "Chưa có độc giả phù hợp",
              description:
                "Bạn có thể thêm độc giả mới hoặc thay đổi điều kiện tìm kiếm để xem lại dữ liệu.",
              action: (
                <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
                  Thêm độc giả
                </Button>
              ),
            }}
          >
            {readers.map((item) => (
              <tr key={item.ma_doc_gia}>
                <TableCell className="font-semibold">{item.ma_doc_gia}</TableCell>
                <TableCell>{item.ho_ten}</TableCell>
                <TableCell className="hidden text-[var(--gray-600)] lg:table-cell">
                  {item.lop}
                </TableCell>
                <TableCell className="hidden text-[var(--gray-600)] lg:table-cell">
                  {formatVietnameseDate(item.ngay_sinh)}
                </TableCell>
                <TableCell className="hidden text-[var(--gray-600)] lg:table-cell">
                  {formatGenderLabel(item.gioi_tinh)}
                </TableCell>
                <TableCell>
                  <Badge tone={item.trang_thai === "active" ? "active" : "locked"} />
                </TableCell>
                <TableCell align="right">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => onPrint(item)}>
                      In thẻ
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => onEdit(item)}>
                      Sửa
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(item)}>
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </tr>
            ))}
          </TableState>
        </DataTable>
      </div>
    </TableCard>
  );
}
