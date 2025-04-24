// import React, { useRef, useMemo, useCallback, useState } from "react";
// import { AgGridReact } from "ag-grid-react";
// import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

// ModuleRegistry.registerModules([AllCommunityModule]);

// export function AgGRIDDataTable({ columns, data, cardTitle = "" }) {
//   /* ------------------------------------------------------------------ */
//   /*  Refs e estado                                                     */
//   /* ------------------------------------------------------------------ */
//   const gridRef = useRef(null);
//   const [rowData] = useState(data);

//   // NOVO: rows fixados
//   const [pinnedTopRows, setPinnedTopRows] = useState([]);
//   const [pinnedBottomRows, setPinnedBottomRows] = useState([]);

//   /* ------------------------------------------------------------------ */
//   /*  Definições de colunas                                             */
//   /* ------------------------------------------------------------------ */
//   const columnDefs = useMemo(
//     () =>
//       columns.map((col) => {
//         const def = {
//           headerName: col.header || col.label,
//           field: col.accessorKey,
//           width: col.width ? parseInt(col.width, 10) : 150,
//         };
//         if (col.accessorKey === "price") {
//           def.valueFormatter = (p) =>
//             new Intl.NumberFormat("pt-BR", {
//               style: "currency",
//               currency: "BRL",
//             }).format(p.value);
//         }
//         if (col.accessorKey === "status") {
//           def.cellStyle = (p) => ({
//             color: p.value === "Ativo" ? "green" : "red",
//             fontWeight: "bold",
//           });
//         }
//         if (col.accessorKey === "id") {
//           def.width = 50;
//           def.cellStyle = { display: "flex", flex: 1 };
//         }
//         if (col.accessorKey === "Cliente") {
//           def.width = 300;
//           def.cellStyle = {
//             backgroundColor: "#f0f0f0",
//             color: "#333",
//             fontWeight: "bold",
//             flex: 1,
//           };
//         }
//         return def;
//       }),
//     [columns]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       sortable: true,
//       resizable: true,
//       filter: true,
//       editable: true,
//       minWidth: 80,
//     }),
//     []
//   );

//   /* ------------------------------------------------------------------ */
//   /*  Column pinning (já existia)                                       */
//   /* ------------------------------------------------------------------ */
//   const clearPinned = useCallback(() => {
//     gridRef.current?.applyColumnState({ defaultState: { pinned: null } });
//   }, []);
//   const togglePin = useCallback(() => {
//     const colId = document.getElementById("pinCol")?.value?.trim();
//     if (!colId) return;
//     const column = gridRef.current?.getColumn(colId);
//     if (!column) return;
//     const currentlyPinned = column.getPinned();
//     gridRef.current.applyColumnState({
//       state: [{ colId, pinned: currentlyPinned ? null : "left" }],
//       defaultState: { pinned: null },
//     });
//   }, []);

//   /* ------------------------------------------------------------------ */
//   /*  Row pinning (NOVO)                                                */
//   /* ------------------------------------------------------------------ */
//   // helper para obter dados da linha pelo índice digitado
//   const getRowDataByIndexInput = () => {
//     const idx = Number(document.getElementById("pinRow")?.value);
//     if (Number.isNaN(idx)) return null;
//     const node = gridRef.current?.getDisplayedRowAtIndex(idx);
//     return node?.data ?? null;
//   };

//   const pinRowTop = () => {
//     const dataToPin = getRowDataByIndexInput();
//     if (!dataToPin) return;
//     setPinnedTopRows((prev) => [...prev, { ...dataToPin }]);
//   };

//   const pinRowBottom = () => {
//     const dataToPin = getRowDataByIndexInput();
//     if (!dataToPin) return;
//     setPinnedBottomRows((prev) => [...prev, { ...dataToPin }]);
//   };

//   const unpinSelectedPinned = () => {
//     const selected = gridRef.current?.getSelectedNodes();
//     if (!selected?.length) return;
//     const isPinnedTop = selected[0].rowPinned === "top";
//     const isPinnedBottom = selected[0].rowPinned === "bottom";
//     if (!isPinnedTop && !isPinnedBottom) return;

//     const toRemove = selected.map((n) => n.data);
//     if (isPinnedTop) {
//       setPinnedTopRows((prev) => prev.filter((r) => !toRemove.includes(r)));
//     } else if (isPinnedBottom) {
//       setPinnedBottomRows((prev) => prev.filter((r) => !toRemove.includes(r)));
//     }
//   };

//   const clearPinnedRows = () => {
//     setPinnedTopRows([]);
//     setPinnedBottomRows([]);
//   };

//   /* ------------------------------------------------------------------ */
//   /*  Render                                                            */
//   /* ------------------------------------------------------------------ */
//   return (
//     <div className="space-y-4">
//       {cardTitle && <h2 className="text-xl font-semibold">{cardTitle}</h2>}

