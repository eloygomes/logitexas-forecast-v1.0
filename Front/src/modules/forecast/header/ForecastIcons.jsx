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
          }
          fn && fn();
        }}
      >
        {React.cloneElement(icon, { size })}
        <span className="sr-only">{icon_description}</span>
      </button>
    </div>
  );
}
