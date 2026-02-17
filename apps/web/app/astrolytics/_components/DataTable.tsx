import type { ReactNode } from "react";

interface DataTableProps {
  headers: string[];
  rows: (string | number | ReactNode)[][];
  onRowClick?: (rowIndex: number) => void;
}

export function DataTable({ headers, rows, onRowClick }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            {headers.map((header, i) => (
              <th
                key={i}
                className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-gray-800/50 hover:bg-primary-500/5 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
              onClick={() => onRowClick?.(i)}
            >
              {row.map((cell, j) => (
                <td key={j} className="py-3 px-4 text-sm text-gray-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
