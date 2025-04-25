import React, { useState } from "react";

export default function DrawerContentContentTimeline() {
  const [textColor01, setTextColor01] = useState("text-[goldenrod]");
  const [testColor02, setTextColor02] = useState("text-[goldenrod]");
  const [testColor03, setTextColor03] = useState("text-white");
  const [testColor04, setTextColor04] = useState("text-white");

  return (
    <div className="flex flex-col p-5 pt-2 cursor-pointer">
      <h1 className="text-2xl text-white">Approval Timeline</h1>

      {/* Container com divide-x para separar verticalmente */}
      <div className="w-full flex flex-row divide-x divide-gray-500">
        {/* Primeiro bloco */}
        <div className={`w-full flex flex-col mt-5 ${textColor01} pr-5`}>
          <h1 className="pb-2">UPLOAD FORECAST</h1>
          <div className="flex flex-col">
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">UPLOAD BY</h1>
              <h2 className="text-[12px]">Tatiane Machado</h2>
            </div>
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">UPLOAD DATE</h1>
              <h2 className="text-[12px]">12/12/2025</h2>
            </div>
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">APPROVED BY</h1>
              <h2 className="text-[12px]">Tatiane Machado</h2>
            </div>
          </div>
        </div>

        {/* Segundo bloco */}
        <div className={`w-full flex flex-col mt-5 ${testColor02} px-5`}>
          <h1 className="pb-2">NAM</h1>
          <div className="flex flex-col">
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">UPLOAD BY</h1>
              <h2 className="text-[12px]">Andrea Dória</h2>
            </div>
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">UPLOAD DATE</h1>
              <h2 className="text-[12px]">12/12/2025</h2>
            </div>
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">APPROVED BY</h1>
              <h2 className="text-[12px]">Andrea Dória</h2>
            </div>
          </div>
        </div>

        {/* Terceiro bloco */}
        <div className={`w-full flex flex-col mt-5 ${testColor03} px-5`}>
          <h1 className="pb-2">FILÓ</h1>
          <div className="flex flex-col">
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">UPLOAD BY</h1>
              <h2 className="text-[12px]">Tatiane Machado</h2>
            </div>
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">UPLOAD DATE</h1>
              <h2 className="text-[12px]">12/12/2025</h2>
            </div>
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">APPROVED BY</h1>
              <h2 className="text-[12px]">Tatiane Machado</h2>
            </div>
          </div>
        </div>

        {/* Quarto bloco */}
        <div className={`w-full flex flex-col mt-5 ${testColor04} px-5`}>
          <h1 className="pb-2">DEMAND PLANNING</h1>
          <div className="flex flex-col">
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">UPLOAD BY</h1>
              <h2 className="text-[12px]">Tatiane Machado</h2>
            </div>
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">UPLOAD DATE</h1>
              <h2 className="text-[12px]">Tatiane Machado</h2>
            </div>
            <div className="flex justify-between py-1">
              <h1 className="text-[12px]">APPROVED BY</h1>
              <h2 className="text-[12px]">Tatiane Machado</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
