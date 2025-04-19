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
      columns.map((col) => {
        // base da coluna
        const def = {
          headerName: col.header || col.label,
          field: col.accessorKey,
          width: col.width ? parseInt(col.width, 10) : 150,
          editable: col.editable ?? false,
        };

        // formata preço em BRL
        if (col.accessorKey === "price") {
          def.valueFormatter = (params) =>
            // Intl pega formatação local; aqui BRL
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(params.value);
        }

        // colore o status: ativo em verde, outro em vermelho
        if (col.accessorKey === "status") {
          def.cellStyle = (params) => ({
            color: params.value === "Ativo" ? "green" : "red",
            fontWeight: "bold",
          });
        }

        if (col.accessorKey === "id") {
          def.width = 50; // força 200px de largura
          def.cellStyle = {
            // estilo inline na célula
            display: "flex",
            flex: 1,
            fontWeight: "bold",
          };
        }

        if (col.accessorKey === "Cliente") {
          def.width = 300; // força 200px de largura
          def.cellStyle = {
            // estilo inline na célula
            backgroundColor: "#f0f0f0", // cor de fundo
            color: "#333", // opcional: cor do texto
            fontWeight: "bold",
            flex: 1,
          };
          // ou, usando classe CSS/Tailwind:
          // def.cellClass = 'bg-gray-200 text-gray-800 font-bold';
        }

        return def;
      }),
    [columns]
  );

  // Default column properties
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,

      minWidth: 80,
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
