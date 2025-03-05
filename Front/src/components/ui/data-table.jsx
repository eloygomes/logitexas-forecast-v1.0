import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

export function DataTable({ columns, data, meta }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta, // Permite que as células acessem a função updateData (por exemplo, table.options.meta?.updateData)
  });

  return (
    <div className="overflow-auto rounded-md">
      <table className="min-w-full border-collapse dark:text-white ">
        <thead className="bg-gray-200 dark:bg-gray-800 text-md truncate">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b dark:border-gray-700">
              {headerGroup.headers.map((header) => {
                const sortDir = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className="px-4 py-2 cursor-pointer text-left"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {sortDir === "asc" ? (
                      <span style={{ fontSize: ".5rem" }}>▲</span>
                    ) : sortDir === "desc" ? (
                      <span style={{ fontSize: ".5rem" }}>▼</span>
                    ) : null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        {/* <tbody className="bg-white dark:bg-gray-900"> */}
        <tbody className="bg-white dark:bg-gray-200">
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                Nenhum resultado.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b dark:border-gray-700">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-1 text-sm text-gray-800 truncate"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
