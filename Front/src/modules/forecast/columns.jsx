// columns.js
// Definição das colunas para ForecastDataGrid.
// Cada coluna é ordenável (enableSorting: true) e possui um editor inline.
// Usamos um componente EditableCell para permitir a edição inline.

import React, { useState } from "react";

// Componente para edição inline de célula
// function EditableCell({ initialValue, onChange }) {
//   const [editing, setEditing] = useState(false);
//   const [value, setValue] = useState(initialValue);

//   function handleBlur() {
//     setEditing(false);
//     onChange(value);
//   }

//   if (!editing) {
//     return (
//       <div onClick={() => setEditing(true)} className="cursor-pointer">
//         {value}
//       </div>
//     );
//   }

//   return (
//     <input
//       autoFocus
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//       onBlur={handleBlur}
//       className="border border-gray-300 p-1"
//     />
//   );
// }

// EditableCell component
function EditableCell({ initialValue, onChange }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  function handleBlur() {
    setEditing(false);
    onChange(value);
  }

  if (!editing) {
    return (
      <div onClick={() => setEditing(true)} className="cursor-pointer">
        {value}
      </div>
    );
  }

  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      className="border w-full border-red-500 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-red-300"
    />
  );
}

// Definindo 10 colunas com edição inline
export const columns = [
  {
    accessorKey: "cliente_t2",
    header: "Cliente T2",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "cliente_t2", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "vendedor",
    header: "Vendedor",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "vendedor", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "gerente",
    header: "Gerente",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "gerente", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "categoria_produto",
    header: "Categoria Produto",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "categoria_produto", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "subcategoria",
    header: "Subcategoria",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "subcategoria", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "cod_produto",
    header: "Cód Produto",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "cod_produto", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "descricao_produto",
    header: "Descrição Produto",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "descricao_produto", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "tipo_fcst",
    header: "Tipo fcst",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "tipo_fcst", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "valor",
    header: "Valor R$",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "valor", val);
      };
      return (
        <EditableCell
          initialValue={String(initialValue)}
          onChange={handleChange}
        />
      );
    },
  },
  {
    accessorKey: "valor_brl",
    header: "Valor BRL",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "valor_brl", val);
      };
      return (
        <EditableCell
          initialValue={String(initialValue)}
          onChange={handleChange}
        />
      );
    },
  },
];
