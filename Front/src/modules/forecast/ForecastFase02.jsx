// import React, { useRef, useState, useEffect } from "react";
// import ForecastDataGrid from "./ForecastDataGrid";
// import ForecastHeader from "./ForecastHeader";

// // ▼ Imports originais mantidos (caso sejam usados em outros lugares)
// import { initialData } from "./data";
// import { data_tab2 } from "./data_tab2";
// import { data_tab3 } from "./data_tab3";
// import { columns } from "./columns";
// import { columns_tab2 } from "./columns_tab2";
// import { columns_tab3 } from "./columns_tab3";
// import { data_tab4_faseB } from "./data_tab4_faseB";
// // ▲-----------------------------------------------

// import { columns_tab4_faseB } from "./columns_tab4_faseB";

// export default function ForecastFase02() {
//   const horizontalScrollRef = useRef(null);
//   const firstCardRef = useRef(null); // Para medir o primeiro card
//   const [cardWidth, setCardWidth] = useState(0);

//   // Estados que controlarão de fato as colunas e as linhas (dados) vindos do servidor
//   const [columnsState, setColumnsState] = useState([]);
//   const [dataState, setDataState] = useState([]);

//   // Quando o componente monta, pega a largura do primeiro card
//   useEffect(() => {
//     if (firstCardRef.current) {
//       setCardWidth(firstCardRef.current.offsetWidth);
//     }
//   }, []);

//   // Ao montar o componente, carrega dados (colunas e linhas) do backend
//   useEffect(() => {
//     getData().then((resp) => {
//       // resp.columns -> colunas do servidor
//       // resp.rows -> linhas do servidor

//       // Mesclar colunas do servidor com a lógica de edição do columns_tab4_faseB
//       const mergedCols = mergeServerColsWithEditStructure(resp.columns);

//       // Salva no estado
//       setColumnsState(mergedCols);
//       setDataState(resp.rows);

//       console.log("Colunas do servidor mescladas:", mergedCols);
//       console.log("Linhas do servidor:", resp.rows);
//     });
//   }, []);

//   // Função para buscar as colunas e linhas do servidor
//   const getData = async () => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(
//       "https://api.logihub.space/api/forecast-data",
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     console.log("Response fetch:", response);

//     const { columns, rows } = await response.json();
//     return { columns, rows };
//   };

//   const mergeServerColsWithEditStructure = (serverCols) => {
//     if (!serverCols || !Array.isArray(serverCols)) return [];

//     return serverCols.map((srvCol) => {
//       const found = columns_tab4_faseB.find(
//         (colEdit) => colEdit.accessorKey === srvCol.key
//       );

//       if (found) {
//         return {
//           ...found,
//           header: srvCol.name || found.header, // se não vier um name do servidor, usa o header original
//         };
//       } else {
//         // Se não achou, cria uma simples (sem edição inline). Você pode personalizar se quiser:
//         return {
//           accessorKey: srvCol.key,
//           header: srvCol.name,
//           // se quiser permitir edição inline em colunas não mapeadas,
//           // poderia importar o EditableCell e usar algo parecido aqui.
//           // Exemplo:
//           // cell: ({ row, getValue, table }) => {
//           //   const initialValue = getValue();
//           //   const handleChange = (val) => {
//           //     table.options.meta?.updateData(row.index, srvCol.key, val);
//           //   };
//           //   return <EditableCell initialValue={initialValue} onChange={handleChange} />;
//           // }
//         };
//       }
//     });
//   };

//   // Rola para a esquerda uma "cardWidth"
//   function handleScrollLeft() {
//     if (horizontalScrollRef.current && cardWidth > 0) {
//       horizontalScrollRef.current.scrollBy({
//         left: -cardWidth,
//         behavior: "smooth",
//       });
//     }
//   }

//   // Rola para a direita uma "cardWidth"
//   function handleScrollRight() {
//     if (horizontalScrollRef.current && cardWidth > 0) {
//       horizontalScrollRef.current.scrollBy({
//         left: cardWidth,
//         behavior: "smooth",
//       });
//     }
//   }

//   return (
//     <>
//       {/* HEADER */}
//       <div className="p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
//         <ForecastHeader />
//       </div>

//       <div className="p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
//         <div className="flex flex-row">
//           <button
//             onClick={handleScrollLeft}
//             className="text-white py-2 px-5 border border-white rounded-md mr-5 my-5"
//           >
//             {"<<< "}
//           </button>
//           <button
//             onClick={handleScrollRight}
//             className="text-white py-2 px-5 border border-white rounded-md mr-5 my-5"
//           >
//             {">>> "}
//           </button>
//         </div>

