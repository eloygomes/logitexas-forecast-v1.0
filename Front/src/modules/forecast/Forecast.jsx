import React from "react";
import ForecastDataGrid from "./ForecastDataGrid";
import ForecastHeader from "./ForecastHeader";

export default function Forecast() {
  return (
    <>
      <div className="p-5 mt-5 bg-[#1f2937]  border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
        <ForecastHeader />
      </div>
      <div className="p-5 mt-5 bg-[#1f2937]  border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
        <ForecastDataGrid />
      </div>
      <div className="p-5 mt-5 bg-[#1f2937]  border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
        <ForecastDataGrid />
      </div>
    </>
  );
}
