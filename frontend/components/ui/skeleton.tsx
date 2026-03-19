export function TableSkeletonRows({
  columns,
  rows = 5,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <td key={columnIndex} className="px-4 py-[14px]">
              <div className="ui-skeleton h-4 rounded-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