//       {/* Barra de controles */}
//       <div className="flex flex-wrap items-center gap-2">
//         {/* ----- Column pin ----- */}
//         <button
//           onClick={clearPinned}
//           className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-800"
//         >
//           Clear&nbsp;Pinned&nbsp;Cols
//         </button>
//         <input
//           id="pinCol"
//           placeholder="Col (field)"
//           className="w-40 rounded border px-1 py-0.5 text-sm"
//         />
//         <button
//           onClick={togglePin}
//           className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-800"
//         >
//           Toggle&nbsp;Pin&nbsp;Col
//         </button>

//         {/* ----- Row pin (NOVO) ----- */}
//         <span className="ml-4 text-sm">Row&nbsp;(idx):</span>
//         <input
//           id="pinRow"
//           type="number"
//           placeholder="nº"
//           className="w-16 rounded border px-1 py-0.5 text-sm"
//         />
//         <button
//           onClick={pinRowTop}
//           className="rounded bg-blue-700 px-3 py-1 text-sm text-white hover:bg-blue-800"
//         >
//           Pin&nbsp;Top
//         </button>

//         <button
//           onClick={unpinSelectedPinned}
//           className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
//         >
//           Unpin&nbsp;Selected
//         </button>
//         <button
//           onClick={clearPinnedRows}
//           className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
//         >
//           Clear&nbsp;All&nbsp;Pinned&nbsp;Rows
//         </button>
//       </div>

//       {/* Grade de dados */}
//       <div className="ag-theme-alpine h-[650px] w-full">
//         <AgGridReact
//           ref={gridRef}
//           onGridReady={(p) => (gridRef.current = p.api)}
//           columnDefs={columnDefs}
//           defaultColDef={defaultColDef}
//           rowData={rowData}
//           rowSelection="single"
//           /* NOVO: pinned rows */
//           pinnedTopRowData={pinnedTopRows}
//           pinnedBottomRowData={pinnedBottomRows}
//         />
//       </div>
//     </div>
//   );
// }

import React, { useRef, useMemo, useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

export function AgGRIDDataTable({ columns, data, cardTitle = "" }) {
  /* refs */
  const gridRef = useRef(null); // componente
  const apiRef = useRef(null); // API do AG Grid

  /* estado */
  const [rowData] = useState(data);
  const [pinnedTopRows, setPinnedTopRows] = useState([]);

  /* colDefs */
  const columnDefs = useMemo(
    () =>
      columns.map((col) => {
        const def = {
          headerName: col.header || col.label,
          field: col.accessorKey,
          width: col.width ? parseInt(col.width, 10) : 150,
        };

        if (col.accessorKey === "price") {
          def.valueFormatter = ({ value }) =>
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value);
        }
        if (col.accessorKey === "status") {
          def.cellStyle = ({ value }) => ({
            color: value === "Ativo" ? "green" : "red",
            fontWeight: "bold",
          });
        }
        if (col.accessorKey === "id") {
          def.width = 50;
          def.cellStyle = { display: "flex", flex: 1 };
        }
        if (col.accessorKey === "Cliente") {
          def.width = 300;
          def.cellStyle = {
            backgroundColor: "#f0f0f0",
            color: "#333",
            fontWeight: "bold",
            flex: 1,
          };
        }
        return def;
      }),
    [columns]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      minWidth: 80,
    }),
    []
  );

  /* -------- helpers -------- */
  // colunas
  const pinFocusedColumn = useCallback(() => {
    const focused = apiRef.current?.getFocusedCell();
    if (!focused) return;
    const { column } = focused;
    apiRef.current.applyColumnState({
      state: [
        {
          colId: column.getColId(),
          pinned: column.getPinned() ? null : "left",
        },
      ],
      defaultState: { pinned: null },
    });
  }, []);

  const clearPinnedColumns = useCallback(() => {
    apiRef.current?.applyColumnState({ defaultState: { pinned: null } });
  }, []);

  // linhas
  const pinRowsToFocused = () => {
    const focused = apiRef.current?.getFocusedCell();
    if (!focused) return;
    const rows = [];
    for (let i = 0; i <= focused.rowIndex; i++) {
      const node = apiRef.current.getDisplayedRowAtIndex(i);
      if (node) rows.push({ ...node.data });
    }
    setPinnedTopRows(rows);
  };

  const clearPinnedRows = () => setPinnedTopRows([]);

  /* -------- render -------- */
  return (
    <div className="space-y-4">
      {cardTitle && <h2 className="text-xl font-semibold">{cardTitle}</h2>}

      {/* controles */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={pinFocusedColumn}
          className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-800"
        >
          Freeze&nbsp;Column
        </button>
        <button
          onClick={clearPinnedColumns}
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

      {/* grid */}
      <div className="ag-theme-alpine h-[650px] w-full">
        <AgGridReact
          ref={gridRef}
          onGridReady={({ api }) => (apiRef.current = api)}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rowData}
          rowSelection="single"
          pinnedTopRowData={pinnedTopRows}
        />
      </div>
    </div>
  );
}
