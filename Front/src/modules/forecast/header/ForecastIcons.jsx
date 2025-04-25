import { navigate } from "astro/virtual-modules/transitions-router.js";
import React from "react";

export default function ForecastIcons({
  icon_description,
  text,
  isOpen,
  setIsOpen,
  icon,
  fn,
  openMenuStatus,
  size = 16,
  setDrawerContent,
  drawerContentContent,
}) {
  return (
    <div className="flex flex-col items-start">
      <h1 className={`text-[12px] py-3 ${text ? "block" : "hidden"}`}>
        {text}
      </h1>
      <button
        type="button"
        className="mb text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm  text-center inline-flex items-center me-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 p-4"
        onClick={() => {
          if (openMenuStatus) {
            setIsOpen(!isOpen);
            setDrawerContent(drawerContentContent);
          }
          fn && fn();
          if (text === "Files") {
            navigate(`/mediaCentral`);
          }
          // Content={<FilterGroup fetchInitialData={fetchInitialData} />}
        }}
      >
        {React.cloneElement(icon, { size })}
        <span className="sr-only">{icon_description}</span>
      </button>
    </div>
  );
}

// Content={<FilterGroup fetchInitialData={fetchInitialData} />}
