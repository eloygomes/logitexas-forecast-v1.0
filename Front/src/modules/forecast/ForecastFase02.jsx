import React, { useRef, useState, useEffect } from "react";
import ForecastDataGrid from "./ForecastDataGrid";
import ForecastHeader from "./ForecastHeader";

// Imports de dados e colunas
import { columns_tab4_faseB } from "./columns_tab4_faseB";

import {
  showSuccess,
  showError,
} from "../../components/sooner/SonnerToastProvider";
import { SkeletonDataGrid } from "@/components/skeleton/SkeletonDataGrid";

export default function ForecastFase02() {
  const horizontalScrollRef = useRef(null);
  const firstCardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [loading, setLoading] = useState(true);

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

        // console.log("Dados brutos recebidos da API:", resp);

        // Processar colunas e dados
        const mergedCols = mergeServerColsWithEditStructure(resp.columns);
        // console.log("mergedCols", mergedCols);
        const transformedData = transformDataToExpectedFormat(
          resp.rows,
          mergedCols
        );

        // console.log("Colunas mescladas:", mergedCols);
        // console.log("Linhas", resp.rows);
        // console.log("Dados transformados para a tabela:", transformedData);

        setColumnsState(mergedCols);
        setDataState(transformedData);
        setLoading(false);
      })
      .catch((error) =>
        console.error("Erro ao carregar dados do servidor:", error)
      );
  }, []);

  // Dentro de ForecastFase02.jsx:
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://api.logihub.space/api/forecast-data",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
      const resp = await response.json();
      // Processar os dados conforme necessário:
      const mergedCols = mergeServerColsWithEditStructure(resp.columns);
      const transformedData = transformDataToExpectedFormat(
        resp.rows,
        mergedCols
      );
      setColumnsState(mergedCols);
      setDataState(transformedData);
    } catch (error) {
      console.error("Erro ao carregar dados do servidor:", error);
      setColumnsState([]);
      setDataState([]);
    }
  };

  // Use fetchData dentro do useEffect para o carregamento inicial:
  useEffect(() => {
    fetchData();
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
    // Adicione este log para visualizar as colunas recebidas do servidor
    // console.log("Colunas recebidas do servidor:", serverCols);

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

    // console.log("Colunas mescladas (verifique os nomes):", mergedColumns);
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

  // console.log("dataState", dataState);
  // console.log("Colunas geradas para a tabela:", columnsState);

  return (
    <>
      <div className="p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <ForecastHeader dataState={dataState} setDataState={setDataState} />
      </div>

      <div className="p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => showSuccess("Operação realizada com sucesso!")}
        >
          teste
        </button>
        {loading ? (
          <SkeletonDataGrid
            rows={5}
            columns={dataState[0] ? Object.keys(dataState[0]).length : 5}
          />
        ) : (
          <ForecastDataGrid
            ref={firstCardRef}
            cardTitle={"Snapshot "}
            initialData={dataState}
            columns={columnsState}
            refetchData={fetchData}
          />
        )}
      </div>
    </>
  );
}
