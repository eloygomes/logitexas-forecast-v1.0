import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";

import { columns } from "./columns";
import { initialData } from "./data";

export default function ForecastDataGrid() {
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

  // Filtro simples: filtra a row se algum dos seus valores incluir o texto buscado
  const filteredData = data.filter((row) => {
    if (!search) return true;
    const lower = search.toLowerCase();
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(lower)
    );
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
            Forecast by Client
          </h1>
          <h2 className="w-1/2 py-2 text-sm text-[#9ca3af]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab,
            molestias blanditiis quam voluptas odio repudiandae? Impedit quis,
            hic quidem recusandae cupiditate autem nostrum quo incidunt sapiente
            tempore pariatur, consequuntur quae?
          </h2>
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
