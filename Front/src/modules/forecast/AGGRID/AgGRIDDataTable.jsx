import React, { useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeAlpine,
} from "ag-grid-community";

// Registrar módulos AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

export function AgGRIDDataTable({
  columns,
  data,
  cardTitle,
  pinnedTopRows,
  onClearColumns,
  onPinRow,
  onClearRows,
  pinFocusedColumn,
  apiReff,
  onCellValueChanged,
}) {
  const gridRef = useRef(null);
  const gridApiRef = apiReff;

  // Definição das colunas
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

  // Definições padrão de coluna
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

  return (
    <div className="space-y-4">
      {/* Grade de dados AG Grid */}
      <div className="ag-theme-alpine h-[90vh] w-full">
        <AgGridReact
          ref={gridRef}
          onGridReady={({ api }) => (gridApiRef.current = api)}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={data}
          pinnedTopRowData={pinnedTopRows}
          theme={themeAlpine}
          rowSelection={{ type: "multiple" }}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
}
