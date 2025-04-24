import React, { useRef, useMemo, useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function AgGRIDDataTable({ columnDefs, rowData }) {
  const gridRef = useRef();

  const [pinnedTopRows, setPinnedTopRows] = useState([]);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const clearPinned = useCallback(() => {
    gridRef.current?.applyColumnState({ defaultState: { pinned: null } });
  }, []);

  const pinFocusedColumn = useCallback(() => {
    const focused = gridRef.current?.getFocusedCell();
    if (!focused) return;
    const colId = focused.column.getColId();
    const isPinned = focused.column.getPinned();
    gridRef.current.applyColumnState({
      state: [{ colId, pinned: isPinned ? null : "left" }],
      defaultState: { pinned: null },
    });
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Row pinning (revised)                                             */
  /* ------------------------------------------------------------------ */
  const pinRowsToFocused = () => {
    const focused = gridRef.current?.getFocusedCell();
    if (!focused) return;
    const rows = [];
    for (let i = 0; i <= focused.rowIndex; i++) {
      const node = gridRef.current.getDisplayedRowAtIndex(i);
      if (node) rows.push({ ...node.data });
    }
    setPinnedTopRows(rows);
  };

  const clearPinnedRows = () => setPinnedTopRows([]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={pinFocusedColumn}
          className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-800"
        >
          Freeze&nbsp;Column
        </button>
        <button
          onClick={clearPinned}
          className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-800"
        >
          Clear&nbsp;Column&nbsp;Pins
        </button>
        <button
          onClick={pinRowsToFocused}
          className="rounded bg-blue-700 px-3 py-1 text-sm text-white hover:bg-blue-800"
        >
          Freeze&nbsp;Rows
        </button>
        <button
          onClick={clearPinnedRows}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
        >
          Clear&nbsp;Row&nbsp;Pins
        </button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          pinnedTopRowData={pinnedTopRows}
        />
      </div>
    </>
  );
}
