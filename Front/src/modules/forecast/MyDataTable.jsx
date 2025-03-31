// src/modules/forecast/MyDataTable.jsx
import React, { useState, useRef, useEffect } from "react";
import { VirtualizedDataTable } from "./VirtualizedDataTable.jsx";
import {
  showSuccess,
  showError,
} from "../../components/sooner/SonnerToastProvider.jsx";

// Configurações padrão para as colunas (por índice) - 47 itens já definidos
const defaultColumnStyles = [
  { width: "80px", headerBg: "#f0f0f0" }, // Coluna 1 (ex: id)
  { width: "200px", headerBg: "#e0e0e0" }, // Coluna 2 (ex: Cliente)
  { width: "120px", headerBg: "#d1d1d1" }, // Coluna 3 (ex: NAM)
  { width: "120px", headerBg: "#d2d2d2" }, // Coluna 4 (ex: MANAGER)
  { width: "120px", headerBg: "#d3d3d3" }, // Coluna 5 (ex: Part Number)
  { width: "500px", headerBg: "#d4d4d4" }, // Coluna 6 (ex: MKT_Name)
  { width: "300px", headerBg: "#d5d5d5" }, // Coluna 7 (ex: Runrate_NPI)
  { width: "300px", headerBg: "#d6d6d6" }, // Coluna 8 (ex: Product_Group)
  { width: "300px", headerBg: "#d7d7d7" }, // Coluna 9 (ex: CHAVE)
  { width: "300px", headerBg: "#d8d8d8" }, // Coluna 10 (ex: Q1_NAM_Total_estoque_cliente_PÇS_)
  { width: "300px", headerBg: "#d9d9d9" }, // Coluna 11 (ex: Q1_NAM_Estoque_Projetado)
  { width: "300px", headerBg: "#dadada" }, // Coluna 12 (ex: Q1_NAM_Estoque_Ajustado)
  { width: "300px", headerBg: "#dbdbdb" }, // Coluna 13 (ex: Q1_NAM_WOH)
  { width: "300px", headerBg: "#dcdcdc" }, // Coluna 14 (ex: Q1_Abril)
  { width: "300px", headerBg: "#dddddd" }, // Coluna 15 (ex: Q1_Maio)
  { width: "300px", headerBg: "#dedede" }, // Coluna 16 (ex: Q1_Junho)
  { width: "300px", headerBg: "#dfdfdf" }, // Coluna 17 (ex: Q1_Forecast_Q1)
  { width: "300px", headerBg: "#e0e0e0" }, // Coluna 18 (ex: Q1_Total_Q1_ano_anterior)
  { width: "300px", headerBg: "#e1e1e1" }, // Coluna 19 (ex: Q1_Forecast_Q1_Evento_Q1)
  { width: "300px", headerBg: "#e2e2e2" }, // Coluna 20 (ex: Q1_Variação_YoY)
  { width: "300px", headerBg: "#e3e3e3" }, // Coluna 21 (ex: Q2_Estoque_Projetado)
  { width: "300px", headerBg: "#e4e4e4" }, // Coluna 22 (ex: Q2_WOH)
  { width: "300px", headerBg: "#e5e5e5" }, // Coluna 23 (ex: Q2_Julho)
  { width: "300px", headerBg: "#e6e6e6" }, // Coluna 24 (ex: Q2_Agosto)
  { width: "300px", headerBg: "#e7e7e7" }, // Coluna 25 (ex: Q2_Setembro)
  { width: "300px", headerBg: "#e8e8e8" }, // Coluna 26 (ex: Q2_Forecast_Q2)
  { width: "300px", headerBg: "#e9e9e9" }, // Coluna 27 (ex: Q2_Total_Q2_ano_anterior)
  { width: "300px", headerBg: "#eaeaea" }, // Coluna 28 (ex: Q2_Forecast_Q2_Evento_Q2)
  { width: "300px", headerBg: "#ebebeb" }, // Coluna 29 (ex: Q2_Variação_YoY)
  { width: "300px", headerBg: "#ececec" }, // Coluna 30 (ex: Q3_Estoque_Projetado)
  { width: "300px", headerBg: "#e4e4e4" }, // Coluna 31 (ex: Q3_WOH)
  { width: "300px", headerBg: "#e5e5e5" }, // Coluna 32 (ex: Q3_Outubro)
  { width: "300px", headerBg: "#e6e6e6" }, // Coluna 33 (ex: Q3_Novembro)
  { width: "300px", headerBg: "#e7e7e7" }, // Coluna 34 (ex: Q3_Dezembro)
  { width: "300px", headerBg: "#e8e8e8" }, // Coluna 35 (ex: Q3_Forecast_Q3)
  { width: "300px", headerBg: "#e9e9e9" }, // Coluna 36 (ex: Q3_Total_Q3_ano_anterior)
  { width: "300px", headerBg: "#eaeaea" }, // Coluna 37 (ex: Q3_Forecast_Q3_Evento_Q3)
  { width: "300px", headerBg: "#ebebeb" }, // Coluna 38 (ex: Q3_Variação_YoY)
  { width: "300px", headerBg: "#ececec" }, // Coluna 39 (ex: Q4_Estoque_Projetado)
  { width: "300px", headerBg: "#e4e4e4" }, // Coluna 40 (ex: Q4_WOH)
  { width: "300px", headerBg: "#e5e5e5" }, // Coluna 41 (ex: Q4_Janeiro)
  { width: "300px", headerBg: "#e6e6e6" }, // Coluna 42 (ex: Q4_Fevereiro)
  { width: "300px", headerBg: "#e7e7e7" }, // Coluna 43 (ex: Q4_Março)
  { width: "300px", headerBg: "#e8e8e8" }, // Coluna 44 (ex: Q4_Forecast_Q4)
  { width: "300px", headerBg: "#e9e9e9" }, // Coluna 45 (ex: Q4_Total_Q4_ano_anterior)
  { width: "300px", headerBg: "#eaeaea" }, // Coluna 46 (ex: Q4_Forecast_Q4_Evento_Q4)
  { width: "300px", headerBg: "#ebebeb" }, // Coluna 47 (ex: Q4_Variação_YoY)
];

