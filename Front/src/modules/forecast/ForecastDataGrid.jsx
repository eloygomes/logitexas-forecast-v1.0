import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/ui/data-table";

export default function ForecastDataGrid({
  cardTitle,
  initialData,
  columns,
  refetchData,
}) {
  const [data, setData] = useState([...initialData]);
  const [search, setSearch] = useState("");
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const [editingCell, setEditingCell] = useState(null);

  const containerRef = useRef(null);

  // Objeto de formatações personalizadas para os dados das células
  const customFormatters = {
    id: ({ row, column }) => (
      <div className="text-center w-full">{String(data[row.index]["id"])}</div>
    ),
    Cliente: ({ row, column }) => (
      <div className="text-start w-full">
        {String(data[row.index]["Cliente"])}
      </div>
    ),
    NAM: ({ row, column }) => (
      <div className="text-center w-full">{String(data[row.index]["NAM"])}</div>
    ),
    MANAGER: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["MANAGER"])}
      </div>
    ),
    Part_Number: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Part_Number"])}
      </div>
    ),
    MKT_Name: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["MKT_Name"])}
      </div>
    ),
    Runrate_NPI: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Runrate_NPI"])}
      </div>
    ),
    Product_Group: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Product_Group"])}
      </div>
    ),
    CHAVE: ({ row, column }) => (
      <div className="text-start w-full">
        {String(data[row.index]["CHAVE"])}
      </div>
    ),
    Q1_NAM_Total_estoque_cliente_PÇS_: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Q1_NAM_Total_estoque_cliente_PÇS_"])}
      </div>
    ),
    Q1_NAM_Estoque_Projetado: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Q1_NAM_Estoque_Projetado"])}
      </div>
    ),
    Q1_NAM_Estoque_Ajustado: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Q1_NAM_Estoque_Ajustado"])}
      </div>
    ),
    Q1_NAM_WOH: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Q1_NAM_WOH"])}
      </div>
    ),
    Q1_Abril: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Q1_Abril"])}
      </div>
    ),
    Q1_Maio: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Q1_Maio"])}
      </div>
    ),
    Q1_Junho: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Q1_Junho"])}
      </div>
    ),
    Q1_Forecast_Q1: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Q1_Forecast_Q1"])}
      </div>
    ),
    Q1_Total_Q1_ano_anterior: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Q1_Total_Q1_ano_anterior"])}
      </div>
    ),
    Q1_Forecast_Q1_Evento_Q1: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Q1_Forecast_Q1_Evento_Q1"])}
      </div>
    ),
    Q1_Variação_YoY: ({ row, column }) => (
      <div className="text-center w-full">
        {String(data[row.index]["Q1_Variação_YoY"])}
      </div>
    ),
  };

  // Objeto para definir classes de background dos cabeçalhos (headers) para cada coluna
  const customHeaderColors = {
    Q1_NAM_Total_estoque_cliente_PÇS_:
      "bg-yellow-200 p-2 px-4 rounded-sm text-blue-900",
    Q1_NAM_Estoque_Projetado: "bg-yellow-200 p-2 px-4 rounded-sm text-blue-900",
    Q1_NAM_Estoque_Ajustado: "bg-yellow-200 p-2 px-4 rounded-sm text-blue-900",
    Q1_NAM_WOH: "bg-yellow-200 p-2 px-4 rounded-sm text-blue-900",
    Q1_Abril: "bg-yellow-200 p-2 px-4 rounded-sm text-blue-900",
    Q1_Maio: "bg-yellow-200 p-2 px-4 rounded-sm text-blue-900",
    Q1_Junho: "bg-yellow-200 p-2 px-4 rounded-sm text-blue-900",
    Q1_Forecast_Q1: "bg-yellow-200 p-2 px-4 rounded-sm text-blue-900",
    Q1_Total_Q1_ano_anterior: "bg-yellow-200 p-2 px-4 rounded-sm text-blue-900",
    Q1_Forecast_Q1_Evento_Q1: "bg-yellow-200 p-2 px-4 rounded-sm text-blue-900",
    Q1_Variação_YoY: "bg-yellow-200 p-2 px-4 rounded-sm text-blue-900",
  };

  // Atualiza os dados quando o initialData muda
  useEffect(() => {
    setData([...initialData]);
  }, [initialData]);

  // Efeito para scroll automático na célula ativa
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector(
      `[data-row-index="${activeCell.row}"][data-col-index="${activeCell.col}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [activeCell]);

  // Gerencia navegação e ativação do modo de edição via teclado
  const handleKeyDown = (event) => {
    // Se o foco estiver num input, verifica se é o ESC para sair da edição
    if (event.target.tagName.toLowerCase() === "input") {
      if (event.key === "Escape") {
        setEditingCell(null);
        containerRef.current?.focus();
      }
      return;
    }

    // Se não estiver em modo de edição e o usuário começar a digitar, ativa a edição
    if (
      !editingCell &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault(); // Evita que a tecla seja registrada novamente
      const colKey = columns[activeCell.col].accessorKey;
      setEditingCell({
        row: activeCell.row,
        col: activeCell.col,
        key: colKey,
      });
      // Inicia a célula com a tecla digitada
      handleCellEdit(activeCell.row, colKey, event.key);
      return;
    }

    // F2 também ativa o modo de edição
    if (event.key === "F2") {
      setEditingCell({
        row: activeCell.row,
        col: activeCell.col,
        key: columns[activeCell.col].accessorKey,
      });
      return;
    }

    event.preventDefault();

    // Navegação com setas e Tab
    setActiveCell((prev) => {
      let { row, col } = prev;
      const totalRows = data.length;
      const totalCols = columns.length;

      switch (event.key) {
        case "ArrowRight":
          col = col < totalCols - 1 ? col + 1 : col;
          break;
        case "ArrowLeft":
          col = col > 0 ? col - 1 : col;
          break;
        case "ArrowDown":
          row = row < totalRows - 1 ? row + 1 : row;
          break;
        case "ArrowUp":
          row = row > 0 ? row - 1 : row;
          break;
        case "Tab":
          col = col < totalCols - 1 ? col + 1 : 0;
          if (col === 0 && row < totalRows - 1) row++;
          break;
        default:
          return prev;
      }
      return { row, col };
    });
  };

  // Atualiza a célula clicada
  const handleCellClick = (rowIndex, colIndex) => {
    setActiveCell({ row: rowIndex, col: colIndex });
  };

  // Ativa o modo de edição ao dar duplo clique na célula
  const handleCellDoubleClick = (rowIndex, colIndex, colKey) => {
    setEditingCell({ row: rowIndex, col: colIndex, key: colKey });
  };

  // Atualiza o valor da célula editada no buffer de dados
  const handleCellEdit = (rowIndex, colKey, newValue) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      // Mark the record as dirty and update the field
      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        [colKey]: newValue,
        isDirty: true,
      };
      return updatedData;
    });
  };

  // Envia os dados atualizados para o endpoint da API
  const handleSave = async () => {
    // Filtra os registros que foram modificados (marcados com isDirty)
    const modifiedRecords = data.filter((record) => record.isDirty);

    if (modifiedRecords.length === 0) {
      console.log("Nenhum registro modificado para salvar.");
      return;
    }

    // Recupera o token do localStorage
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
      if (!response.ok) {
        throw new Error("Erro ao salvar os dados");
      }
      const result = await response.json();
      console.log("Dados salvos com sucesso:", result);
      // Limpa a flag isDirty
      setData((prevData) =>
        prevData.map((record) => ({ ...record, isDirty: false }))
      );
      // Chama o refetch passado via props para atualizar os dados
      if (refetchData) {
        refetchData();
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  // Atualiza as colunas para incluir header customizado e a célula com funcionalidade de edição
  const updatedColumns = columns.map((col, colIndex) => {
    let headerText = col.header || col.accessorKey;

    if (col.accessorKey === "id") headerText = "id";
    if (col.accessorKey === "Cliente") headerText = "Cliente";
    if (col.accessorKey === "NAM") headerText = "NAM";
    if (col.accessorKey === "MANAGER") headerText = "MANAGER";
    if (col.accessorKey === "Part_Number") headerText = "Part Number";
    if (col.accessorKey === "MKT_Name") headerText = "Descrição";
    if (col.accessorKey === "Runrate_NPI") headerText = "Runrate NPI";
    if (col.accessorKey === "Product_Group") headerText = "Product Group";
    if (col.accessorKey === "CHAVE") headerText = "CHAVE";
    if (col.accessorKey === "Q1_NAM_Total_estoque_cliente_PÇS_")
      headerText = "Q1-Total Estoque Cliente";
    if (col.accessorKey === "Q1_NAM_Estoque_Projetado")
      headerText = "Q1-Estoque Projetado";
    if (col.accessorKey === "Q1_NAM_Estoque_Ajustado")
      headerText = "Q1-Estoque Ajustado";
    if (col.accessorKey === "Q1_NAM_WOH") headerText = "Q1-Estoque Ajustado";
    if (col.accessorKey === "Q1_Abril") headerText = "Q1-Abril";
    if (col.accessorKey === "Q1_Maio") headerText = "Q1-Maio";
    if (col.accessorKey === "Q1_Junho") headerText = "Q1-Junho";
    if (col.accessorKey === "Q1_Forecast_Q1") headerText = "Q1-Forecast";
    if (col.accessorKey === "Q1_Total_Q1_ano_anterior")
      headerText = "Total Q1 ano anterior";
    if (col.accessorKey === "Q1_Forecast_Q1_Evento_Q1")
      headerText = "Forecast Q1 Evento Q1";
    if (col.accessorKey === "Q1_Variação_YoY") headerText = "Q1-Variação YoY";

    return {
      ...col,
      header: () => (
        <div
          className={`text-center text-white ${
            customHeaderColors[col.accessorKey] || "bg-transparent rounded-md"
          }`}
        >
          {headerText}
        </div>
      ),
      cell: ({ row, column }) => {
        const isActive =
          row.index === activeCell.row && colIndex === activeCell.col;
        const isEditing =
          editingCell &&
          editingCell.row === row.index &&
          editingCell.col === colIndex &&
          editingCell.key === col.accessorKey;

        const cellValue = data[row.index][col.accessorKey];

        return (
          <div
            data-row-index={row.index}
            data-col-index={colIndex}
            className={`p-0.5 border-2 rounded-sm ${
              isActive
                ? "bg-gray-600 text-white border-gray-800"
                : "border-transparent"
            }`}
            onClick={() => handleCellClick(row.index, colIndex)}
            onDoubleClick={() =>
              handleCellDoubleClick(row.index, colIndex, col.accessorKey)
            }
            style={{ boxSizing: "border-box" }}
          >
            {isEditing ? (
              <input
                type="text"
                value={cellValue}
                onChange={(e) =>
                  handleCellEdit(row.index, col.accessorKey, e.target.value)
                }
                onBlur={() => {
                  setEditingCell(null);
                  containerRef.current?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setEditingCell(null);
                    setActiveCell((prev) => {
                      const totalRows = data.length;
                      const newRow =
                        prev.row < totalRows - 1 ? prev.row + 1 : prev.row;
                      return { ...prev, row: newRow };
                    });
                    containerRef.current?.focus();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    setEditingCell(null);
                    containerRef.current?.focus();
                  }
                }}
                className="w-full h-full p-0 m-0 bg-gray-600 text-white border-gray-800  border-0 focus:outline-none appearance-none text-sm"
                autoFocus
              />
            ) : customFormatters[col.accessorKey] ? (
              customFormatters[col.accessorKey]({ row, column })
            ) : (
              cellValue
            )}
          </div>
        );
      },
    };
  });

  // Função para normalizar strings na busca
  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // Filtra os dados conforme o valor da busca
  const filteredData = data.filter((row) => {
    if (!search.trim()) return true;
    const tokens = normalize(search).split(/\s+/);
    return tokens.every((token) =>
      Object.values(row).some((val) => normalize(String(val)).includes(token))
    );
  });

  return (
    <div
      className="p-4 space-y-4 cursor-pointer"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ outline: "none" }}
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
            onChange={(e) => setSearch(e.target.value)}
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
      <DataTable
        columns={updatedColumns}
        data={filteredData}
        meta={{ updateData: () => {} }}
      />
    </div>
  );
}
