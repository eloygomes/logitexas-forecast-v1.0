import React from "react";

export default function ForecastHeader() {
  return (
    <div className="p-4 ">
      <div className="flex flex-row items-center justify-between">
        <div className="w-1/2flex flex-col">
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
        <div className="w-1/2 flex flex-col justify-between">
          <h1 className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
            Save Forecast
          </h1>
          <h2 className=" py-2 text-[10px] text-[#9ca3af]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab,
            molestias blanditiis quam voluptas odio repudiandae? Impedit quis,
            hic quidem recusandae cupiditate autem nostrum quo incidunt sapiente
            tempore pariatur, consequuntur quae?
          </h2>
          <div className="flex flex-row ">
            <button className="px-5 mr-5 py-2  my-2 rounded-md bg-red-600 text-white font-bold">
              Descart
            </button>
            <button className="px-5 mr-5 py-2  my-2 rounded-md bg-green-600 text-white font-bold">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
