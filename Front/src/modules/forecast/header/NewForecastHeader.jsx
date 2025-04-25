import React, { useEffect, useState } from "react";
import Select from "react-select";
import { showInfo } from "@/components/sooner/SonnerToastProvider";
import ForecastIcons from "./ForecastIcons";
import Drawer from "@/components/drawer/Drawer";

import { GoFileSymlinkFile } from "react-icons/go";
import { FaFilter } from "react-icons/fa";
import { BsFiletypeCsv } from "react-icons/bs";
import { BsFiletypeXls } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { TbFreezeColumn } from "react-icons/tb";
import { BiRefresh } from "react-icons/bi";
import { FaTimeline } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";

export default function NewForecastHeader({
  dataState,
  setDataState,
  tableData,
  setTableData,
  pinFocusedColumn,
  onPinRow,
  onClearColumns,
  onClearRows,
}) {
  const [clients, setClients] = useState([]);
  const [partNumbers, setPartNumbers] = useState([]);
  const [namOptions, setNamOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [mktNameOptions, setMktNameOptions] = useState([]);
  const [runrateNPIOptions, setRunrateNPIOptions] = useState([]);
  const [productGroupOptions, setProductGroupOptions] = useState([]);
  const [chaveOptions, setChaveOptions] = useState([]);

  const [selectedFilters, setSelectedFilters] = useState({
    client: "",
    partNumber: "",
    nam: "",
    manager: "",
    mktName: "",
    runrate_npi: "",
    product_group: "",
    chave: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const customSelectStyles = {
    container: (provided) => ({ ...provided, width: "250px", height: "40px" }),
    control: (provided) => ({ ...provided, width: "250px", height: "40px" }),
  };

  useEffect(() => {
    getClients().then((resp) => setClients(resp.rows));
    getPartNumbers().then((resp) => setPartNumbers(resp.part_numbers_list));
    getNAM().then((resp) => setNamOptions(resp.rows));
    getManager().then((resp) => setManagerOptions(resp.rows));
    getMktName().then((resp) => setMktNameOptions(resp.rows));
    getRunrateNPI().then((resp) => setRunrateNPIOptions(resp.rows));
    getProductGroup().then((resp) => setProductGroupOptions(resp.rows));
    getChave().then((resp) => setChaveOptions(resp.rows));
  }, []);

  useEffect(() => {
    updateData();
  }, [selectedFilters]);

  const updateData = async () => {
    showInfo("Carregando dados...");
    const filters = selectedFilters;
    const nonEmpty = Object.entries(filters).filter(
      ([, val]) => val && val.trim() !== ""
    );

    let resp;
    try {
      if (nonEmpty.length === 0) return;
      if (nonEmpty.length === 1) {
        const [key, value] = nonEmpty[0];
        resp = await getSingleFilterData(key, value);
      } else {
        resp = await getFilteredData(filters);
      }
      // if (resp) setDataState(resp.rows);
      if (resp) {
        setDataState(resp.rows);
        setTableData(resp.rows);
      }
    } catch (err) {
      console.error("Erro ao atualizar dados:", err);
    }
  };

  const getSingleFilterData = async (key, value) => {
    const token = localStorage.getItem("token");

    // Mapear nomes usados no filtro para os nomes esperados pela API
    const keyMap = {
      client: "clients",
      partNumber: "partnumbers",
      nam: "nam",
      manager: "manager",
      mktName: "mktname",
      runrate_npi: "runrate_npi",
      product_group: "product_group",
      chave: "chave",
    };

    const apiKey = keyMap[key];

    if (!apiKey) {
      throw new Error(`Chave de filtro inválida: ${key}`);
    }

    const url = `https://api.logihub.space/api/forecast-data/${apiKey}/${encodeURIComponent(value)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);
    return await res.json();
  };

  const getFilteredData = async (filters) => {
    const token = localStorage.getItem("token");
    const params = Object.entries(filters)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    const url = `https://api.logihub.space/api/forecast-data/filter?${params}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);
    return await res.json();
  };

  const fetchOptions = async (path) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://api.logihub.space/api/forecast-data/${path}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);
    return await res.json();
  };

  const getClients = () => fetchOptions("clients");
  const getPartNumbers = () => fetchOptions("partnumbers");
  const getNAM = () => fetchOptions("nam");
  const getManager = () => fetchOptions("manager");
  const getMktName = () => fetchOptions("mktname");
  const getRunrateNPI = () => fetchOptions("runrate_npi");
  const getProductGroup = () => fetchOptions("product_group");
  const getChave = () => fetchOptions("chave");

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
        setTableData(result.rows);
      }
    } catch (error) {
      console.error("Erro ao buscar dados iniciais:", error);
    }
  };

  const filterGroups = [
    {
      label: "Client",
      options: clients.map((o) => ({ value: o.Cliente, label: o.Cliente })),
      key: "client",
    },
    {
      label: "PN",
      options: partNumbers.map((o) => ({
        value: o.Part_Number,
        label: o.Part_Number,
      })),
      key: "partNumber",
    },
    {
      label: "NAM",
      options: namOptions.map((o) => ({ value: o.NAM, label: o.NAM })),
      key: "nam",
    },
    {
      label: "MANAGER",
      options: managerOptions.map((o) => ({
        value: o.MANAGER,
        label: o.MANAGER,
      })),
      key: "manager",
    },
    {
      label: "MKT_Name",
      options: mktNameOptions.map((o) => ({
        value: o.MKT_Name,
        label: o.MKT_Name,
      })),
      key: "mktName",
    },
    {
      label: "Runrate_NPI",
      options: runrateNPIOptions.map((o) => ({
        value: o.Runrate_NPI,
        label: o.Runrate_NPI,
      })),
      key: "runrate_npi",
    },
    {
      label: "Product_Group",
      options: productGroupOptions.map((o) => ({
        value: o.Product_Group,
        label: o.Product_Group,
      })),
      key: "product_group",
    },
    {
      label: "CHAVE",
      options: chaveOptions.map((o) => ({ value: o.CHAVE, label: o.CHAVE })),
      key: "chave",
    },
  ];

  const FilterGroup = () => {
    const handleClearFilters = () => {
      setSelectedFilters({
        client: "",
        partNumber: "",
        nam: "",
        manager: "",
        mktName: "",
        runrate_npi: "",
        product_group: "",
        chave: "",
      });
      if (typeof fetchInitialData === "function") {
        fetchInitialData();
      }
    };

    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-screen-xl">
          {filterGroups.map(({ label, options, key }) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </label>
              <Select
                styles={{
                  ...customSelectStyles,
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                options={options}
                value={
                  selectedFilters[key]
                    ? {
                        value: selectedFilters[key],
                        label: selectedFilters[key],
                      }
                    : null
                }
                onChange={(opt) =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    [key]: opt?.value || "",
                  }))
                }
                isSearchable
                placeholder="Selecione ou digite..."
                menuPlacement="top"
              />
            </div>
          ))}
        </div>

        <button
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
          onClick={handleClearFilters}
        >
          Limpar Filtros
        </button>
      </div>
    );
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        Content={<FilterGroup fetchInitialData={fetchInitialData} />}
      />
      <div className="flex flex-col h-full  ">
        <div className="flex flex-row text-white mb-5">
          <div className="w-1/2">
            <h1 className="text-xl font-bold">NAM SCREEN</h1>
          </div>
          <div className="w-1/2 text-right">
            <h1 className="text-xl font-bold">NOME DO ARQUIVO.CSV</h1>
          </div>
        </div>
        <div className="flex flex-row text-white mb-5">
          <div className="w-1/2 flex flex-col  mr-10">
            <div className="w-full flex flex-row mb-10">
              <div className="w-3/12 flex flex-col ">
                <h1 className="text-sm mt-3">&nbsp;</h1>
                <div className="flex flex-row ">
                  <div className="flex flex-row ">
                    <ForecastIcons
                      icon_description="icon_description"
                      text={"Files"}
                      icon={<GoFileSymlinkFile />}
                      openMenuStatus={false}
                      // fn={pinFocusedColumn}
                    />
                  </div>
                  <div className="flex flex-row ml-5">
                    <ForecastIcons
                      icon_description="icon_description"
                      text={"Refresh"}
                      icon={<BiRefresh />}
                      openMenuStatus={false}
                      // fn={pinFocusedColumn}
                    />
                  </div>
                </div>
              </div>

              <div className="w-3/12 flex flex-col pl-3 ">
                <h1 className="text-sm mt-3">&nbsp;</h1>
                <div className="flex flex-row ">
                  <ForecastIcons
                    icon_description="icon_description"
                    text={"Filter"}
                    icon={<FaFilter />}
                    openMenuStatus={true}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                  />
                </div>
              </div>
              <div className="w-3/12 flex flex-col ">
                <h1 className="text-[13px] mt-3">Export</h1>
                <div className="flex flex-row ">
                  <ForecastIcons
                    icon_description="icon_description"
                    text={"Xls"}
                    icon={<BsFiletypeCsv />}
                    openMenuStatus={false}
                    // fn={pinFocusedColumn}
                  />
                  <ForecastIcons
                    icon_description="icon_description"
                    text={"Csv"}
                    icon={<BsFiletypeXls />}
                    openMenuStatus={false}
                    // fn={onPinRow}
                  />
                </div>
              </div>
              <div className="w-3/12 flex flex-col ">
                <h1 className="text-sm mt-3">&nbsp;</h1>
                <div className="flex flex-row ">
                  <ForecastIcons
                    icon_description="icon_description"
                    text={"Timeline"}
                    icon={<FaTimeline />}
                    openMenuStatus={false}
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row ">
              <div className="w-3/12 flex flex-col ">
                <h1 className="text-md ">Freeze</h1>
                <div className="flex flex-row ">
                  <div className="flex flex-row">
                    <ForecastIcons
                      icon_description="icon_description"
                      text={"Column"}
                      icon={<TbFreezeColumn />}
                      openMenuStatus={false}
                      fn={pinFocusedColumn}
                    />
                    <ForecastIcons
                      icon_description="icon_description"
                      text={"Clear"}
                      icon={<TbFreezeColumn />}
                      openMenuStatus={false}
                      fn={onClearColumns}
                    />
                  </div>
                  <div className="flex flex-row ml-3">
                    <ForecastIcons
                      icon_description="icon_description"
                      text={"Rows"}
                      icon={<BiRefresh />}
                      openMenuStatus={false}
                      fn={onPinRow}
                    />
                    <ForecastIcons
                      icon_description="icon_description"
                      text={"Clear"}
                      icon={<TbFreezeColumn />}
                      openMenuStatus={false}
                      fn={onClearRows}
                    />
                  </div>
                </div>
              </div>

              <div className="w-3/12 flex flex-col ">
                <h1 className="text-sm ">&nbsp;</h1>
                <div className="flex flex-row ">
                  {/* <ForecastIcons
                    icon_description="icon_description"
                    text={"Rows"}
                    icon={<BiRefresh />}
                    openMenuStatus={false}
                    fn={onPinRow}
                  />
                  <ForecastIcons
                    icon_description="icon_description"
                    text={"Clear"}
                    icon={<TbFreezeColumn />}
                    openMenuStatus={false}
                    fn={onClearRows}
                  /> */}
                </div>
              </div>
              <div className="w-3/12 flex flex-col ">
                <h1 className="text-sm ">Approval</h1>
                <div className="flex flex-row ">
                  <ForecastIcons
                    icon_description="icon_description"
                    text={"Agree"}
                    icon={<FaCheckCircle />}
                    openMenuStatus={false}
                    // fn={pinFocusedColumn}
                  />
                  <ForecastIcons
                    icon_description="icon_description"
                    text={"Decline"}
                    icon={<MdDeleteOutline />}
                    openMenuStatus={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex flex-row justify-between pl-10 pt-3 ">
            <div className="flex flex-col ">
              <div className="flex flex-col text-start text-sm">
                <label className="w-15 font-bold">UPLOAD BY</label>
                <label className="w-15">Domingas</label>
              </div>
              <div className="flex flex-col text-start text-sm mt-5">
                <label className="w-15 font-bold">EDITED BY</label>
                <label className="w-15">Ana Julia</label>
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="flex flex-col text-start text-sm">
                <label className="w-15 font-bold">UPLOAD DATE</label>
                <label className="w-15">01/01/2023</label>
              </div>
              <div className="flex flex-col text-start text-sm mt-5">
                <label className="w-15 font-bold">EDITED DATE</label>
                <label className="w-15">02/01/2023</label>
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="flex flex-col text-start text-sm">
                <label className="w-15 font-bold">EXPORTED BY</label>
                <label className="w-15">Filópio</label>
              </div>
              <div className="flex flex-col text-start text-sm mt-5">
                <label className="w-15 font-bold">EXPORTED DATE</label>
                <label className="w-15">ausiudash</label>
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="flex flex-col text-start text-sm">
                <label className="w-15 font-bold">UPLOAD DATE</label>
                <label className="w-15">01/01/2023</label>
              </div>
              <div className="flex flex-col text-start text-sm mt-5">
                <label className="w-15 font-bold">EXPORTED DATE</label>
                <label className="w-15">01/01/2023</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
