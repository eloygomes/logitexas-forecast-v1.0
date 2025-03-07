import React from "react";
import ForecastDataGrid from "./ForecastDataGrid";
import ForecastHeader from "./ForecastHeader";

import { initialData } from "./data";
import { data_tab2 } from "./data_tab2";
import { data_tab3 } from "./data_tab3";
import { columns } from "./columns";
import { columns_tab2 } from "./columns_tab2";
import { columns_tab3 } from "./columns_tab3";

export default function Forecast() {
  return (
    <>
      <div className="p-5 mt-5 bg-[#1f2937]  border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
        <ForecastHeader />
      </div>
      <div className="p-5 mt-5 bg-[#1f2937]  border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
        <ForecastDataGrid
          cardTitle={"Forecast by Client"}
          initialData={initialData}
          columns={columns}
        />
      </div>
      <div className="p-5 mt-5 bg-[#1f2937]  border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
        <ForecastDataGrid
          cardTitle={"Snapshot do trimestre atual"}
          initialData={data_tab2}
          columns={columns_tab2}
        />
      </div>
      <div className=" p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current ">
        <ForecastDataGrid
          cardTitle={"REVISAO FORECAST - Q2FY26"}
          initialData={data_tab3}
          columns={columns_tab3}
        />
      </div>
    </>
  );
}
