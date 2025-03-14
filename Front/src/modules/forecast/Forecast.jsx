import React, { useRef, useState, useEffect } from "react";
import ForecastDataGrid from "./ForecastDataGrid";
import ForecastHeader from "./ForecastHeader";

import { initialData } from "./data";
import { data_tab2 } from "./data_tab2";
import { data_tab3 } from "./data_tab3";
import { columns } from "./columns";
import { columns_tab2 } from "./columns_tab2";
import { columns_tab3 } from "./columns_tab3";

export default function Forecast() {
  const horizontalScrollRef = useRef(null);
  const firstCardRef = useRef(null); // Para medir o primeiro card
  const [cardWidth, setCardWidth] = useState(0);

  const [cardSTATUS01, setCardSTATUS01] = useState(true);

  // Quando o componente monta, pega a largura do primeiro card
  useEffect(() => {
    if (firstCardRef.current) {
      setCardWidth(firstCardRef.current.offsetWidth);
    }
  }, []);

  // Rola para a esquerda uma "cardWidth"
  function handleScrollLeft() {
    if (horizontalScrollRef.current && cardWidth > 0) {
      horizontalScrollRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  }

  // Rola para a direita uma "cardWidth"
  function handleScrollRight() {
    if (horizontalScrollRef.current && cardWidth > 0) {
      horizontalScrollRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }
  }

  return (
    <>
      <div className="p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
        <ForecastHeader />
      </div>

      {cardSTATUS01 ? (
        <div className="w-1/2 p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
          <div className="ml-5">
            <button
              className="text-white py-2 px-5 border border-white rounded-md mr-5 my-5"
              onClick={() => setCardSTATUS01(false)}
            >
              {">>>"}
            </button>
          </div>
          <ForecastDataGrid
            cardTitle={"Forecast by Client"}
            initialData={initialData}
            columns={columns}
          />
        </div>
      ) : (
        <div className="w-full p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
          <div className="ml-5">
            <button
              className="text-white py-2 px-5 border border-white rounded-md mr-5 my-5"
              onClick={() => setCardSTATUS01(true)}
            >
              {"<<<"}
            </button>
          </div>
          <ForecastDataGrid
            cardTitle={"Forecast by Client"}
            initialData={initialData}
            columns={columns}
          />
        </div>
      )}

      <div className="p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 st-current">
        <ForecastDataGrid
          cardTitle={"Snapshot do trimestre atual"}
          initialData={data_tab2}
          columns={columns_tab2}
        />
      </div>

      {/* Container for QxFY splits */}
      <div className="p-5 mt-5 bg-[#1f2937] border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 st-current">
        <div className="flex flex-col">
          <h1 className="p-5 text-2xl font-bold text-white">QUARTER SPLIT</h1>
          <div className="flex flex-row">
            <button
              onClick={handleScrollLeft}
              className="text-white py-2 px-5 border border-white rounded-md mr-5 my-5"
            >
              {"<<< "}
            </button>
            <button
              onClick={handleScrollRight}
              className="text-white py-2 px-5 border border-white rounded-md mr-5 my-5"
            >
              {">>> "}
            </button>
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={horizontalScrollRef}
          className="w-full flex flex-row overflow-x-scroll space-x-5"
        >
          {/* Repare que o primeiro card tem ref={firstCardRef} */}
          <div ref={firstCardRef} className="w-full bg-pink-400 shrink-0">
            <ForecastDataGrid
              cardTitle={"REVISAO FORECAST - Q1FY25"}
              initialData={data_tab3}
              columns={columns_tab3}
            />
          </div>
          <div className="w-full bg-green-400 shrink-0">
            <ForecastDataGrid
              cardTitle={"REVISAO FORECAST - Q2FY25"}
              initialData={data_tab3}
              columns={columns_tab3}
            />
          </div>
          <div className="w-full bg-red-400 shrink-0">
            <ForecastDataGrid
              cardTitle={"REVISAO FORECAST - Q3FY25"}
              initialData={data_tab3}
              columns={columns_tab3}
            />
          </div>
          <div className="w-full bg-yellow-400 shrink-0">
            <ForecastDataGrid
              cardTitle={"REVISAO FORECAST - Q4FY25"}
              initialData={data_tab3}
              columns={columns_tab3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
