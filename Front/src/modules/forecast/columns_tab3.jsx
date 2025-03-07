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

// Definindo 10 colunas com edição inline
export const columns_tab3 = [
  {
    accessorKey: "estoque_proj_q2fy26",
    header: "Estoque Proj Q2FY26",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "estoque_proj_q2fy26", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "woh_q2fy26",
    header: "WOH Q2FY26",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "woh_q2fy26", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "julho",
    header: "Julho",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "julho", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "agosto",
    header: "Agosto",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "agosto", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "setembro",
    header: "Setembro",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "setembro", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "total_q2fy26",
    header: "TotalQ2FY26",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "total_q2fy26", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "fcst_evento_q2fy26",
    header: "Fcst Evento Q2FY26",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "fcst_evento_q2fy26", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "total_fcst_q2fy26",
    header: "Total Fcst Q2FY26",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "total_fcst_q2fy26", val);
      };
      return (
        <EditableCell initialValue={initialValue} onChange={handleChange} />
      );
    },
  },
  {
    accessorKey: "so_ly",
    header: "SO LY",
    enableSorting: true,
    cell: ({ row, getValue, table }) => {
      const initialValue = getValue();
      const handleChange = (val) => {
        table.options.meta?.updateData(row.index, "so_ly", val);
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
];
