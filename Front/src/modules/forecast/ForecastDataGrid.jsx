import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";

// import { columns } from "./columns";

export default function ForecastDataGrid({ cardTitle, initialData, columns }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");

  // Função para atualizar a célula editada
  function updateData(rowIndex, columnId, value) {
    setData((old) => {
      const newData = [...old];
      newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
      return newData;
    });
  }

  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD") // separa em caracteres base + acentos
      .replace(/[\u0300-\u036f]/g, ""); // remove acentos
  }

  const filteredData = data.filter((row) => {
    if (!search.trim()) return true;

    const tokens = normalize(search).split(/\s+/);

    // return Object.values(row).some((val) => {
    //   const fieldValue = normalize(String(val));

    //   return tokens.every((token) => fieldValue.includes(token));
    // });
    return tokens.every((token) =>
      Object.values(row).some((val) => normalize(String(val)).includes(token))
    );
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-row items-center justify-between ">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
            {cardTitle}
          </h1>
        </div>
        <input
          type="text"
          placeholder="Buscar na tabela..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm border p-2 rounded-md"
        />
      </div>

      <DataTable columns={columns} data={filteredData} meta={{ updateData }} />
    </div>
  );
}
