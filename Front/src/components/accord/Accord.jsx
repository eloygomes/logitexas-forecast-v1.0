import React, { useState } from "react";
import NewForecastHeader from "../../modules/forecast/header/NewForecastHeader";
export default function Accord({
  dataState,
  setDataState,
  tableData,
  setTableData,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="accordion-collapse">
      <h2 id="accordion-collapse-heading-1">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
          aria-expanded={isOpen}
          aria-controls="accordion-collapse-body-1"
        >
          <h1 className="text-xl text-[goldenrod] font-bold">NAM SCREEN</h1>
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
          />
        </div>
      )}
    </div>
  );
}
