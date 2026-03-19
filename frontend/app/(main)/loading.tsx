function LoadingBlock({
  className,
}: {
  className: string;
}) {
  return <div className={`ui-skeleton ${className}`} />;
}

export default function MainLoading() {
  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <LoadingBlock className="h-3 w-48 rounded-full" />
          <LoadingBlock className="h-8 w-72 rounded-full" />
          <LoadingBlock className="h-4 w-[28rem] max-w-full rounded-full" />
        </div>
        <LoadingBlock className="h-11 w-48 rounded-[var(--radius-lg)]" />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="surface-card p-5">
            <LoadingBlock className="h-4 w-28 rounded-full" />
            <LoadingBlock className="mt-4 h-8 w-20 rounded-full" />
          </div>
        ))}
      </div>

      <section className="surface-card p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <LoadingBlock className="h-5 w-40 rounded-full" />
            <LoadingBlock className="h-4 w-80 max-w-full rounded-full" />
          </div>
          <LoadingBlock className="h-11 w-72 rounded-[var(--radius-lg)]" />
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <tbody>
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-[14px]">
                      <LoadingBlock className="h-4 rounded-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
