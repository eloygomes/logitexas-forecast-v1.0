import Drawer from "@/components/drawer/Drawer";
import { showInfo } from "@/components/sooner/SonnerToastProvider";
import React, { useEffect, useState } from "react";
import Select from "react-select";

export default function ForecastHeader({ dataState, setDataState }) {
  // Options for each filter
  const [clients, setClients] = useState([]);
  const [partNumbers, setPartNumbers] = useState([]);
  const [namOptions, setNamOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [mktNameOptions, setMktNameOptions] = useState([]);
  const [runrateNPIOptions, setRunrateNPIOptions] = useState([]);
  const [productGroupOptions, setProductGroupOptions] = useState([]);
  const [chaveOptions, setChaveOptions] = useState([]);

  // Selected filters
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPartNumber, setSelectedPartNumber] = useState("");
  const [selectedNam, setSelectedNam] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedMktName, setSelectedMktName] = useState("");
  const [selectedRunrateNPI, setSelectedRunrateNPI] = useState("");
  const [selectedProductGroup, setSelectedProductGroup] = useState("");
  const [selectedChave, setSelectedChave] = useState("");

  // Drawer
  const [isOpen, setIsOpen] = useState(false);

  // Load options for each filter
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

  const customSelectStyles = {
    container: (provided) => ({
      ...provided,
      width: "250px",
      height: "40px", // fixed width for the container
    }),
    control: (provided) => ({
      ...provided,
      width: "250px",
      height: "40px", // fixed width for the control
    }),
  };

  // Decide which endpoint to call based on selected filters
  const updateData = async () => {
    showInfo("Carregando dados...");

    const filters = {
      client: selectedClient,
      partNumber: selectedPartNumber,
      nam: selectedNam,
      manager: selectedManager,
      mktName: selectedMktName,
      runrate_npi: selectedRunrateNPI,
      product_group: selectedProductGroup,
      chave: selectedChave,
    };

    const nonEmptyFilters = Object.entries(filters).filter(
      ([, value]) => value && value.trim() !== ""
    );

    let resp;
    try {
      if (nonEmptyFilters.length === 0) {
        // No filters => skip or call default endpoint
        return;
      } else if (nonEmptyFilters.length === 1) {
        const [key, value] = nonEmptyFilters[0];
        switch (key) {
          case "client":
            resp = await getDataFromaClient(value);
            break;
          case "partNumber":
            resp = await getDataFromPartNumber(value);
            break;
          case "nam":
            resp = await getDataFromNAM(value);
            break;
          case "manager":
            resp = await getDataFromManager(value);
            break;
          case "mktName":
            resp = await getDataFromMktName(value);
            break;
          case "runrate_npi":
            resp = await getDataFromRunrateNPI(value);
            break;
          case "product_group":
            resp = await getDataFromProductGroup(value);
            break;
          case "chave":
            resp = await getDataFromChave(value);
            break;
          default:
            break;
        }
      } else {
        // More than one filter => call combined endpoint
        resp = await getFilteredData(
          selectedClient,
          selectedPartNumber,
          selectedNam,
          selectedManager,
          selectedMktName,
          selectedRunrateNPI,
          selectedProductGroup,
          selectedChave
        );
      }
      if (resp) {
        setDataState(resp.rows);
        console.log("Dados filtrados:", resp.rows);
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    }
  };

  // Re-fetch data whenever a filter changes
  useEffect(() => {
    updateData();
    // eslint-disable-next-line
  }, [
    selectedClient,
    selectedPartNumber,
    selectedNam,
    selectedManager,
    selectedMktName,
    selectedRunrateNPI,
    selectedProductGroup,
    selectedChave,
  ]);

  // Build {value, label} for React-Select
  const clientOptions = (clients || []).map((item) => ({
    value: item.Cliente,
    label: item.Cliente,
  }));
  const partNumberOptions = (partNumbers || []).map((item) => ({
    value: item.Part_Number,
    label: item.Part_Number,
  }));
  const namSelectOptions = (namOptions || []).map((item) => ({
    value: item.NAM,
    label: item.NAM,
  }));
  const managerSelectOptions = (managerOptions || []).map((item) => ({
    value: item.MANAGER,
    label: item.MANAGER,
  }));
  const mktNameSelectOptions = (mktNameOptions || []).map((item) => ({
    value: item.MKT_Name,
    label: item.MKT_Name,
  }));
  const runrateNPISelectOptions = (runrateNPIOptions || []).map((item) => ({
    value: item.Runrate_NPI,
    label: item.Runrate_NPI,
  }));
  const productGroupSelectOptions = (productGroupOptions || []).map((item) => ({
    value: item.Product_Group,
    label: item.Product_Group,
  }));
  const chaveSelectOptions = (chaveOptions || []).map((item) => ({
    value: item.CHAVE,
    label: item.CHAVE,
  }));

  // React-Select fetch calls
  const handleClientChange = (option) => {
    const val = option ? option.value : "";
    setSelectedClient(val);
    console.log("Cliente selecionado:", val);
  };
  const handlePartNumberChange = (option) => {
    const val = option ? option.value : "";
    setSelectedPartNumber(val);
    console.log("Part Number selecionado:", val);
  };
  const handleNamChange = (option) => {
    const val = option ? option.value : "";
    setSelectedNam(val);
    console.log("NAM selecionado:", val);
  };
  const handleManagerChange = (option) => {
    const val = option ? option.value : "";
    setSelectedManager(val);
    console.log("MANAGER selecionado:", val);
  };
  const handleMktNameChange = (option) => {
    const val = option ? option.value : "";
    setSelectedMktName(val);
    console.log("MKT_Name selecionado:", val);
  };
  const handleRunrateNPIChange = (option) => {
    const val = option ? option.value : "";
    setSelectedRunrateNPI(val);
    console.log("Runrate_NPI selecionado:", val);
  };
  const handleProductGroupChange = (option) => {
    const val = option ? option.value : "";
    setSelectedProductGroup(val);
    console.log("Product_Group selecionado:", val);
  };
  const handleChaveChange = (option) => {
    const val = option ? option.value : "";
    setSelectedChave(val);
    console.log("CHAVE selecionado:", val);
  };

  // The same fetch logic
  async function getDataFromaClient(client) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/clients/${client}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getDataFromPartNumber(partNumber) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/partnumbers/${partNumber}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getDataFromNAM(nam) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/nam/${nam}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getDataFromManager(manager) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/manager/${manager}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getDataFromMktName(mktName) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/mktname/${mktName}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getDataFromRunrateNPI(runrate_npi) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/runrate_npi/${runrate_npi}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getDataFromProductGroup(product_group) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/product_group/${product_group}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getDataFromChave(chave) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/chave/${chave}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }

  // fetch to populate filter options
  async function getClients() {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/clients",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getPartNumbers() {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/partnumbers",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getNAM() {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/nam",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getManager() {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/manager",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getMktName() {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/mktname",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getRunrateNPI() {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/runrate_npi",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getProductGroup() {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/product_group",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }
  async function getChave() {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/chave",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }

  // Combined filter
  async function getFilteredData(
    client,
    partNumber,
    nam,
    manager,
    mktName,
    runrate_npi,
    product_group,
    chave
  ) {
    const token = localStorage.getItem("token");
    let url = "https://api.logihub.space/api/forecast-data/filter?";
    const params = [];
    if (client) params.push("client=" + encodeURIComponent(client));
    if (partNumber) params.push("partNumber=" + encodeURIComponent(partNumber));
    if (nam) params.push("nam=" + encodeURIComponent(nam));
    if (manager) params.push("manager=" + encodeURIComponent(manager));
    if (mktName) params.push("mktName=" + encodeURIComponent(mktName));
    if (runrate_npi)
      params.push("runrate_npi=" + encodeURIComponent(runrate_npi));
    if (product_group)
      params.push("product_group=" + encodeURIComponent(product_group));
    if (chave) params.push("chave=" + encodeURIComponent(chave));
    url += params.join("&");

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  }

  return (
    <div className="p-4 ">
      <div className="w-full flex flex-col ">
        <div className="flex flex-row items-center justify-between">
          <div className="w-8/12 flex flex-col">
            <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
              Forecast
            </h1>
            <h2 className="w-1/2 py-2 text-sm text-[#9ca3af]">
              Use a filter to start
            </h2>
            <div className="w-full h-32 flex flex-row justify-between mt-10 gap-4  pr-5">
              <div className="flex flex-col">
                {/* Filtro por Cliente */}
                <div className="flex flex-col mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Client
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={clientOptions}
                    value={
                      selectedClient
                        ? { value: selectedClient, label: selectedClient }
                        : null
                    }
                    onChange={(option) => {
                      const val = option ? option.value : "";
                      setSelectedClient(val);
                      console.log("Cliente selecionado:", val);
                    }}
                    isSearchable
                    placeholder="Selecione ou digite..."
                  />
                </div>

                {/* Filtro por Part Number */}
                <div className="flex flex-col mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    PN
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={partNumberOptions}
                    value={
                      selectedPartNumber
                        ? {
                            value: selectedPartNumber,
                            label: selectedPartNumber,
                          }
                        : null
                    }
                    onChange={(option) => {
                      const val = option ? option.value : "";
                      setSelectedPartNumber(val);
                      console.log("Part Number selecionado:", val);
                    }}
                    isSearchable
                    placeholder="Selecione ou digite..."
                  />
                </div>
              </div>
              <div className="flex flex-col">
                {/* Filtro por NAM */}
                <div className="flex flex-col mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    NAM
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={namSelectOptions}
                    value={
                      selectedNam
                        ? { value: selectedNam, label: selectedNam }
                        : null
                    }
                    onChange={(option) => {
                      const val = option ? option.value : "";
                      setSelectedNam(val);
                      console.log("NAM selecionado:", val);
                    }}
                    isSearchable
                    placeholder="Selecione ou digite..."
                  />
                </div>

                {/* Filtro por MANAGER */}
                <div className="flex flex-col mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    MANAGER
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={managerSelectOptions}
                    value={
                      selectedManager
                        ? { value: selectedManager, label: selectedManager }
                        : null
                    }
                    onChange={(option) => {
                      const val = option ? option.value : "";
                      setSelectedManager(val);
                      console.log("MANAGER selecionado:", val);
                    }}
                    isSearchable
                    placeholder="Selecione ou digite..."
                  />
                </div>
              </div>
              <div className="flex flex-col">
                {/* Filtro por MKT_Name */}
                <div className="flex flex-col mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    MKT_Name
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={mktNameSelectOptions}
                    value={
                      selectedMktName
                        ? { value: selectedMktName, label: selectedMktName }
                        : null
                    }
                    onChange={(option) => {
                      const val = option ? option.value : "";
                      setSelectedMktName(val);
                      console.log("MKT_Name selecionado:", val);
                    }}
                    isSearchable
                    placeholder="Selecione ou digite..."
                  />
                </div>

                {/* Filtro por Runrate_NPI */}
                <div className="flex flex-col mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Runrate_NPI
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={runrateNPISelectOptions}
                    value={
                      selectedRunrateNPI
                        ? {
                            value: selectedRunrateNPI,
                            label: selectedRunrateNPI,
                          }
                        : null
                    }
                    onChange={(option) => {
                      const val = option ? option.value : "";
                      setSelectedRunrateNPI(val);
                      console.log("Runrate_NPI selecionado:", val);
                    }}
                    isSearchable
                    placeholder="Selecione ou digite..."
                  />
                </div>
              </div>
              <div className="flex flex-col">
                {/* Filtro por Product_Group */}
                <div className="flex flex-col mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product_Group
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={productGroupSelectOptions}
                    value={
                      selectedProductGroup
                        ? {
                            value: selectedProductGroup,
                            label: selectedProductGroup,
                          }
                        : null
                    }
                    onChange={(option) => {
                      const val = option ? option.value : "";
                      setSelectedProductGroup(val);
                      console.log("Product_Group selecionado:", val);
                    }}
                    isSearchable
                    placeholder="Selecione ou digite..."
                  />
                </div>

                {/* Filtro por CHAVE */}
                <div className="flex flex-col mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CHAVE
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={chaveSelectOptions}
                    value={
                      selectedChave
                        ? { value: selectedChave, label: selectedChave }
                        : null
                    }
                    onChange={(option) => {
                      const val = option ? option.value : "";
                      setSelectedChave(val);
                      console.log("CHAVE selecionado:", val);
                    }}
                    isSearchable
                    placeholder="Selecione ou digite..."
                  />
                </div>
              </div>
              {/* Extra space or additional buttons */}
            </div>
            <div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  HAAAA
                </button>
              </div>
            </div>
            <Drawer isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>

          <div className="w-4/12  flex flex-col justify-between">
            <div className="flex flex-col ">
              <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white text-right">
                Save changes
              </h1>
              <h2 className="w-1/2 py-2 text-[10px] text-[#9ca3af] text-right ml-auto">
                Faça as alterações e os filtros na tabela, e somente após fazer
                todas as altera es necessárias, clique em salvar para salvar
                todas as alterações realizadas. Se você fizer alterações e mudar
                os filtros sem salvar, as alterações serão perdidas.
              </h2>
            </div>
            <div className="flex flex-row ml-auto ">
              <button className="px-5 mr-5 py-2 my-2 rounded-md bg-red-600 text-white font-bold">
                Descart
              </button>
              <button className="px-5  py-2 my-2 rounded-md bg-green-600 text-white font-bold">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
