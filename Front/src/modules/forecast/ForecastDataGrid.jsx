import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/ui/data-table";

export default function ForecastDataGrid({ cardTitle, initialData, columns }) {
  const [data, setData] = useState([...initialData]);
  const [search, setSearch] = useState("");
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });

  const containerRef = useRef(null);

  // Objeto de formatações personalizadas para os dados das células
  const customFormatters = {
    id: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Cliente: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-start w-full">{String(value)}</div>;
    },
    NAM: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    MANAGER: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Part_Number: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    MKT_Name: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Runrate_NPI: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Product_Group: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    CHAVE: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-start w-full">{String(value)}</div>;
    },
    Q1_NAM_Total_estoque_cliente_PÇS_: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Q1_NAM_Estoque_Projetado: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Q1_NAM_Estoque_Ajustado: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Q1_NAM_WOH: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Q1_Abril: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Q1_Maio: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Q1_Junho: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Q1_Forecast_Q1: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Q1_Total_Q1_ano_anterior: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Q1_Forecast_Q1_Evento_Q1: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    Q1_Variação_YoY: ({ row, column }) => {
      const value = row.getValue(column.id);
      return <div className="text-center w-full">{String(value)}</div>;
    },
    // Você pode adicionar formatações personalizadas para as demais colunas, se necessário.
  };

  // Objeto para definir classes de background dos cabeçalhos (headers) para cada coluna
  const customHeaderColors = {
    // id: "bg-red-500",
    // Cliente: "bg-green-500",
    // NAM: "bg-blue-500",
    // MANAGER: "bg-purple-500",
    // Part_Number: "bg-yellow-500",
    // MKT_Name: "bg-indigo-500",
    // Runrate_NPI: "bg-pink-500",
    // Product_Group: "bg-gray-500",
    // CHAVE: "bg-orange-500",
    Q1_NAM_Total_estoque_cliente_PÇS_:
      "bg-yellow-200  p-2 px-4 rounded-sm text-blue-900",
    Q1_NAM_Estoque_Projetado:
      "bg-yellow-200  p-2 px-4 rounded-sm text-blue-900",
    Q1_NAM_Estoque_Ajustado: "bg-yellow-200  p-2 px-4 rounded-sm text-blue-900",
    Q1_NAM_WOH: "bg-yellow-200  p-2 px-4 rounded-sm text-blue-900",
    Q1_Abril: "bg-yellow-200  p-2 px-4 rounded-sm text-blue-900",
    Q1_Maio: "bg-yellow-200  p-2 px-4 rounded-sm text-blue-900",
    Q1_Junho: "bg-yellow-200  p-2 px-4 rounded-sm text-blue-900",
    Q1_Forecast_Q1: "bg-yellow-200  p-2 px-4 rounded-sm text-blue-900",
    Q1_Total_Q1_ano_anterior:
      "bg-yellow-200  p-2 px-4 rounded-sm text-blue-900",
    Q1_Forecast_Q1_Evento_Q1:
      "bg-yellow-200  p-2 px-4 rounded-sm text-blue-900",
    Q1_Variação_YoY: "bg-yellow-200  p-2 px-4 rounded-sm text-blue-900",
    // Adicione cores para outras colunas se necessário.
  };

  // Atualiza os dados quando o initialData muda
  useEffect(() => {
    setData([...initialData]);
  }, [initialData]);

  useEffect(() => {
    // console.log("Célula ativa atualizada:", activeCell);
  }, [activeCell]);

  // Foca o container ao montar para capturar os eventos de teclado
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

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

  // Função para lidar com eventos de teclado no container
  const handleKeyDown = (event) => {
    // Se o foco estiver em um input, não interfere para não atrapalhar a busca
    if (event.target.tagName.toLowerCase() === "input") return;

    // console.log("Tecla pressionada:", event.key);
    event.preventDefault();

    setActiveCell((prev) => {
      let { row, col } = prev;
      const totalRows = data.length;
      const totalCols = columns.length;

      // console.log("Antes:", { row, col });
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
      // console.log("Depois:", { row, col });
      return { row, col };
    });
  };

  // Função para atualizar a célula clicada
  const handleCellClick = (rowIndex, colIndex) => {
    console.log("Célula clicada:", { rowIndex, colIndex });
    setActiveCell({ row: rowIndex, col: colIndex });
  };

  // Atualiza as colunas para incluir header customizado e o cell com formatação
  const updatedColumns = columns.map((col, colIndex) => {
    let headerText = col.header || col.accessorKey;

    // Atualiza os headers conforme o padrão desejado
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
      // Header customizado com background individual usando as classes definidas em customHeaderColors
      header: () => (
        <div
          className={` text-center  text-white ${
            customHeaderColors[col.accessorKey] || "bg-transparent rounded-md "
          }`}
        >
          {headerText}
        </div>
      ),
      cell: ({ row, column }) => {
        const isActive =
          row.index === activeCell.row && colIndex === activeCell.col;
        const formatter = customFormatters[col.accessorKey];
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
            style={{ boxSizing: "border-box" }}
          >
            {formatter ? formatter({ row, column }) : row.getValue(column.id)}
          </div>
        );
      },
    };
  });

  const normalize = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD") // separa caracteres base e acentos
      .replace(/[\u0300-\u036f]/g, ""); // remove acentos
  };

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
      tabIndex={0} // Torna o container focável
      onKeyDown={handleKeyDown} // Captura os eventos de teclado
      style={{ outline: "none" }} // Remove o outline padrão
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
            {cardTitle}
          </h1>
        </div>
        <input
          type="text"
          placeholder="Buscar na tabela..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm border p-2 rounded-md"
        />
      </div>
      <DataTable
        columns={updatedColumns}
        data={filteredData}
        meta={{ updateData: () => {} }}
      />
    </div>
  );
}
