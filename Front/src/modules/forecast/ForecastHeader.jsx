// import React, { useEffect, useState } from "react";

// export default function ForecastHeader({ dataState, setDataState }) {
//   const [clients, setClients] = useState([]);
//   const [partNumbers, setPartNumbers] = useState([]);

//   // Estados para os valores selecionados:
//   const [selectedClient, setSelectedClient] = useState("");
//   const [selectedPartNumber, setSelectedPartNumber] = useState("");

//   useEffect(() => {
//     getClients().then((resp) => {
//       // console.log("Clientes:", resp.rows);
//       setClients(resp.rows);
//     });
//   }, []);

//   // Use a função correta para buscar part numbers
//   useEffect(() => {
//     getPartNumbers().then((resp) => {
//       // console.log("Part Numbers:", resp.part_numbers_list);
//       setPartNumbers(resp.part_numbers_list);
//     });
//   }, []);

//   const clientChangeHandler = (e) => {
//     setSelectedClient(e.target.value);
//     console.log(e.target.value);
//     getDataFromaClient(e.target.value).then((resp) => {
//       setDataState(resp.rows);
//       console.log(resp.rows);
//     });
//     // setDataState(resp.rows);
//   };

//   const partNumberChangeHandler = (e) => {
//     setSelectedPartNumber(e.target.value);
//     console.log(e.target.value);
//     getDataFromPartNumber(e.target.value).then((resp) => {
//       setDataState(resp.rows);
//       console.log(resp.rows);
//     });
//     // setDataState(resp.rows);
//   };

//   const getDataFromaClient = async (client) => {
//     console.log("client", client);
//     const token = localStorage.getItem("token");
//     const response = await fetch(
//       `https://api.logihub.space/api/forecast-data/clients/${client}`,

//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
//     return await response.json();
//   };

//   const getClients = async () => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(
//       "https://api.logihub.space/api/forecast-data/clients",
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
//     return await response.json();
//   };

//   const getDataFromPartNumber = async (partNumber) => {
//     console.log("partNumber", partNumber);
//     const token = localStorage.getItem("token");
//     const response = await fetch(
//       `https://api.logihub.space/api/forecast-data/partnumbers/${partNumber}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
//     return await response.json();
//   };

//   const getPartNumbers = async () => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(
//       "https://api.logihub.space/api/forecast-data/partnumbers",
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
//     return await response.json();
//   };

//   return (
//     <div className="p-4 ">
//       <div className="flex flex-row items-center justify-between">
//         <div className="w-1/2 flex flex-col">
//           <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
//             Forecast
//           </h1>
//           <h2 className="w-1/2 py-2 text-sm text-[#9ca3af]">
//             Use a filter to start
//           </h2>

//           <div className="w-10/12 flex flex-row justify-between mt-5">
//             <div className="flex flex-col mr-5">
//               <label
//                 htmlFor="client"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Filter by client
//               </label>
//               <select
//                 id="client"
//                 name="client"
//                 className="mt-1 block w-full pl-2 text-start text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
//                 // onChange={(e) => setSelectedClient(e.target.value)}
//                 onChange={(e) => clientChangeHandler(e)}
//                 value={selectedClient}
//               >
//                 <option value="">Selecione</option>
//                 {clients.map(
//                   (item, index) =>
//                     item.Cliente && (
//                       <option key={index} value={item.Cliente}>
//                         {item.Cliente}
//                       </option>
//                     )
//                 )}
//               </select>
//             </div>
//             <div className="flex flex-col mr-5">
//               <label
//                 htmlFor="partnumber"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Filter by part number
//               </label>
//               <select
//                 id="partnumber"
//                 name="partnumber"
//                 className="mt-1 block w-full pl-2 text-start text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
//                 // onChange={(e) => setSelectedPartNumber(e.target.value)}
//                 onChange={(e) => partNumberChangeHandler(e)}
//                 value={selectedPartNumber}
//               >
//                 <option value="">Selecione</option>
//                 {partNumbers.map(
//                   (item, index) =>
//                     item.Part_Number && (
//                       <option key={index} value={item.Part_Number}>
//                         {item.Part_Number}
//                       </option>
//                     )
//                 )}
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="w-1/2 flex flex-col justify-between">
//           <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
//             Save Forecast
//           </h1>
//           <h2 className="py-2 text-[10px] text-[#9ca3af]">
//             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab,
//             molestias blanditiis quam voluptas odio repudiandae? Impedit quis,
//             hic quidem recusandae cupiditate autem nostrum quo incidunt sapiente
//             tempore pariatur, consequuntur quae?
//           </h2>
//           <div className="flex flex-row ">
//             <button className="px-5 mr-5 py-2 my-2 rounded-md bg-red-600 text-white font-bold">
//               Descart
//             </button>
//             <button className="px-5 mr-5 py-2 my-2 rounded-md bg-green-600 text-white font-bold">
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";