//         {/* DataGrid que de fato usa as colunas e dados do servidor (ou mesclados) */}
//         <ForecastDataGrid
//           ref={firstCardRef} /* se quiser medir a largura do card */
//           cardTitle={"Snapshot do trimestre atual"}
//           // initialData={dataState} // Dados do servidor
//           initialData={data_tab4_faseB} // Dados do servidor
//           columns={columnsState} // Colunas mescladas (server + inline edit)
//         />
//       </div>
//     </>
//   );
// }

import React, { useRef, useState, useEffect } from "react";
import ForecastDataGrid from "./ForecastDataGrid";
import ForecastHeader from "./ForecastHeader";

// Imports de dados e colunas
import { columns_tab4_faseB } from "./columns_tab4_faseB";

export default function ForecastFase02() {
  const horizontalScrollRef = useRef(null);
  const firstCardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  // Estado para colunas e dados
  const [columnsState, setColumnsState] = useState([]);
  const [dataState, setDataState] = useState([]);

  // Quando o componente monta, pega a largura do primeiro card
  useEffect(() => {
    if (firstCardRef.current) {
      setCardWidth(firstCardRef.current.offsetWidth);
    }
  }, []);

  // Carregar dados do backend
  useEffect(() => {
    getData()
      .then((resp) => {
        if (!resp || !resp.columns || !resp.rows) {
          console.error(
            "Erro: resposta da API não tem colunas ou linhas",
            resp
          );
          return;
        }

        console.log("Dados brutos recebidos da API:", resp);

        // Processar colunas e dados
        const mergedCols = mergeServerColsWithEditStructure(resp.columns);
        const transformedData = transformDataToExpectedFormat(
          resp.rows,
          mergedCols
        );

        console.log("Colunas mescladas:", mergedCols);
        console.log("Linhas", resp.rows);
        console.log("Dados transformados para a tabela:", transformedData);

        setColumnsState(mergedCols);
        setDataState(transformedData);
      })
      .catch((error) =>
        console.error("Erro ao carregar dados do servidor:", error)
      );
  }, []);

  // Buscar colunas e linhas do servidor
  const getData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://api.logihub.space/api/forecast-data",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados do servidor:", error);
      return { columns: [], rows: [] }; // Retorna arrays vazios para evitar quebra
    }
  };

  // Mesclar colunas do servidor com estrutura que permite edição inline
  const mergeServerColsWithEditStructure = (serverCols) => {
    if (!serverCols || !Array.isArray(serverCols)) {
      console.error("Erro: serverCols inválido", serverCols);
      return [];
    }

    const mergedColumns = serverCols.map((srvCol) => {
      const normalizedKey = srvCol.key.trim().toLowerCase();

      const found = columns_tab4_faseB.find(
        (colEdit) => colEdit.accessorKey.trim().toLowerCase() === normalizedKey
      );

      if (found) {
        return { ...found, header: srvCol.name || found.header };
      } else {
        return {
          accessorKey: srvCol.key,
          header: srvCol.name || srvCol.key,
        };
      }
    });

    console.log("Colunas mescladas (verifique os nomes):", mergedColumns);
    return mergedColumns;
  };
  // Ajusta os dados recebidos para o formato esperado
  const transformDataToExpectedFormat = (serverData, columns) => {
    return serverData.map((row, index) => {
      let formattedRow = { id: row.id || index + 1 };

      columns.forEach(({ accessorKey }) => {
        const normalizedKey = accessorKey.trim().toLowerCase();

        const matchingKey = Object.keys(row).find(
          (key) => key.trim().toLowerCase() === normalizedKey
        );

        if (matchingKey) {
          let value = row[matchingKey];

          // Converte números que vêm como string para Number
          if (!isNaN(value) && value !== null && value !== "") {
            value = Number(value);
          }

          formattedRow[accessorKey] = value;
        } else {
          formattedRow[accessorKey] = null; // Se a chave não existir, atribui null
        }
      });

      return formattedRow;
    });
  };

  // Rola para a esquerda
  function handleScrollLeft() {
    if (horizontalScrollRef.current && cardWidth > 0) {
      horizontalScrollRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  }

  // Rola para a direita
  function handleScrollRight() {
    if (horizontalScrollRef.current && cardWidth > 0) {
      horizontalScrollRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }
  }

  console.log("dataState", dataState);
  // console.log("Colunas geradas para a tabela:", columnsState);

  return (
    <>
      <div className="p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <ForecastHeader />
      </div>

      <div className="p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="flex flex-row">
          <button
            onClick={handleScrollLeft}
            className="text-white py-2 px-5 border border-white rounded-md mr-5 my-5"
          >
            {"<<< "}
          </button>
          <button
            onClick={handleScrollRight}
            className="text-white py-2 px-5 border border-white rounded-md mr-5 my-5"
          >
            {">>> "}
          </button>
        </div>

        {/* DataGrid com os dados transformados */}
        <ForecastDataGrid
          ref={firstCardRef}
          cardTitle={"Snapshot do trimestre atual"}
          initialData={dataState}
          columns={columnsState}
        />
      </div>
    </>
  );
}
