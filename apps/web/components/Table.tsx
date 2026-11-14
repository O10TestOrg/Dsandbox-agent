import NextLink from "next/link";

export type Column<T> = {
  /** Unique within the table. */
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Numbers: right-aligned on wide screens, tabular numerals. */
  numeric?: boolean;
  /** The row's name. Spans the full width when rows stack, and carries the row link. */
  primary?: boolean;
  /** A row action (e.g. delete). No header text; pinned top-right when rows stack. */
  action?: boolean;
};

const HEAD = "text-caption uppercase tracking-eyebrow text-muted";

/**
 * A flat console table: hairline rows, eyebrow header, tabular numerals, a tint on row hover.
 * Below `sm`, rows stack into a labelled two-column grid instead of scrolling sideways.
 * Explicit roles keep the table semantics when `display` changes for the stacked layout.
 */
export function Table<T>({
  label,
  columns,
  rows,
  rowKey,
  rowHref,
}: {
  /** Accessible name for the table. */
  label: string;
  columns: Column<T>[];
  rows: readonly T[];
  rowKey: (row: T) => string;
  /** Makes the whole row a link (through the primary cell). */
  rowHref?: (row: T) => string;
}) {
  const hasAction = columns.some((c) => c.action);

  return (
    <div className="sm:overflow-x-auto">
      <table role="table" aria-label={label} className="block w-full border-t border-line sm:table">
        <thead role="rowgroup" className="sr-only sm:not-sr-only sm:table-header-group">
          <tr role="row" className="border-b border-line">
            {columns.map((c) => (
              <th
                key={c.key}
                role="columnheader"
                scope="col"
                className={`px-3 py-3 ${HEAD} ${c.numeric ? "text-right" : "text-left"} ${
                  c.action ? "w-12" : ""
                }`}
              >
                {c.action ? <span className="sr-only">{c.header}</span> : c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup" className="block sm:table-row-group">
          {rows.map((row) => {
            const href = rowHref?.(row);
            return (
              <tr
                key={rowKey(row)}
                role="row"
                className={`relative grid grid-cols-2 gap-x-4 gap-y-3 border-b border-line py-4 transition-colors hover:bg-surface sm:table-row sm:py-0 ${
                  hasAction ? "pr-14 sm:pr-0" : ""
                }`}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    role="cell"
                    className={`min-w-0 sm:px-3 sm:py-3 ${cellPlacement(c)} ${
                      c.numeric ? "tabular-nums sm:text-right" : ""
                    }`}
                  >
                    {c.primary || c.action ? null : (
                      <span aria-hidden="true" className={`block sm:hidden ${HEAD}`}>
                        {c.header}
                      </span>
                    )}
                    {c.primary && href ? (
                      <NextLink
                        href={href}
                        className="break-words underline-offset-4 decoration-1 after:absolute after:inset-0 hover:underline"
                      >
                        {c.cell(row)}
                      </NextLink>
                    ) : (
                      c.cell(row)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function cellPlacement<T>(c: Column<T>): string {
  if (c.action) return "absolute right-0 top-2 z-10 sm:relative sm:right-auto sm:top-auto sm:w-12 sm:py-1";
  if (c.primary) return "col-span-2 break-words";
  return "";
}
