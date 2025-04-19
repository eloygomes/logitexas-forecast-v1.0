// src/components/MyDataTable.jsx
import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { themeAlpine } from "ag-grid-community";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
export function AgGRIDDataTable({ columns, data, cardTitle = "" }) {
  const gridRef = useRef(null);

  const [rowData, setRowData] = useState(data);
  const [colDefs, setColDefs] = useState(columns);

  // Build AG Grid column definitions
  const columnDefs = useMemo(
    () =>
      columns.map((col) => ({
        headerName: col.header || col.label,
        field: col.accessorKey,
        width: col.width ? parseInt(col.width, 10) : 150,
        editable: col.editable ?? false,
      })),
    [columns]
  );

  // Default column properties
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    }),
    []
  );

  // When grid is ready, keep API reference
  const onGridReady = useCallback((params) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  }, []);

  //   console.log("colDefs", colDefs);
  //   console.log("rowData", rowData);

  return (
    <div className="space-y-4">
      {cardTitle && <h2 className="text-xl font-semibold">{cardTitle}</h2>}
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Freeze from Selected Cell
      </button>
      <div className="ag-theme-alpine h-[1000px] w-full">
        <AgGridReact
          theme={themeAlpine}
          ref={gridRef}
          onGridReady={onGridReady}
          columnDefs={columnDefs}
          //   columnDefs={colDefs}
          defaultColDef={defaultColDef}
          //   rowData={data}
          rowData={rowData}
          rowSelection={{ mode: "singleRow" }}
        />
      </div>
    </div>
  );
}
