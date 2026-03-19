"use client";

import { InboxIcon, LayersIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/form";
import { DataTable, TableCard, TableCell, TableState } from "@/components/ui/table";
import type { Major } from "@/lib/types";

type MajorTableCardProps = {
  items: Major[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  onEdit: (item: Major) => void;
  onDelete: (item: Major) => void;
};

export function MajorTableCard({
  items,
  loading,
  search,
  onSearchChange,
  onCreate,
  onEdit,
  onDelete,
}: MajorTableCardProps) {
  return (
    <TableCard
      title="Danh sách chuyên ngành"
      description="Tìm kiếm theo mã, tên hoặc mô tả chuyên ngành."
      actions={
        <div className="w-full lg:w-80">
          <TextInput
            leftIcon={<SearchIcon className="h-4 w-4" />}
            placeholder="Tìm kiếm chuyên ngành..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
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
              <div className="ui-skeleton mt-3 h-5 w-2/3 rounded-full" />
              <div className="ui-skeleton mt-4 h-4 w-full rounded-full" />
              <div className="ui-skeleton mt-2 h-4 w-4/5 rounded-full" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--gray-200)] bg-[var(--gray-50)] p-6">
            <div className="flex flex-col items-start gap-3">
              <LayersIcon className="h-7 w-7 text-[var(--gray-400)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--gray-900)]">
                  Chưa có chuyên ngành phù hợp
                </p>
                <p className="mt-1 text-sm text-[var(--gray-600)]">
                  Hãy tạo chuyên ngành đầu tiên hoặc thay đổi từ khóa tìm kiếm để xem dữ liệu.
                </p>
              </div>
              <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
                Thêm chuyên ngành
              </Button>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item.ma_chuyen_nganh}
              className="rounded-[var(--radius-lg)] border border-[var(--gray-200)] bg-white p-4"
            >
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--gray-400)]">
                {item.ma_chuyen_nganh}
              </p>
              <h4 className="mt-1 text-base font-semibold text-[var(--gray-900)]">
                {item.ten_chuyen_nganh}
              </h4>
              <p className="mt-3 text-sm text-[var(--gray-600)]">
                {item.mo_ta || "Chưa có mô tả"}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" size="sm" className="sm:flex-1" onClick={() => onEdit(item)}>
                  Sửa
                </Button>
                <Button variant="danger" size="sm" className="sm:flex-1" onClick={() => onDelete(item)}>
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
            { label: "Tên chuyên ngành" },
            { label: "Mô tả", className: "hidden lg:table-cell" },
            { label: "Actions", align: "right" },
          ]}
        >
          <TableState
            loading={loading}
            isEmpty={items.length === 0}
            columns={4}
            empty={{
              icon: <LayersIcon className="h-7 w-7" />,
              title: "Chưa có chuyên ngành phù hợp",
              description:
                "Hãy tạo chuyên ngành đầu tiên hoặc thay đổi từ khóa tìm kiếm để xem dữ liệu.",
              action: (
                <Button icon={<PlusIcon className="h-4 w-4" />} onClick={onCreate}>
                  Thêm chuyên ngành
                </Button>
              ),
            }}
          >
            {items.map((item) => (
              <tr key={item.ma_chuyen_nganh}>
                <TableCell className="font-semibold">{item.ma_chuyen_nganh}</TableCell>
                <TableCell>{item.ten_chuyen_nganh}</TableCell>
                <TableCell className="hidden text-[var(--gray-600)] lg:table-cell">
                  {item.mo_ta || "Chưa có mô tả"}
                </TableCell>
                <TableCell align="right">
                  <div className="flex justify-end gap-2">
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
