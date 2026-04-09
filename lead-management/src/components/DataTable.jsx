// Generic, lightweight data table.
// columns: [{ key, header, render?(row), className? }]
export default function DataTable({ columns, rows, emptyText = 'No records found', onRowClick }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-bg/60">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wider text-surface-muted ${c.className || ''}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-surface-muted">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`transition-colors hover:bg-surface-bg/60 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={`whitespace-nowrap px-5 py-3.5 text-secondary-800 ${c.className || ''}`}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
