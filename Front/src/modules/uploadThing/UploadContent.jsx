import React, { useState, useEffect } from "react";
import DataTable from "./DataTable.jsx";

// Função para remover o hash do nome do arquivo (para exibição)
function removeHashFromFilename(filename) {
  return filename.replace(/-\d+(?=\.)/, "");
}

export default function UC() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  // Função para buscar a lista completa de arquivos no backend.
  const fetchFiles = async () => {
    try {
      const response = await fetch("https://api.logihub.space/api/files");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const mappedFiles = data.map((file) => ({
        id: file.id,
        spreadsheetName: removeHashFromFilename(file.plan_name),
        uploadBy: file.user,
        uploadDate: new Date(file.created_at).toLocaleString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      }));
      setFiles(mappedFiles);
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const sendFileToAPI = async (file) => {
    const formData = new FormData();
    formData.append("planilha", file);

    // Recupere o token do localStorage (ou de onde estiver armazenado)
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://api.logihub.space/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          // Envia o token no header Authorization
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Upload realizado com sucesso:", data);
      return data;
    } catch (error) {
      console.error("Erro ao enviar o arquivo para a API:", error);
      throw error;
    }
  };

  // Função que lida com o upload do arquivo via input.
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setUploadMessage(null);
      try {
        const uploadedFileData = await sendFileToAPI(file);
        const newFile = {
          id: uploadedFileData.id,
          spreadsheetName: removeHashFromFilename(uploadedFileData.plan_name),
          uploadBy: uploadedFileData.user,
          // Exibe a data com a hora completa:
          uploadDate: new Date(uploadedFileData.created_at).toLocaleString(
            "pt-BR",
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            }
          ),
        };
        setFiles((prevFiles) => [...prevFiles, newFile]);
        setUploadMessage("Upload realizado com sucesso!");
      } catch (error) {
        setUploadMessage("Erro no upload do arquivo!");
      } finally {
        setUploading(false);
      }
    }
  };

  // Função para lidar com a exclusão do arquivo.
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://api.logihub.space/api/files/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    } catch (error) {
      console.error("Erro ao excluir arquivo:", error);
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="sm:px-8 md:px-8 lg:px-8 xl:px-8 2xl:px-8">
        <h1 className="text-white text-4xl sm:pl-2 md:pl-10 lg:pl-10 xl:pl-0 pt-10">
          Media Center
        </h1>
        <p className="text-white my-5 text-sm sm:pl-2 md:pl-10 lg:pl-10 xl:pl-0">
          Upload and manage your media content
        </p>
        <p className="text-white my-5 text-sm sm:pl-2 md:pl-10 lg:pl-10 xl:pl-0">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Necessitatibus architecto soluta officia dicta porro autem doloremque
          iure, minima reiciendis delectus ex blanditiis expedita, corporis
          repellendus perferendis ipsum id? Itaque, nobis.
        </p>
      </div>
      <div className="flex flex-col">
        {/* Seção de Upload */}
        <div className="w-full flex flex-col my-10 sm:pl-2 md:pl-10 lg:pl-10 xl:pl-8 sm:pr-2 md:pr-10 lg:pr-10 xl:pr-10">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                    <p className="text-blue-500 mt-2">Carregando...</p>
                  </div>
                ) : (
                  <>
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      CSV, XLS or XLSX (MAX. 10MB)
                    </p>
                  </>
                )}
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
          {uploadMessage && (
            <div className="mt-4 text-center">
              <p
                className={
                  uploadMessage.includes("sucesso")
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {uploadMessage}
              </p>
            </div>
          )}
        </div>

        {/* Seção de listagem dos arquivos */}
        <div className="w-full sm:px-8 md:px-8 lg:px-8 xl:px-8 2xl:px-8">
          <DataTable files={files} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
