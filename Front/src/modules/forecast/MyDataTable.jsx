// src/modules/forecast/MyDataTable.jsx
import React, { useState, useRef, useEffect } from "react";
import { VirtualizedDataTable } from "./VirtualizedDataTable.jsx";

// Configurações padrão para as colunas (por índice)
const defaultColumnStyles = [
  { width: "50px", headerBg: "#f0f0f0" }, // id
  { width: "200px", headerBg: "#e0e0e0" }, // cliente
  { width: "120px", headerBg: "#d1d1d1" }, // NAM
  { width: "120px", headerBg: "#d2d2d2" }, // MANAGER
  { width: "120px", headerBg: "#d3d3d3" }, // Part Number
  { width: "300px", headerBg: "#d4d4d4" }, // MKT_Name
  { width: "300px", headerBg: "#d5d5d5" }, // Runrate_NPI
  { width: "300px", headerBg: "#d6d6d6" }, // Product_Group
  { width: "300px", headerBg: "#d7d7d7" }, // CHAVE
  { width: "300px", headerBg: "#d8d8d8" }, // Q1_NAM_Total_estoque_cliente_PÇS_
  { width: "300px", headerBg: "#d9d9d9" }, // Q1_NAM_Estoque_Projetado
  { width: "300px", headerBg: "#dadada" }, // Q1_NAM_Estoque_Ajustado
  { width: "300px", headerBg: "#dbdbdb" }, // Q1_NAM_WOH
  { width: "300px", headerBg: "#dcdcdc" }, // Q1_Abril
  { width: "300px", headerBg: "#dddddd" }, // Q1_Maio
  { width: "300px", headerBg: "#dedede" }, // Q1_Junho
  { width: "300px", headerBg: "#dfdfdf" }, // Q1_Forecast_Q1
  { width: "300px", headerBg: "#e0e0e0" }, // Q1_Total_Q1_ano_anterior
  { width: "300px", headerBg: "#e1e1e1" }, // Q1_Forecast_Q1_Evento_Q1
  { width: "300px", headerBg: "#e2e2e2" }, // Q1_Variação_YoY
  { width: "300px", headerBg: "#e3e3e3" }, // Q2_Estoque_Projetado
  { width: "300px", headerBg: "#e4e4e4" }, // Q2_WOH
  { width: "300px", headerBg: "#e5e5e5" }, // Q2_Julho
  { width: "300px", headerBg: "#e6e6e6" }, // Q2_Agosto
  { width: "300px", headerBg: "#e7e7e7" }, // Q2_Setembro
  { width: "300px", headerBg: "#e8e8e8" }, // Q2_Forecast_Q2
  { width: "300px", headerBg: "#e9e9e9" }, // Q2_Total_Q2_ano_anterior
  { width: "300px", headerBg: "#eaeaea" }, // Q2_Forecast_Q2_Evento_Q2
  { width: "300px", headerBg: "#ebebeb" }, // Q2_Variação_YoY
  { width: "300px", headerBg: "#ececec" }, // Q3_Estoque_Projetado
  { width: "300px", headerBg: "#e4e4e4" }, // Q3_WOH
  { width: "300px", headerBg: "#e5e5e5" }, // Q3_Outubro;
  { width: "300px", headerBg: "#e6e6e6" }, // Q3_Novembro;
  { width: "300px", headerBg: "#e7e7e7" }, // Q3_Dezembro;
  { width: "300px", headerBg: "#e8e8e8" }, // Q3_Forecast_Q3;
  { width: "300px", headerBg: "#e9e9e9" }, // Q3_Total_Q3_ano_anterior;
  { width: "300px", headerBg: "#eaeaea" }, // Q3_Forecast_Q3_Evento_Q3;
  { width: "300px", headerBg: "#ebebeb" }, // Q3_Variação_YoY;
  { width: "300px", headerBg: "#ececec" }, // Q4_Estoque_Projetado
  { width: "300px", headerBg: "#e4e4e4" }, // Q4_WOH
  { width: "300px", headerBg: "#e5e5e5" }, // Q4_Janeiro;
  { width: "300px", headerBg: "#e6e6e6" }, // Q4_Fevereiro;
  { width: "300px", headerBg: "#e7e7e7" }, // Q4_Março;
  { width: "300px", headerBg: "#e8e8e8" }, // Q4_Forecast_Q4;
  { width: "300px", headerBg: "#e9e9e9" }, // Q4_Total_Q4_ano_anterior;
  { width: "300px", headerBg: "#eaeaea" }, // Q4_Forecast_Q4_Evento_Q4;
  { width: "300px", headerBg: "#ebebeb" }, // Q4_Variação_YoY;
];

export function MyDataTable({ columns, data }) {
  console.log(columns.length);
  // State para rastrear a célula selecionada (linha e coluna)
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const containerRef = useRef(null);

  // Modifica as colunas aplicando os estilos padrão quando não definidos
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

  // Cria a string de gridTemplateColumns com base no width de cada coluna
  const gridTemplateColumns = modifiedColumns.map((col) => col.width).join(" ");

  // Calcula a largura total para header e linhas
  const totalWidth = modifiedColumns.reduce((acc, col) => {
    // Extrai o número da string de width (assumindo que está em px)
    const width = parseInt(col.width, 10);
    return acc + (isNaN(width) ? 150 : width);
  }, 0);

  // Manipulador para navegação via teclado
  const handleKeyDown = (e) => {
    if (!data || data.length === 0) return;
    setSelectedCell((prev) => {
      let newRow = prev.row;
      let newCol = prev.col;
      switch (e.key) {
        case "ArrowRight":
          if (prev.col < modifiedColumns.length - 1) newCol = prev.col + 1;
          e.preventDefault();
          break;
        case "ArrowLeft":
          if (prev.col > 0) newCol = prev.col - 1;
          e.preventDefault();
          break;
        case "ArrowDown":
          if (prev.row < data.length - 1) newRow = prev.row + 1;
          e.preventDefault();
          break;
        case "ArrowUp":
          if (prev.row > 0) newRow = prev.row - 1;
          e.preventDefault();
          break;
        default:
          break;
      }
      return { row: newRow, col: newCol };
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Renderiza o header usando CSS Grid e aplica o background específico de cada coluna
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
          {col.header}
        </div>
      ))}
    </div>
  );

  // Renderiza cada linha; cada célula recebe um onClick para atualizar a célula selecionada
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
        return (
          <div
            key={colIndex}
            className={`p-2 border break-words whitespace-normal text-sm cursor-pointer ${
              isSelected ? "bg-gray-800 text-gray-50" : "text-gray-800"
            }`}
            onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
          >
            {rowData[col.accessorKey]}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className="overflow-x-auto border rounded"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
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
  );
}