export function MyDataTable({ columns, data, cardTitle, refetchData, search }) {
  // Estado para armazenar os dados que serão renderizados (cópia de 'data')
  const [tableData, setTableData] = useState([]);
  // Estado para célula selecionada
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  // Estado para célula em edição
  const [editingCell, setEditingCell] = useState(null);
  // Ref do container para capturar eventos de teclado e scroll
  const containerRef = useRef(null);

  // Atualiza tableData sempre que 'data' mudar
  useEffect(() => {
    setTableData([...data]);
  }, [data]);

  // Aplica os estilos padrão às colunas (largura e cor do header)
  const modifiedColumns = columns.map((col, index) => ({
    ...col,
    width:
      col.width ||
      (defaultColumnStyles[index] && defaultColumnStyles[index].width) ||
      "150px",
    headerBg:
      col.headerBg ||
      (defaultColumnStyles[index] && defaultColumnStyles[index].headerBg) ||
      "gray",
  }));

  // gridTemplateColumns e totalWidth
  const gridTemplateColumns = modifiedColumns.map((col) => col.width).join(" ");
  const totalWidth = modifiedColumns.reduce((acc, col) => {
    const width = parseInt(col.width, 10);
    return acc + (isNaN(width) ? 150 : width);
  }, 0);

  // Efeito para que, sempre que selectedCell mudar, role a célula para a visão
  useEffect(() => {
    if (!containerRef.current) return;
    const cellSelector = `[data-row-index='${selectedCell.row}'][data-col-index='${selectedCell.col}']`;
    const cellEl = containerRef.current.querySelector(cellSelector);
    if (cellEl) {
      cellEl.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedCell]);

  // Navegação via teclado
  const handleKeyDown = (e) => {
    // Se estiver num input e pressionar Esc
    if (e.target.tagName.toLowerCase() === "input") {
      if (e.key === "Escape") {
        setEditingCell(null);
        containerRef.current?.focus();
      }
      return;
    }

    // Se não estiver editando e a tecla for imprimível
    if (
      !editingCell &&
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      e.preventDefault();
      const colKey = modifiedColumns[selectedCell.col].accessorKey;
      setEditingCell({
        row: selectedCell.row,
        col: selectedCell.col,
        key: colKey,
      });
      handleCellEdit(selectedCell.row, colKey, e.key);
      return;
    }

    // Teclas de navegação
    setSelectedCell((prev) => {
      let newRow = prev.row;
      let newCol = prev.col;
      const totalRows = tableData.length;
      const totalCols = modifiedColumns.length;

      switch (e.key) {
        case "ArrowRight":
          if (prev.col < totalCols - 1) newCol = prev.col + 1;
          e.preventDefault();
          break;
        case "ArrowLeft":
          if (prev.col > 0) newCol = prev.col - 1;
          e.preventDefault();
          break;
        case "ArrowDown":
          if (prev.row < totalRows - 1) newRow = prev.row + 1;
          e.preventDefault();
          break;
        case "ArrowUp":
          if (prev.row > 0) newRow = prev.row - 1;
          e.preventDefault();
          break;
        case "Tab":
          newCol = prev.col < totalCols - 1 ? prev.col + 1 : 0;
          if (newCol === 0 && prev.row < totalRows - 1) newRow = prev.row + 1;
          e.preventDefault();
          break;
        default:
          return prev;
      }
      return { row: newRow, col: newCol };
    });
  };

  // Edição de célula
  const handleCellEdit = (rowIndex, colKey, newValue) => {
    setTableData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        [colKey]: newValue,
        isDirty: true,
      };
      return updatedData;
    });
  };

  // Salvar dados
  const handleSave = async () => {
    const modifiedRecords = tableData.filter((record) => record.isDirty);
    if (modifiedRecords.length === 0) {
      console.log("Nenhum registro modificado para salvar.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token não encontrado. Faça login novamente.");
      return;
    }
    try {
      const response = await fetch(
        "https://api.logihub.space/api/update-forecast",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ records: modifiedRecords }),
        }
      );
      if (!response.ok) throw new Error("Erro ao salvar os dados");
      const result = await response.json();
      console.log("Dados salvos com sucesso:", result);
      showSuccess("Dados salvos com sucesso!");
      // limpa a flag isDirty
      setTableData((prev) =>
        prev.map((record) => ({ ...record, isDirty: false }))
      );
      if (refetchData) refetchData();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Render do header
  const header = (
    <div
      className="grid border-b"
      style={{
        width: totalWidth,
        gridTemplateColumns,
      }}
    >
      {modifiedColumns.map((col, index) => (
        <div
          key={index}
          className="p-2 text-center font-bold border break-words whitespace-normal"
          style={{ backgroundColor: col.headerBg, color: "black" }}
        >
          {typeof col.header === "function" ? col.header() : col.header}
        </div>
      ))}
    </div>
  );

  // Render de cada linha
  const renderRow = (rowData, rowIndex) => (
    <div
      className="grid border-b bg-gray-200"
      style={{
        width: totalWidth,
        gridTemplateColumns,
      }}
    >
      {modifiedColumns.map((col, colIndex) => {
        const isSelected =
          selectedCell.row === rowIndex && selectedCell.col === colIndex;
        const isEditing =
          editingCell &&
          editingCell.row === rowIndex &&
          editingCell.col === colIndex &&
          editingCell.key === col.accessorKey;

        const cellValue = rowData[col.accessorKey];
        return (
          <div
            key={colIndex}
            data-row-index={rowIndex}
            data-col-index={colIndex}
            className={`p-2 border break-words whitespace-normal text-sm cursor-pointer ${
              isSelected ? "bg-gray-800 text-gray-50" : "text-gray-800"
            }`}
            onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
            onDoubleClick={() =>
              setEditingCell({
                row: rowIndex,
                col: colIndex,
                key: col.accessorKey,
              })
            }
          >
            {isEditing ? (
              <input
                type="text"
                value={cellValue}
                onChange={(e) =>
                  handleCellEdit(rowIndex, col.accessorKey, e.target.value)
                }
                onBlur={() => {
                  setEditingCell(null);
                  containerRef.current?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setEditingCell(null);
                    setSelectedCell((prev) => ({
                      ...prev,
                      row:
                        prev.row < tableData.length - 1
                          ? prev.row + 1
                          : prev.row,
                    }));
                    containerRef.current?.focus();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    setEditingCell(null);
                    containerRef.current?.focus();
                  }
                }}
                className="w-full h-full p-0 m-0 bg-gray-600 text-white border-0 focus:outline-none text-sm"
                autoFocus
              />
            ) : (
              cellValue
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className="p-4 space-y-4 cursor-pointer"
      style={{ outline: "none" }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
            {cardTitle}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Buscar na tabela..."
            value={search}
            onChange={(e) => {
              /* Se necessário, implementar lógica de busca */
            }}
            className="max-w-sm border p-2 rounded-md"
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>

      {/* Container scrollável vertical/horizontal */}
      <div
        ref={containerRef}
        className="overflow-auto border rounded"
        style={{ maxHeight: "600px" }}
      >
        <div style={{ width: totalWidth }}>
          {header}
          <VirtualizedDataTable
            columns={modifiedColumns}
            data={tableData}
            rowHeight={40}
            height={400}
            renderRow={renderRow}
          />
        </div>
      </div>
    </div>
  );
}
