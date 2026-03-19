import { InboxIcon, LayersIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DataTable, TableCard, TableCell, TableState } from "@/components/ui/table";
import { SelectInput, TextInput } from "@/components/ui/form";
import type { BookTitle, Major } from "@/lib/types";

type BookTitleTableCardProps = {
  books: BookTitle[];
  majors: Major[];
  bookSearch: string;
  majorFilter: string;
  loading: boolean;
  onBookSearchChange: (value: string) => void;
  onMajorFilterChange: (value: string) => void;
  onCreate: () => void;
  onEdit: (item: BookTitle) => void;
  onDelete: (item: BookTitle) => void;
};

export function BookTitleTableCard({
  books,
  majors,
  bookSearch,
  majorFilter,
  loading,
  onBookSearchChange,
  onMajorFilterChange,
  onCreate,
  onEdit,
  onDelete,
}: BookTitleTableCardProps) {
  return (
    <TableCard
      title="Danh sách đầu sách"
      description="Tìm theo tên, tác giả và lọc theo chuyên ngành."
      actions={
        <>
          <div className="w-full md:w-80">
            <TextInput
              leftIcon={<SearchIcon className="h-4 w-4" />}
              value={bookSearch}
              onChange={(event) => onBookSearchChange(event.target.value)}
              placeholder="Tìm theo tên hoặc tác giả..."
            />
          </div>
          <div className="w-full md:w-56">
            <SelectInput
              value={majorFilter}
              onChange={(event) => onMajorFilterChange(event.target.value)}
            >
              <option value="">Tất cả chuyên ngành</option>
              {majors.map((major) => (
                <option key={major.ma_chuyen_nganh} value={major.ma_chuyen_nganh}>
                  {major.ten_chuyen_nganh}
                </option>
              ))}
            </SelectInput>
          </div>
          <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
            Thêm đầu sách
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
              <div className="ui-skeleton h-4 w-24 rounded-full" />
              <div className="ui-skeleton mt-3 h-5 w-3/4 rounded-full" />
              <div className="ui-skeleton mt-2 h-4 w-1/2 rounded-full" />
              <div className="ui-skeleton mt-4 h-4 w-full rounded-full" />
            </div>
          ))
        ) : books.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--gray-200)] bg-[var(--gray-50)] p-6">
            <div className="flex flex-col items-start gap-3">
              <InboxIcon className="h-7 w-7 text-[var(--gray-400)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--gray-900)]">
                  Chưa có đầu sách phù hợp
                </p>
                <p className="mt-1 text-sm text-[var(--gray-600)]">
                  Hãy tạo đầu sách đầu tiên hoặc điều chỉnh bộ lọc để hiển thị dữ liệu mong muốn.
                </p>
              </div>
              <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
                Thêm đầu sách
              </Button>
            </div>
          </div>
        ) : (
          books.map((book) => (
            <article
              key={book.ma_dau_sach}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--gray-400)]">
                    {book.ma_dau_sach}
                  </p>
                  <h4 className="mt-1 text-base font-semibold text-[var(--gray-900)]">
                    {book.ten_dau_sach}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--gray-600)]">{book.tac_gia}</p>
                </div>
                <div className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-sm font-semibold text-[var(--primary)]">
                  {book.so_luong}
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--gray-600)]">
                <LayersIcon className="h-4 w-4 text-[var(--gray-400)]" />
                {book.ten_chuyen_nganh}
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" size="sm" className="sm:flex-1" onClick={() => onEdit(book)}>
                  Sửa
                </Button>
                <Button variant="danger" size="sm" className="sm:flex-1" onClick={() => onDelete(book)}>
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
            { label: "Mã" },
            { label: "Tên đầu sách" },
            { label: "Tác giả", className: "hidden lg:table-cell" },
            { label: "Chuyên ngành" },
            { label: "Số lượng" },
            { label: "Actions", align: "right" },
          ]}
        >
          <TableState
            loading={loading}
            isEmpty={books.length === 0}
            columns={6}
            empty={{
              icon: <InboxIcon className="h-7 w-7" />,
              title: "Chưa có đầu sách phù hợp",
              description:
                "Hãy tạo đầu sách đầu tiên hoặc điều chỉnh bộ lọc để hiển thị dữ liệu mong muốn.",
              action: (
                <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
                  Thêm đầu sách
                </Button>
              ),
            }}
          >
            {books.map((book) => (
              <tr key={book.ma_dau_sach}>
                <TableCell className="font-semibold">{book.ma_dau_sach}</TableCell>
                <TableCell>{book.ten_dau_sach}</TableCell>
                <TableCell className="hidden text-[var(--gray-600)] lg:table-cell">
                  {book.tac_gia}
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-2 text-sm text-[var(--gray-600)]">
                    <LayersIcon className="h-4 w-4 text-[var(--gray-400)]" />
                    {book.ten_chuyen_nganh}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{book.so_luong}</TableCell>
                <TableCell align="right">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => onEdit(book)}>
                      Sửa
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(book)}>
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
