import React, { useState, useEffect } from "react";
import Select from "react-select";
import { showInfo } from "@/components/sooner/SonnerToastProvider";
import {
  getClients,
  getPartNumbers,
  getNAM,
  getManager,
  getMktName,
  getRunrateNPI,
  getProductGroup,
  getChave,
  getFilteredData,
  getDataFromaClient,
  getDataFromPartNumber,
  getDataFromNAM,
  getDataFromManager,
  getDataFromMktName,
  getDataFromRunrateNPI,
  getDataFromProductGroup,
  getDataFromChave,
} from "@/services/forecastAPI";

export default function ForecastFilters({
  setDataState,
  selectedFilters,
  setSelectedFilters,
}) {
  const [filterOptions, setFilterOptions] = useState({
    clients: [],
    partNumbers: [],
    nam: [],
    manager: [],
    mktName: [],
    runrateNPI: [],
    productGroup: [],
    chave: [],
  });

  const customSelectStyles = {
    container: (provided) => ({ ...provided, width: "250px", height: "40px" }),
    control: (provided) => ({ ...provided, width: "250px", height: "40px" }),
  };

  useEffect(() => {
    Promise.all([
      getClients(),
      getPartNumbers(),
      getNAM(),
      getManager(),
      getMktName(),
      getRunrateNPI(),
      getProductGroup(),
      getChave(),
    ]).then(
      ([
        clients,
        partNumbers,
        nam,
        manager,
        mktName,
        runrateNPI,
        productGroup,
        chave,
      ]) => {
        setFilterOptions({
          clients: clients.rows,
          partNumbers: partNumbers.part_numbers_list,
          nam: nam.rows,
          manager: manager.rows,
          mktName: mktName.rows,
          runrateNPI: runrateNPI.rows,
          productGroup: productGroup.rows,
          chave: chave.rows,
        });
      }
    );
  }, []);

  useEffect(() => {
    updateData();
    // eslint-disable-next-line
  }, [selectedFilters]);

  const updateData = async () => {
    showInfo("Carregando dados...");
    const nonEmptyFilters = Object.entries(selectedFilters).filter(
      ([, val]) => val
    );

    try {
      let resp;
      if (nonEmptyFilters.length === 0) return;
      else if (nonEmptyFilters.length === 1) {
        const [key, value] = nonEmptyFilters[0];
        const fetchMap = {
          client: getDataFromaClient,
          partNumber: getDataFromPartNumber,
          nam: getDataFromNAM,
          manager: getDataFromManager,
          mktName: getDataFromMktName,
          runrate_npi: getDataFromRunrateNPI,
          product_group: getDataFromProductGroup,
          chave: getDataFromChave,
        };
        resp = await fetchMap[key](value);
      } else {
        const {
          client,
          partNumber,
          nam,
          manager,
          mktName,
          runrate_npi,
          product_group,
          chave,
        } = selectedFilters;
        resp = await getFilteredData(
          client,
          partNumber,
          nam,
          manager,
          mktName,
          runrate_npi,
          product_group,
          chave
        );
      }
      if (resp) setDataState(resp.rows);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    }
  };

  const filterConfig = [
    {
      label: "Client",
      key: "client",
      options: filterOptions.clients,
      valueKey: "Cliente",
    },
    {
      label: "PN",
      key: "partNumber",
      options: filterOptions.partNumbers,
      valueKey: "Part_Number",
    },
    { label: "NAM", key: "nam", options: filterOptions.nam, valueKey: "NAM" },
    {
      label: "MANAGER",
      key: "manager",
      options: filterOptions.manager,
      valueKey: "MANAGER",
    },
    {
      label: "MKT_Name",
      key: "mktName",
      options: filterOptions.mktName,
      valueKey: "MKT_Name",
    },
    {
      label: "Runrate_NPI",
      key: "runrate_npi",
      options: filterOptions.runrateNPI,
      valueKey: "Runrate_NPI",
    },
    {
      label: "Product_Group",
      key: "product_group",
      options: filterOptions.productGroup,
      valueKey: "Product_Group",
    },
    {
      label: "CHAVE",
      key: "chave",
      options: filterOptions.chave,
      valueKey: "CHAVE",
    },
  ];

  return (
    <div className="w-full h-32 flex flex-row justify-between mt-10 gap-4 pr-5">
      {filterConfig.map(({ label, key, options, valueKey }) => (
        <div className="flex flex-col mb-5" key={key}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <Select
            styles={customSelectStyles}
            options={(options || []).map((item) => ({
              value: item[valueKey],
              label: item[valueKey],
            }))}
            value={
              selectedFilters[key]
                ? { value: selectedFilters[key], label: selectedFilters[key] }
                : null
            }
            onChange={(option) => {
              const value = option ? option.value : "";
              setSelectedFilters((prev) => ({ ...prev, [key]: value }));
            }}
            isSearchable
            placeholder="Selecione ou digite..."
          />
        </div>
      ))}
    </div>
  );
}