export default function ForecastHeader({ dataState, setDataState }) {
  const [clients, setClients] = useState([]);
  const [partNumbers, setPartNumbers] = useState([]);

  // Estados para os valores selecionados:
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPartNumber, setSelectedPartNumber] = useState("");

  useEffect(() => {
    getClients().then((resp) => {
      setClients(resp.rows);
    });
  }, []);

  useEffect(() => {
    getPartNumbers().then((resp) => {
      setPartNumbers(resp.part_numbers_list);
    });
  }, []);

  const clientChangeHandler = (e) => {
    const newClient = e.target.value;
    setSelectedClient(newClient);
    console.log("Cliente selecionado:", newClient);
    // Se já houver um part number selecionado, use ambos os filtros;
    // caso contrário, utilize somente o filtro de cliente.
    if (selectedPartNumber) {
      getFilteredData(newClient, selectedPartNumber)
        .then((resp) => {
          setDataState(resp.rows);
          console.log(resp.rows);
        })
        .catch((error) => console.error(error));
    } else {
      getDataFromaClient(newClient)
        .then((resp) => {
          setDataState(resp.rows);
          console.log(resp.rows);
        })
        .catch((error) => console.error(error));
    }
  };

  const partNumberChangeHandler = (e) => {
    const newPartNumber = e.target.value;
    setSelectedPartNumber(newPartNumber);
    console.log("Part Number selecionado:", newPartNumber);
    // Se já houver um cliente selecionado, use ambos os filtros;
    // caso contrário, utilize somente o filtro de part number.
    if (selectedClient) {
      getFilteredData(selectedClient, newPartNumber)
        .then((resp) => {
          setDataState(resp.rows);
          console.log(resp.rows);
        })
        .catch((error) => console.error(error));
    } else {
      getDataFromPartNumber(newPartNumber)
        .then((resp) => {
          setDataState(resp.rows);
          console.log(resp.rows);
        })
        .catch((error) => console.error(error));
    }
  };

  const getDataFromaClient = async (client) => {
    console.log("client", client);
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/clients/${client}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getClients = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/clients",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getDataFromPartNumber = async (partNumber) => {
    console.log("partNumber", partNumber);
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://api.logihub.space/api/forecast-data/partnumbers/${partNumber}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getPartNumbers = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://api.logihub.space/api/forecast-data/partnumbers",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
    return await response.json();
  };

  const getFilteredData = async (client, partNumber) => {
    const token = localStorage.getItem("token");
    let url = "https://api.logihub.space/api/forecast-data/filter?";
    const params = [];
    if (client) {
      params.push("client=" + encodeURIComponent(client));
    }
    if (partNumber) {
      params.push("partNumber=" + encodeURIComponent(partNumber));
    }
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

          <div className="w-10/12 flex flex-row  mt-5">
            <div className="flex flex-col mr-5">
              <label
                htmlFor="client"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by client
              </label>
              <select
                id="client"
                name="client"
                className="mt-1 block w-full  pl-2 text-start text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
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
            <div className="flex flex-col mr-5">
              <label
                htmlFor="partnumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by part number
              </label>
              <select
                id="partnumber"
                name="partnumber"
                className="mt-1 block w-full  pl-2 text-start text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
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
