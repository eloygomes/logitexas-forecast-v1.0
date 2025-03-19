// import React, { useEffect, useRef, useState } from "react";
// import { DataTable } from "@/components/ui/data-table";

// export default function ForecastDataGrid({ cardTitle, initialData, columns }) {
//   const [data, setData] = useState([...initialData]);
//   const [search, setSearch] = useState("");
//   const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });

//   const containerRef = useRef(null);

//   // Atualiza os dados quando o initialData muda
//   useEffect(() => {
//     setData([...initialData]);
//   }, [initialData]);

//   useEffect(() => {
//     console.log("Célula ativa atualizada:", activeCell);
//   }, [activeCell]);

//   // Foca o container ao montar para capturar os eventos de teclado
//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.focus();
//     }
//   }, []);

//   // Função para lidar com o evento de teclado no container
//   const handleKeyDown = (event) => {
//     // Se o foco estiver em um input, não interferir (para permitir a digitação)
//     if (event.target.tagName.toLowerCase() === "input") return;

//     console.log("Tecla pressionada:", event.key);
//     event.preventDefault();

//     setActiveCell((prev) => {
//       let { row, col } = prev;
//       const totalRows = data.length;
//       const totalCols = columns.length;

//       console.log("Antes:", { row, col });

//       switch (event.key) {
//         case "ArrowRight":
//           col = col < totalCols - 1 ? col + 1 : col;
//           break;
//         case "ArrowLeft":
//           col = col > 0 ? col - 1 : col;
//           break;
//         case "ArrowDown":
//           row = row < totalRows - 1 ? row + 1 : row;
//           break;
//         case "ArrowUp":
//           row = row > 0 ? row - 1 : row;
//           break;
//         case "Tab":
//           // Se Tab for pressionado, avança na coluna e, se necessário, na linha
//           col = col < totalCols - 1 ? col + 1 : 0;
//           if (col === 0 && row < totalRows - 1) row++;
//           break;
//         default:
//           return prev;
//       }

//       console.log("Depois:", { row, col });
//       return { row, col };
//     });
//   };

//   // Mover a função handleCellClick para dentro do componente
//   const handleCellClick = (rowIndex, colIndex) => {
//     console.log("Célula clicada:", { rowIndex, colIndex });
//     setActiveCell({ row: rowIndex, col: colIndex });
//   };

//   // Atualiza as colunas para incluir um handler de clique
//   const updatedColumns = columns.map((col, colIndex) => ({
//     ...col,
//     cell: ({ row, column }) => {
//       const isActive =
//         row.index === activeCell.row && colIndex === activeCell.col;
//       return (
//         <div
//           className={`p-2.5 ${isActive ? "bg-yellow-300 border-2 rounded border-red-500" : ""}`}
//           onClick={() => handleCellClick(row.index, colIndex)}
//         >
//           {row.getValue(column.id)}
//         </div>
//       );
//     },
//   }));

//   // Filtra os dados com base no input de busca
//   const normalize = (str) => {
//     return str
//       .toLowerCase()
//       .normalize("NFD") // separa caracteres base e acentos
//       .replace(/[\u0300-\u036f]/g, ""); // remove acentos
//   };

//   const filteredData = data.filter((row) => {
//     if (!search.trim()) return true;
//     const tokens = normalize(search).split(/\s+/);
//     return tokens.every((token) =>
//       Object.values(row).some((val) => normalize(String(val)).includes(token))
//     );
//   });

//   return (
//     <div
//       className="p-4 space-y-4"
//       ref={containerRef}
//       tabIndex={0} // Torna o container focável
//       onKeyDown={handleKeyDown} // Captura os eventos de teclado aqui
//       style={{ outline: "none" }} // Remove o outline padrão quando o container é focado
//     >
//       <div className="flex flex-row items-center justify-between">
//         <div className="flex flex-col">
//           <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
//             {cardTitle}
//           </h1>
//         </div>
//         <input
//           type="text"
//           placeholder="Buscar na tabela..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="max-w-sm border p-2 rounded-md"
//         />
//       </div>
//       <DataTable
//         columns={updatedColumns}
//         data={filteredData}
//         meta={{ updateData: () => {} }}
//       />
//     </div>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/ui/data-table";

export default function ForecastDataGrid({ cardTitle, initialData, columns }) {
  const [data, setData] = useState([...initialData]);
  const [search, setSearch] = useState("");
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });

  const containerRef = useRef(null);

  // Atualiza os dados quando o initialData muda
  useEffect(() => {
    setData([...initialData]);
  }, [initialData]);

  useEffect(() => {
    console.log("Célula ativa atualizada:", activeCell);
  }, [activeCell]);

  // Foca o container ao montar para capturar os eventos de teclado
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Efeito para scroll automático na célula ativa
  useEffect(() => {
    // Tenta localizar a célula ativa pelo data attribute
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

  // Função para lidar com o evento de teclado no container
  const handleKeyDown = (event) => {
    // Se o foco estiver em um input, não interfere (para que a busca funcione)
    if (event.target.tagName.toLowerCase() === "input") return;

    console.log("Tecla pressionada:", event.key);
    event.preventDefault();

    setActiveCell((prev) => {
      let { row, col } = prev;
      const totalRows = data.length;
      const totalCols = columns.length;

      console.log("Antes:", { row, col });

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

      console.log("Depois:", { row, col });
      return { row, col };
    });
  };

  // Função para atualizar a célula clicada
  const handleCellClick = (rowIndex, colIndex) => {
    console.log("Célula clicada:", { rowIndex, colIndex });
    setActiveCell({ row: rowIndex, col: colIndex });
  };

  // Atualiza as colunas para incluir o handler de clique e data attributes
  const updatedColumns = columns.map((col, colIndex) => ({
    ...col,
    cell: ({ row, column }) => {
      const isActive =
        row.index === activeCell.row && colIndex === activeCell.col;
      return (
        <div
          data-row-index={row.index}
          data-col-index={colIndex}
          className={`p-2.5 
            border-2 rounded 
            ${isActive ? "bg-yellow-300 border-red-500" : "border-transparent"}`}
          onClick={() => handleCellClick(row.index, colIndex)}
          style={{ boxSizing: "border-box" }}
        >
          {row.getValue(column.id)}
        </div>
      );
    },
  }));

  // Função para normalizar strings (para busca)
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
      className="p-4 space-y-4"
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
