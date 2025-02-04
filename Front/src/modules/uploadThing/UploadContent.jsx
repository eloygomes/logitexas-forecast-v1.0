import React, { useState } from "react";
import DataTable from "./DataTable.jsx";

export default function UC() {
  // Dados iniciais para a tabela (exemplo)
  const [files, setFiles] = useState([
    {
      id: 1,
      spreadsheetName: "Budget2024.xlsx",
      uploadBy: "Alice",
      uploadDate: "2025-01-31",
    },
    {
      id: 2,
      spreadsheetName: "SalesReport.csv",
      uploadBy: "Bob",
      uploadDate: "2025-01-30",
    },
    {
      id: 3,
      spreadsheetName: "Inventory.xlsx",
      uploadBy: "Charlie",
      uploadDate: "2025-01-29",
    },
  ]);

  // Função para enviar o arquivo para a API usando fetch
  const sendFileToAPI = async (file) => {
    const formData = new FormData();
    // Importante: o nome do campo é "planilha", conforme configurado no multer
    formData.append("planilha", file);

    try {
      const response = await fetch("https://api.logihub.space/api/upload", {
        method: "POST",
        body: formData,
        // Não é necessário definir 'Content-Type' quando se usa FormData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload realizado com sucesso:", data);
    } catch (error) {
      console.error("Erro ao enviar o arquivo para a API:", error);
    }
  };

  // Função que lida com o upload do arquivo via input
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cria um objeto para atualizar a tabela com as informações do arquivo
      const newFile = {
        id: files.length + 1, // Geração simples de id
        spreadsheetName: file.name,
        uploadBy: "User", // Você pode personalizar conforme necessário
        uploadDate: new Date().toISOString().slice(0, 10), // Formato: YYYY-MM-DD
      };
      // Atualiza o estado para exibir o arquivo na DataTable
      setFiles([...files, newFile]);
      // Envia o arquivo para a API
      await sendFileToAPI(file);
    }
  };

  return (
    <div className="px-4 pt-6">
      <h1 className="text-white text-4xl sm:pl-2 md:pl-10 lg:pl-10 xl:pl-10 pt-10">
        Media Center
      </h1>
      <p className="text-white my-5 text-sm sm:pl-2 md:pl-10 lg:pl-10 xl:pl-10">
        Upload and manage your media content
      </p>
      <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row">
        {/* Left: Upload e informações */}
        <div className="w-full sm:w-full md:w-1/3 lg:w-1/3 xl:w-1/3 flex flex-col sm:pl-2 md:pl-10 lg:pl-10 xl:pl-10 sm:pr-2 md:pr-10 lg:pr-10 xl:pr-10">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  CSV, XLS or XLSX (MAX. 10MB)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept=".csv, .xls, .xlsx"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
          <p className="text-white my-5 text-sm">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Necessitatibus architecto soluta officia dicta porro autem
            doloremque iure, minima reiciendis delectus ex blanditiis expedita,
            corporis repellendus perferendis ipsum id? Itaque, nobis.
          </p>
        </div>

        {/* Right: DataTable exibindo os arquivos */}
        <div className="w-full sm:w-full md:w-2/3 lg:w-2/3 xl:w-2/3">
          <DataTable files={files} />
        </div>
      </div>
    </div>
  );
}
