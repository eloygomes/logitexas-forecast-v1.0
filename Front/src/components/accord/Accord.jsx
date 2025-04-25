import React, { useState } from "react";
import NewForecastHeader from "../../modules/forecast/header/NewForecastHeader";
export default function Accord({
  dataState,
  setDataState,
  tableData,
  setTableData,
  pinFocusedColumn,
  onPinRow,
  onClearColumns,
  onClearRows,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="accordion-collapse">
      <h2 id="accordion-collapse-heading-1 ">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-5 py-2 font-medium rtl:text-right text-gray-500  rounded-t-xl focus:ring-4   gap-3"
          aria-expanded={isOpen}
          aria-controls="accordion-collapse-body-1"
        >
          <h1 className="text-xl text-[goldenrod] font-bold">FORECAST</h1>
          <svg
            className={`w-3 h-3 transition-transform ${
              !isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>

      {isOpen && (
        <div
          id="accordion-collapse-body-1"
          className="p-5  dark:border-gray-700 dark:bg-gray-900"
          aria-labelledby="accordion-collapse-heading-1"
        >
          <NewForecastHeader
            dataState={dataState}
            setDataState={setDataState}
            tableData={tableData}
            setTableData={setTableData}
            pinFocusedColumn={pinFocusedColumn}
            onPinRow={onPinRow}
            onClearColumns={onClearColumns}
            onClearRows={onClearRows}
          />
        </div>
      )}
    </div>
  );
}
