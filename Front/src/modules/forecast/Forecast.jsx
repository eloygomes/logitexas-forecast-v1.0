import React from "react";
import ForecastDataGrid from "./ForecastDataGrid";

export default function Forecast() {
  return (
    <>
      <div className="p-5 m-5 mt-20 bg-gray-300 rounded">
        <ForecastDataGrid />
      </div>
    </>
  );
}
