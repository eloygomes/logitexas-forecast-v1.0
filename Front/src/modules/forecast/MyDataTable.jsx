import React, { useState, useRef, useEffect } from "react";
import { VirtualizedDataTable } from "./VirtualizedDataTable.jsx";
import {
  showSuccess,
  showError,
} from "../../components/sooner/SonnerToastProvider.jsx";

// Configurações padrão para as colunas (por índice) - 47 itens já definidos
const defaultColumnStyles = [
  { width: "80px", headerBg: "#f0f0f0", label: "id" }, // 1
  { width: "200px", headerBg: "#e0e0e0", label: "Cliente" }, // 2
  { width: "120px", headerBg: "#d1d1d1", label: "NAM" }, // 3
  { width: "150px", headerBg: "#d2d2d2", label: "MANAGER" }, // 4
  { width: "130px", headerBg: "#d3d3d3", label: "Part Number" }, // 5
  { width: "500px", headerBg: "#d4d4d4", label: "Descrição do produto" }, // 6
  { width: "300px", headerBg: "#d5d5d5", label: "Runrate NPI" }, // 7
  { width: "300px", headerBg: "#d6d6d6", label: "Product Group" }, // 8
  { width: "300px", headerBg: "#d7d7d7", label: "CHAVE" }, // 9
  {
    width: "100px",
    headerBg: "#EE9B00",
    label: "Estoque Cliente (PÇS)",
  },
  { width: "100px", headerBg: "#EE9B00", label: "Estoque Projetado" },
  { width: "100px", headerBg: "#EE9B00", label: "Estoque Ajustado" },
  { width: "100px", headerBg: "#EE9B00", label: "WOH" },
  { width: "100px", headerBg: "#EE9B00", label: "Abril" },
  { width: "100px", headerBg: "#EE9B00", label: "Maio" },
  { width: "100px", headerBg: "#EE9B00", label: "Junho" },
  { width: "100px", headerBg: "#EE9B00", label: "Forecast Q1" },
  { width: "100px", headerBg: "#EE9B00", label: "Total Q1 Ano Anterior" },
  { width: "100px", headerBg: "#EE9B00", label: "Forecast & Evento Q1" },
  { width: "100px", headerBg: "#EE9B00", label: "Variação YoY" },
  { width: "100px", headerBg: "#0A9396", label: "Estoque_Projetado" },
  { width: "100px", headerBg: "#0A9396", label: "WOH" },
  { width: "100px", headerBg: "#0A9396", label: "Julho" },
  { width: "100px", headerBg: "#0A9396", label: "Agosto" },
  { width: "100px", headerBg: "#0A9396", label: "Setembro" },
  { width: "100px", headerBg: "#0A9396", label: "Forecast_Q2" },
  { width: "100px", headerBg: "#0A9396", label: "Total Q2 Ano Anterior" },
  { width: "100px", headerBg: "#0A9396", label: "Forecast Q2 Evento Q2" },
  { width: "100px", headerBg: "#0A9396", label: "Variação_YoY" },
  { width: "100px", headerBg: "#94D2BD", label: "Estoque_Projetado" },
  { width: "100px", headerBg: "#94D2BD", label: "WOH" },
  { width: "100px", headerBg: "#94D2BD", label: "Outubro" },
  { width: "100px", headerBg: "#94D2BD", label: "Novembro" },
  { width: "100px", headerBg: "#94D2BD", label: "Dezembro" },
  { width: "100px", headerBg: "#94D2BD", label: "Forecast Q3" },
  { width: "100px", headerBg: "#94D2BD", label: "Total Q3 Ano Anterior" },
  { width: "100px", headerBg: "#94D2BD", label: "Forecast Q3 Evento Q3" },
  { width: "100px", headerBg: "#94D2BD", label: "Variação YoY" },
  { width: "100px", headerBg: "#E9D8A6", label: "Estoque Projetado" },
  { width: "100px", headerBg: "#E9D8A6", label: "WOH" },
  { width: "100px", headerBg: "#E9D8A6", label: "Janeiro" },
  { width: "100px", headerBg: "#E9D8A6", label: "Fevereiro" },
  { width: "100px", headerBg: "#E9D8A6", label: "Março" },
  { width: "100px", headerBg: "#E9D8A6", label: "Forecast Q4" },
  { width: "100px", headerBg: "#E9D8A6", label: "Total Q4 ano anterior" },
  { width: "100px", headerBg: "#E9D8A6", label: "Forecast Q4 Evento Q4" },
  { width: "100px", headerBg: "#E9D8A6", label: "Variação YoY" },
];

export function MyDataTable({
  columns,
  data,
  setTableData,
  cardTitle,
  refetchData,
  search,
}) {
  // Estado para célula selecionada
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  // Estado para célula em edição
  const [editingCell, setEditingCell] = useState(null);
  // Ref do container para capturar eventos de teclado e scroll
  const containerRef = useRef(null);

  // Aplica os estilos padrão às colunas (largura e cor do header)
  const modifiedColumns = columns.map((col, index) => ({
    ...col,
    width:
      col.width ||
      (defaultColumnStyles[index] && defaultColumnStyles[index].width) ||
      "150px",

    // b) Use headerBg from either the column itself or fallback to defaultColumnStyles
    headerBg:
      col.headerBg ||
      (defaultColumnStyles[index] && defaultColumnStyles[index].headerBg) ||
      "gray",

    // c) Here we inject a "label" that we can use as a fallback if col.header doesn’t exist
    label:
      col.label ||
      (defaultColumnStyles[index] && defaultColumnStyles[index].label) ||
      (typeof col.header === "string" ? col.header : "sem nome"),
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
      setTableData((prevData) => {
        const updatedData = [...prevData];
        updatedData[selectedCell.row] = {
          ...updatedData[selectedCell.row],
          [colKey]: e.key,
          isDirty: true,
        };
        return updatedData;
      });
      return;
    }

    // Teclas de navegação
    setSelectedCell((prev) => {
      let newRow = prev.row;
      let newCol = prev.col;
      const totalRows = data.length;
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
          className="p-2 text-center font-bold border break-words whitespace-normal py-5"
          style={{ backgroundColor: col.headerBg, color: "black" }}
        >
          {/* {typeof col.header === "function" ? col.header() : col.header} */}
          {typeof col.header === "function" ? col.header() : col.label}
        </div>
      ))}
    </div>
  );

  // Render de cada linha
  const renderRow = (rowData, rowIndex) => (
    <div
      className="grid border-b bg-gray-200 text-center"
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
                  setTableData((prevData) => {
                    const updatedData = [...prevData];
                    updatedData[rowIndex] = {
                      ...updatedData[rowIndex],
                      [col.accessorKey]: e.target.value,
                      isDirty: true,
                    };
                    return updatedData;
                  })
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
                      row: prev.row < data.length - 1 ? prev.row + 1 : prev.row,
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
      className="p-0 space-y-4 cursor-pointer"
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
        </div>
      </div>

      {/* Container scrollável vertical/horizontal */}
      <div
        ref={containerRef}
        className="overflow-auto border rounded"
        // style={{ maxHeight: "600px" }}
      >
        <div style={{ width: totalWidth }}>
          {header}
          <VirtualizedDataTable
            columns={modifiedColumns}
            data={data}
            rowHeight={40}
            height={400}
            renderRow={renderRow}
          />
        </div>
      </div>
    </div>
  );
}
