import React, { useState } from "react";

// Componente para edição inline de célula
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

// Definindo 16 colunas com edição inline
export const columns_tab2 = [
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
    accessorKey: "estoque_t2",
    header: "Estoque T2",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "estoque_t2", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "em_transito_dist",
    header: "Em transito Dist",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "em_transito_dist", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "total_estoque_t2",
    header: "Total estoque T2",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "total_estoque_t2", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "media_vendas_13w",
    header: "Media Vendas 13W",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "media_vendas_13w", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "woh_t2",
    header: "WOH T2",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "woh_t2", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "fcst_frozen_si",
    header: "Fcst Frozen SI",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "fcst_frozen_si", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "realizado_si",
    header: "Realizado SI",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "realizado_si", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "pct_fcst_si",
    header: "% Fcst SI",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "pct_fcst_si", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "realizado_si_ly",
    header: "Realizado SI LY",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "realizado_si_ly", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "pct_yoy",
    header: "% YoY",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "pct_yoy", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "fcst_frozen_so",
    header: "Fcst Frozen SO",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "fcst_frozen_so", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "realizado_so",
    header: "Realizado SO",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "realizado_so", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "pct_fcst_so",
    header: "% Fcst SO",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "pct_fcst_so", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "realizado_so_ly",
    header: "Realizado SO LY",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "realizado_so_ly", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "pct_yoy_so",
    header: "% YoY",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "pct_yoy_so", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
];
