import { BookIcon, PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { DataTable, TableCard, TableCell, TableState } from "@/components/ui/table";
import type { BookCopy, BookTitle } from "@/lib/types";

type BookCopyTableCardProps = {
  books: BookTitle[];
  copies: BookCopy[];
  copyBookFilter: string;
  loading: boolean;
  onCopyBookFilterChange: (value: string) => void;
  onCreate: () => void;
  onEdit: (item: BookCopy) => void;
  onDelete: (item: BookCopy) => void;
};

export function BookCopyTableCard({
  books,
  copies,
  copyBookFilter,
  loading,
  onCopyBookFilterChange,
  onCreate,
  onEdit,
  onDelete,
}: BookCopyTableCardProps) {
  return (
    <TableCard
      title="Danh sách bản sao"
      description="Lọc theo đầu sách và quản lý tình trạng từng bản sao đang lưu thông."
      actions={
        <>
          <div className="w-full md:w-72">
            <SelectInput
              value={copyBookFilter}
              onChange={(event) => onCopyBookFilterChange(event.target.value)}
            >
              <option value="">Tất cả đầu sách</option>
              {books.map((book) => (
                <option key={book.ma_dau_sach} value={book.ma_dau_sach}>
                  {book.ten_dau_sach}
                </option>
              ))}
            </SelectInput>
          </div>
          <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
            Thêm bản sao
          </Button>
        </>
      }
    >
      <div className="space-y-3 md:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="ui-skeleton h-4 w-28 rounded-full" />
              <div className="ui-skeleton mt-3 h-5 w-3/4 rounded-full" />
              <div className="ui-skeleton mt-4 h-4 w-1/2 rounded-full" />
            </div>
          ))
        ) : copies.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--gray-200)] bg-[var(--gray-50)] p-6">
            <div className="flex flex-col items-start gap-3">
              <BookIcon className="h-7 w-7 text-[var(--gray-400)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--gray-900)]">
                  Chưa có bản sao phù hợp
                </p>
                <p className="mt-1 text-sm text-[var(--gray-600)]">
                  Hãy thêm bản sao mới hoặc thay đổi đầu sách đang lọc để hiển thị dữ liệu.
                </p>
              </div>
              <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
                Thêm bản sao
              </Button>
            </div>
          </div>
        ) : (
          copies.map((copy) => (
            <article
              key={copy.ma_sach}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--gray-400)]">
                    {copy.ma_sach}
                  </p>
                  <h4 className="mt-1 text-base font-semibold text-[var(--gray-900)]">
                    {copy.ten_dau_sach}
                  </h4>
                </div>
                <Badge tone={copy.tinh_trang} />
              </div>
              <p className="mt-3 text-sm text-[var(--gray-600)]">Ngày nhập: {copy.ngay_nhap}</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="secondary"
                  size="sm"
                  className="sm:flex-1"
                  onClick={() => onEdit(copy)}
                  disabled={copy.tinh_trang === "dang_muon"}
                >
                  Sửa
                </Button>
                <Button variant="danger" size="sm" className="sm:flex-1" onClick={() => onDelete(copy)}>
                  Xóa
                </Button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden md:block">
        <DataTable
          columns={[
            { label: "Mã bản sao" },
            { label: "Đầu sách" },
            { label: "Ngày nhập", className: "hidden lg:table-cell" },
            { label: "Tình trạng" },
            { label: "Actions", align: "right" },
          ]}
        >
          <TableState
            loading={loading}
            isEmpty={copies.length === 0}
            columns={5}
            empty={{
              icon: <BookIcon className="h-7 w-7" />,
              title: "Chưa có bản sao phù hợp",
              description:
                "Hãy thêm bản sao mới hoặc thay đổi đầu sách đang lọc để hiển thị dữ liệu.",
              action: (
                <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
                  Thêm bản sao
                </Button>
              ),
            }}
          >
            {copies.map((copy) => (
              <tr key={copy.ma_sach}>
                <TableCell className="font-semibold">{copy.ma_sach}</TableCell>
                <TableCell>{copy.ten_dau_sach}</TableCell>
                <TableCell className="hidden text-[var(--gray-600)] lg:table-cell">
                  {copy.ngay_nhap}
                </TableCell>
                <TableCell>
                  <Badge tone={copy.tinh_trang} />
                </TableCell>
                <TableCell align="right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(copy)}
                      disabled={copy.tinh_trang === "dang_muon"}
                    >
                      Sửa
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(copy)}>
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
