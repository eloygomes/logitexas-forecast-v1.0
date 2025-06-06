import React, { useRef, useState, useEffect, useCallback } from "react";
import ForecastDataGrid from "./ForecastDataGrid";
import ForecastHeader from "./ForecastHeader";

// Imports de dados e colunas
import { columns_tab4_faseB } from "./columns_tab4_faseB";

import {
  showSuccess,
  showError,
  showInfo,
} from "../../components/sooner/SonnerToastProvider";
import { SkeletonDataGrid } from "@/components/skeleton/SkeletonDataGrid";

import { MyDataTable } from "./MyDataTable.jsx";
import NewForecastHeader from "./header/NewForecastHeader.jsx";
import Accord from "@/components/accord/Accord.jsx";
import { AgGRIDDataTable } from "./AGGRID/AgGRIDDataTable.jsx";

export default function ForecastFase02() {
  const horizontalScrollRef = useRef(null);
  const firstCardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  // Estado para colunas e dados
  const [columnsState, setColumnsState] = useState([]);
  const [dataState, setDataState] = useState([]);
  const [pinnedTopRows, setPinnedTopRows] = useState([]);

  const [isFilterOn, setIsFilterOn] = useState(false);

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
        setTableData(transformedData);
        setLoading(false);
      })
      .catch((error) =>
        console.error("Erro ao carregar dados do servidor:", error)
      );
  }, []);

  const handleCellValueChanged = (params) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === params.data.id ? { ...params.data, isDirty: true } : row
      )
    );
  };

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
      setTableData(transformedData);
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

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://api.logihub.space/api/forecast-data",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();
      if (result && result.rows) {
        setDataState(result.rows);
      }
    } catch (error) {
      console.error("Erro ao buscar dados iniciais:", error);
    }
  };

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
      setDataState((prev) =>
        prev.map((record) => ({ ...record, isDirty: false }))
      );
      fetchData();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const gridRef = useRef(null); // componente
  const apiRef = useRef(null); // API do AG Grid

  const pinFocusedColumn = useCallback(() => {
    const focused = apiRef.current?.getFocusedCell();
    if (!focused) return;
    const { column } = focused;
    apiRef.current.applyColumnState({
      state: [
        {
          colId: column.getColId(),
          pinned: column.getPinned() ? null : "left",
        },
      ],
      defaultState: { pinned: null },
    });
  }, []);

  // limpa todas as colunas pin
  const clearPinnedColumns = useCallback(() => {
    apiRef.current?.applyColumnState({ defaultState: { pinned: null } });
  }, []);

  // “congela” a linha da célula focada
  const pinRowToFocused = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    const focused = api.getFocusedCell();
    if (!focused) return;
    const node = api.getDisplayedRowAtIndex(focused.rowIndex);
    if (!node) return;

    setPinnedTopRows((prev) => {
      const already = prev.some((r) => r.id === node.data.id);
      if (already) return prev;
      return [...prev, { ...node.data }];
    });
  }, []);

  // limpa todas as linhas pin
  const clearPinnedRows = useCallback(() => {
    setPinnedTopRows([]);
  }, []);

  // console.log("dataState", dataState);
  // console.log("Colunas geradas para a tabela:", columnsState);
  // console.log(tableData);

  return (
    <>
      <div className=" mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm dark:border-gray-700  dark:bg-gray-800">
        <Accord
          dataState={dataState}
          setDataState={setDataState}
          tableData={tableData}
          setTableData={setTableData}
          pinFocusedColumn={pinFocusedColumn}
          onPinRow={pinRowToFocused}
          onClearColumns={clearPinnedColumns}
          onClearRows={clearPinnedRows}
          isFilterOn={isFilterOn}
          setIsFilterOn={setIsFilterOn}
        />
        {/* <ForecastHeader dataState={dataState} /> */}
        <div className="w-full flex flex-row text-white bg-gray-600 rounded-b-lg px-5 py-1 ">
          <div className="w-1/2 flex flex-col">
            <h1>Save</h1>
            <h5 className="text-xs">
              Make changes and apply filters to the table, and only after making
              all the necessary changes, click “Save” to save all modifications.
              If you make changes and apply filters without saving, the changes
              will be lost.
            </h5>
          </div>
          <div className="w-1/2 flex flex-row">
            <div className="ml-auto ">
              <button className="rounded border-2 border-red-600 px-3 py-2 bg-red-600 mr-5 my-1">
                Descart
              </button>
              <button
                onClick={handleSave}
                className="rounded border-2 border-green-600 px-3 py-2 bg-green-600 mr-5"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-0 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        {loading ? (
          <SkeletonDataGrid
            rows={5}
            columns={dataState[0] ? Object.keys(dataState[0]).length : 5}
          />
        ) : (
          // <MyDataTable
          //   columns={columnsState}
          //   data={tableData}
          //   setTableData={setTableData}
          // />

          <AgGRIDDataTable
            style={{ height: 500 }}
            columns={columnsState}
            data={tableData}
            cardTitle="User Data"
            pinFocusedColumn={pinFocusedColumn}
            apiReff={apiRef}
            pinnedTopRows={pinnedTopRows}
            onClearColumns={clearPinnedColumns}
            onPinRow={pinRowToFocused}
            onClearRows={clearPinnedRows}
            onCellValueChanged={handleCellValueChanged}
            isFilterOn={isFilterOn}
            headerNames={{
              Part_Number: "Part Number",
              MKT_Name: "MKT Name",
              Runrate_NPI: "Runrate NPI",
              Product_Group: "Product Group",
              Q1_NAM_Total_estoque_cliente_PÇS_:
                "NAM Total estoque cliente PÇS ",
              Q1_NAM_Estoque_Projetado: "NAM Estoque Projetado",
              Q1_NAM_Estoque_Ajustado: "NAM Estoque Ajustado",
              Q1_NAM_WOH: "NAM WOH",
              Q1_Abril: "Abril",
              Q1_Maio: "Maio",
              Q1_Junho: "Junho",
              Q1_Forecast_Q1: "Forecast Q1",
              Q1_Total_Q1_ano_anterior: "Total Q1 ano anterior",
              Q1_Forecast_Q1_Evento_Q1: "Forecast Q1 Evento Q1",
              Q1_Variação_YoY: "Variação YoY",
              Q2_Estoque_Projetado: "Estoque Projetado",
              Q2_WOH: "WOH",
              Q2_Julho: "Julho",
              Q2_Agosto: "Agosto",
              Q2_Setembro: "Setembro",
              Q2_Forecast_Q2: "Forecast Q2",
              Q2_Total_Q2_ano_anterior: "Total Q2 ano anterior",
              Q2_Forecast_Q2_Evento_Q2: "Forecast Q2 Evento Q2",
              Q2_Variação_YoY: "Variação YoY",
              Q3_Estoque_Projetado: "Estoque Projetado",
              Q3_WOH: "WOH",
              Q3_Outubro: "Outubro",
              Q3_Novembro: "Novembro",
              Q3_Dezembro: "Dezembro",
              Q3_Forecast_Q3: "Forecast Q3",
              Q3_Total_Q3_ano_anterior: "Total Q3 ano anterior",
              Q3_Forecast_Q3_Evento_Q3: "Forecast Q3 Evento Q3",
              Q3_Variação_YoY: "Variação YoY",
              Q4_Estoque_Projetado: "Estoque Projetado",
              Q4_WOH: "WOH",
              Q4_Janeiro: "Janeiro",
              Q4_Fevereiro: "Fevereiro",
              Q4_Março: "Março",
              Q4_Forecast_Q4: "Forecast Q4",
              Q4_Total_Q4_ano_anterior: "Total Q4 ano anterior",
              Q4_Forecast_Q4_Evento_Q4: "Forecast Q4 Evento Q4",
              Q4_Variação_YoY: "Variação YoY",
            }}
            headerStyles={{
              // Part_Number: { backgroundColor: "#ffd700", color: "#000" },
              Q1_NAM_Total_estoque_cliente_PÇS_: {
                backgroundColor: "#ffd700",
                color: "#000",
              },
              Q1_NAM_Estoque_Projetado: {
                backgroundColor: "#ffd700",
                color: "#000",
              },
              Q1_NAM_Estoque_Ajustado: {
                backgroundColor: "#ffd700",
                color: "#000",
              },
              Q1_NAM_WOH: { backgroundColor: "#ffd700", color: "#000" },
              Q1_Abril: { backgroundColor: "#ffd700", color: "#000" },
              Q1_Maio: { backgroundColor: "#ffd700", color: "#000" },
              Q1_Junho: { backgroundColor: "#ffd700", color: "#000" },
              Q1_Forecast_Q1: { backgroundColor: "#ffd700", color: "#000" },
              Q1_Total_Q1_ano_anterior: {
                backgroundColor: "#ffd700",
                color: "#000",
              },
              Q1_Forecast_Q1_Evento_Q1: {
                backgroundColor: "#ffd700",
                color: "#000",
              },
              Q1_Variação_YoY: { backgroundColor: "#ffd700", color: "#000" },
              Q2_Estoque_Projetado: {
                backgroundColor: "#40ff00",
                color: "#000",
              },
              Q2_WOH: { backgroundColor: "#40ff00", color: "#000" },
              Q2_Julho: { backgroundColor: "#40ff00", color: "#000" },
              Q2_Agosto: { backgroundColor: "#40ff00", color: "#000" },
              Q2_Setembro: { backgroundColor: "#40ff00", color: "#000" },
              Q2_Forecast_Q2: { backgroundColor: "#40ff00", color: "#000" },
              Q2_Total_Q2_ano_anterior: {
                backgroundColor: "#40ff00",
                color: "#000",
              },
              Q2_Forecast_Q2_Evento_Q2: {
                backgroundColor: "#40ff00",
                color: "#000",
              },
              Q2_Variação_YoY: { backgroundColor: "#40ff00", color: "#000" },
              Q3_Estoque_Projetado: {
                backgroundColor: "#00c8ff",
                color: "#000",
              },
              Q3_WOH: { backgroundColor: "#00c8ff", color: "#000" },
              Q3_Outubro: { backgroundColor: "#00c8ff", color: "#000" },
              Q3_Novembro: { backgroundColor: "#00c8ff", color: "#000" },
              Q3_Dezembro: { backgroundColor: "#00c8ff", color: "#000" },
              Q3_Forecast_Q3: { backgroundColor: "#00c8ff", color: "#000" },
              Q3_Total_Q3_ano_anterior: {
                backgroundColor: "#00c8ff",
                color: "#000",
              },
              Q3_Forecast_Q3_Evento_Q3: {
                backgroundColor: "#00c8ff",
                color: "#000",
              },
              Q3_Variação_YoY: { backgroundColor: "#00c8ff", color: "#000" },
              Q4_Estoque_Projetado: {
                backgroundColor: "#ff9100",
                color: "#000",
              },
              Q4_WOH: { backgroundColor: "#ff9100", color: "#000" },
              Q4_Janeiro: { backgroundColor: "#ff9100", color: "#000" },
              Q4_Fevereiro: { backgroundColor: "#ff9100", color: "#000" },
              Q4_Março: { backgroundColor: "#ff9100", color: "#000" },
              Q4_Forecast_Q4: { backgroundColor: "#ff9100", color: "#000" },
              Q4_Total_Q4_ano_anterior: {
                backgroundColor: "#ff9100",
                color: "#000",
              },
              Q4_Forecast_Q4_Evento_Q4: {
                backgroundColor: "#ff9100",
                color: "#000",
              },
              Q4_Variação_YoY: { backgroundColor: "#ff9100", color: "#000" },
            }}
          />
        )}
      </div>
    </>
  );
}
