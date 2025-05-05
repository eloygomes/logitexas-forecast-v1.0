import React, { useState } from "react";

export default function Drawer({
  isOpen,
  setIsOpen,
  Content,
  isFilterOn,
  setIsFilterOn,
}) {
  //   const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Drawer */}
      {isOpen && (
        <div
          id="drawer-bottom-example"
          className={`max-h-screen fixed bottom-0 left-0 right-0 z-40 w-full p-4 transition-transform duration-500 ease-in-out bg-white dark:bg-gray-700 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
          role="dialog"
          aria-labelledby="drawer-bottom-label"
        >
          {/* <h5
            id="drawer-bottom-label"
            className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
          >
            Filter
          </h5> */}

          {/* Close Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              // setIsFilterOn(false);
            }}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close menu</span>
          </button>

          <div className="flex p-2 justify-center items-center w-full h-34 mb-10 mx-auto container ">
            <div className="w-full">{Content}</div>
          </div>
        </div>
      )}
    </>
  );
}
