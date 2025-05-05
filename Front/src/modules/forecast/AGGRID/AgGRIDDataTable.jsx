import React, { useRef, useMemo, useEffect } from "react";
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
  isFilterOn,
  headerNames = {}, // novo prop para mapeamento manual
  headerStyles = {}, // mapeamento de estilos para headers
}) {
  const gridRef = useRef(null);
  const gridApiRef = apiReff;

  // Definição das colunas
  const columnDefs = useMemo(
    () =>
      columns.map((col) => {
        const def = {
          headerName: headerNames[col.accessorKey] ?? col.header ?? col.label,
          field: col.accessorKey,
          width: col.width ? parseInt(col.width, 10) : 150,
        };
        // Aplicar estilo personalizado ao header, se fornecido
        if (headerStyles[col.accessorKey]) {
          def.headerStyle = headerStyles[col.accessorKey];
        }

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
        if (col.accessorKey === "Q1_NAM_Total_estoque_cliente_PÇS_") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ffd90040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q1_NAM_Estoque_Projetado") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ffd90040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q1_NAM_Estoque_Ajustado") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ffd90040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q1_NAM_WOH") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ffd90040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q1_Abril") {
          def.width = 100;
          def.cellStyle = {
            backgroundColor: "#ffd90040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q1_Maio") {
          def.width = 100;
          def.cellStyle = {
            backgroundColor: "#ffd90040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q1_Junho") {
          def.width = 100;
          def.cellStyle = {
            backgroundColor: "#ffd90040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q1_Forecast_Q1") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ffd90040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q1_Total_Q1_ano_anterior") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ffd90040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q1_Forecast_Q1_Evento_Q1") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ffd90040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q1_Variação_YoY") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ffd90040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q2_Estoque_Projetado") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#40ff0040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q2_WOH") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#40ff0040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q2_Julho") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#40ff0040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q2_Agosto") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#40ff0040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q2_Setembro") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#40ff0040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q2_Forecast_Q2") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#40ff0040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q2_Total_Q2_ano_anterior") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#40ff0040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q2_Forecast_Q2_Evento_Q2") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#40ff0040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q2_Variação_YoY") {
          def.width = 100;
          def.cellStyle = {
            backgroundColor: "#40ff0040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q3_Estoque_Projetado") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#00c8ff40",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q3_WOH") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#00c8ff40",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q3_Outubro") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#00c8ff40",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q3_Novembro") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#00c8ff40",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q3_Dezembro") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#00c8ff40",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q3_Forecast_Q3") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#00c8ff40",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q3_Total_Q3_ano_anterior") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#00c8ff40",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q3_Forecast_Q3_Evento_Q3") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#00c8ff40",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q3_Variação_YoY") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#00c8ff40",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q4_Estoque_Projetado") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ff910040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q4_WOH") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ff910040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q4_Janeiro") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ff910040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q4_Fevereiro") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ff910040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q4_Março") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ff910040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q4_Forecast_Q4") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ff910040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q4_Total_Q4_ano_anterior") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ff910040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q4_Forecast_Q4_Evento_Q4") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ff910040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }
        if (col.accessorKey === "Q4_Variação_YoY") {
          def.width = 150;
          def.cellStyle = {
            backgroundColor: "#ff910040",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          };
        }

        return def;
      }),
    [columns, headerNames, headerStyles]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: isFilterOn,
      editable: true,
      minWidth: 80,
    }),
    [isFilterOn]
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
