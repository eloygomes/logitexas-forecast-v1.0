import React, { useEffect, useState } from "react";

export default function ForecastHeader({ dataState, setDataState }) {
  // Options para os selects individuais
  const [clients, setClients] = useState([]);
  const [partNumbers, setPartNumbers] = useState([]);
  const [namOptions, setNamOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [mktNameOptions, setMktNameOptions] = useState([]);
  const [runrateNPIOptions, setRunrateNPIOptions] = useState([]);
  const [productGroupOptions, setProductGroupOptions] = useState([]);
  const [chaveOptions, setChaveOptions] = useState([]);

  // Estados para os filtros selecionados
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPartNumber, setSelectedPartNumber] = useState("");
  const [selectedNam, setSelectedNam] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedMktName, setSelectedMktName] = useState("");
  const [selectedRunrateNPI, setSelectedRunrateNPI] = useState("");
  const [selectedProductGroup, setSelectedProductGroup] = useState("");
  const [selectedChave, setSelectedChave] = useState("");

  // Carregar as opções de cada filtro individualmente
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

  // Função que decide qual endpoint chamar baseado nos filtros selecionados
  const updateData = async () => {
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
        // Se nenhum filtro foi selecionado, pode-se optar por não atualizar ou chamar um endpoint default.
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
        // Se mais de um filtro for selecionado, use o endpoint combinado

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

  // useEffect para atualizar dados sempre que algum filtro mudar
  useEffect(() => {
    updateData();
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

  // Handlers para cada select:
  const clientChangeHandler = (e) => {
    setSelectedClient(e.target.value);
    console.log("Cliente selecionado:", e.target.value);
  };

  const partNumberChangeHandler = (e) => {
    setSelectedPartNumber(e.target.value);
    console.log("Part Number selecionado:", e.target.value);
  };

  const namChangeHandler = (e) => {
    setSelectedNam(e.target.value);
    console.log("NAM selecionado:", e.target.value);
  };

  const managerChangeHandler = (e) => {
    setSelectedManager(e.target.value);
    console.log("MANAGER selecionado:", e.target.value);
  };

  const mktNameChangeHandler = (e) => {
    setSelectedMktName(e.target.value);
    console.log("MKT_Name selecionado:", e.target.value);
  };

  const runrateNPIChangeHandler = (e) => {
    setSelectedRunrateNPI(e.target.value);
    console.log("Runrate_NPI selecionado:", e.target.value);
  };

  const productGroupChangeHandler = (e) => {
    setSelectedProductGroup(e.target.value);
    console.log("Product_Group selecionado:", e.target.value);
  };

  const chaveChangeHandler = (e) => {
    setSelectedChave(e.target.value);
    console.log("CHAVE selecionado:", e.target.value);
  };

  // Funções de fetch para chamadas individuais

  const getDataFromaClient = async (client) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/clients/${client}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getDataFromPartNumber = async (partNumber) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/partnumbers/${partNumber}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getDataFromNAM = async (nam) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/nam/${nam}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getDataFromManager = async (manager) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/manager/${manager}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getDataFromMktName = async (mktName) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/mktname/${mktName}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getDataFromRunrateNPI = async (runrate_npi) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/runrate_npi/${runrate_npi}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getDataFromProductGroup = async (product_group) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/product_group/${product_group}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getDataFromChave = async (chave) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/chave/${chave}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  // Funções para buscar as opções de cada filtro
  const getClients = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/clients",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getPartNumbers = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/partnumbers",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getNAM = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/nam",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getManager = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/manager",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getMktName = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/mktname",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getRunrateNPI = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/runrate_npi",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getProductGroup = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/product_group",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getChave = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/chave",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  // Endpoint combinado para múltiplos filtros
  const getFilteredData = async (
    client,
    partNumber,
    nam,
    manager,
    mktName,
    runrate_npi,
    product_group,
    chave
  ) => {
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
  };

  return (
    <div className="p-4 ">
      <div className="flex flex-row items-center justify-between">
        <div className="w-1/2 flex flex-col">
          <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
            Forecast
          </h1>
          <h2 className="w-1/2 py-2 text-sm text-[#9ca3af]">
            Use a filter to start
          </h2>

          <div className="w-10/12 flex flex-wrap mt-5 gap-4">
            {/* Filtro por Cliente */}
            <div className="flex flex-col">
              <label
                htmlFor="client"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by client
              </label>
              <select
                id="client"
                name="client"
                className="mt-1 block w-full pl-2 text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={clientChangeHandler}
                value={selectedClient}
              >
                <option value="">Selecione</option>
                {clients.map(
                  (item, index) =>
                    item.Cliente && (
                      <option key={index} value={item.Cliente}>
                        {item.Cliente}
                      </option>
                    )
                )}
              </select>
            </div>

            {/* Filtro por Part Number */}
            <div className="flex flex-col">
              <label
                htmlFor="partnumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by part number
              </label>
              <select
                id="partnumber"
                name="partnumber"
                className="mt-1 block w-full pl-2 text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={partNumberChangeHandler}
                value={selectedPartNumber}
              >
                <option value="">Selecione</option>
                {partNumbers.map(
                  (item, index) =>
                    item.Part_Number && (
                      <option key={index} value={item.Part_Number}>
                        {item.Part_Number}
                      </option>
                    )
                )}
              </select>
            </div>

            {/* Filtro por NAM */}
            <div className="flex flex-col">
              <label
                htmlFor="nam"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by NAM
              </label>
              <select
                id="nam"
                name="nam"
                className="mt-1 block w-full pl-2 text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={namChangeHandler}
                value={selectedNam}
              >
                <option value="">Selecione</option>
                {namOptions.map((item, index) => (
                  <option key={index} value={item.NAM}>
                    {item.NAM}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por MANAGER */}
            <div className="flex flex-col">
              <label
                htmlFor="manager"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by MANAGER
              </label>
              <select
                id="manager"
                name="manager"
                className="mt-1 block w-full pl-2 text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={managerChangeHandler}
                value={selectedManager}
              >
                <option value="">Selecione</option>
                {managerOptions.map((item, index) => (
                  <option key={index} value={item.MANAGER}>
                    {item.MANAGER}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por MKT_Name */}
            <div className="flex flex-col">
              <label
                htmlFor="mktName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by MKT_Name
              </label>
              <select
                id="mktName"
                name="mktName"
                className="mt-1 block w-full pl-2 text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={mktNameChangeHandler}
                value={selectedMktName}
              >
                <option value="">Selecione</option>
                {mktNameOptions.map((item, index) => (
                  <option key={index} value={item.MKT_Name}>
                    {item.MKT_Name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Runrate_NPI */}
            <div className="flex flex-col">
              <label
                htmlFor="runrate_npi"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by Runrate_NPI
              </label>
              <select
                id="runrate_npi"
                name="runrate_npi"
                className="mt-1 block w-full pl-2 text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={runrateNPIChangeHandler}
                value={selectedRunrateNPI}
              >
                <option value="">Selecione</option>
                {runrateNPIOptions.map((item, index) => (
                  <option key={index} value={item.Runrate_NPI}>
                    {item.Runrate_NPI}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Product_Group */}
            <div className="flex flex-col">
              <label
                htmlFor="product_group"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by Product_Group
              </label>
              <select
                id="product_group"
                name="product_group"
                className="mt-1 block w-full pl-2 text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={productGroupChangeHandler}
                value={selectedProductGroup}
              >
                <option value="">Selecione</option>
                {productGroupOptions.map((item, index) => (
                  <option key={index} value={item.Product_Group}>
                    {item.Product_Group}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por CHAVE */}
            <div className="flex flex-col">
              <label
                htmlFor="chave"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by CHAVE
              </label>
              <select
                id="chave"
                name="chave"
                className="mt-1 block w-full pl-2 text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={chaveChangeHandler}
                value={selectedChave}
              >
                <option value="">Selecione</option>
                {chaveOptions.map((item, index) => (
                  <option key={index} value={item.CHAVE}>
                    {item.CHAVE}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="w-1/2 flex flex-col justify-between">
          <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
            Save Forecast
          </h1>
          <h2 className="py-2 text-[10px] text-[#9ca3af]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab,
            molestias blanditiis quam voluptas odio repudiandae? Impedit quis,
            hic quidem recusandae cupiditate autem nostrum quo incidunt sapiente
            tempore pariatur, consequuntur quae?
          </h2>
          <div className="flex flex-row ">
            <button className="px-5 mr-5 py-2 my-2 rounded-md bg-red-600 text-white font-bold">
              Descart
            </button>
            <button className="px-5 mr-5 py-2 my-2 rounded-md bg-green-600 text-white font-bold">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
