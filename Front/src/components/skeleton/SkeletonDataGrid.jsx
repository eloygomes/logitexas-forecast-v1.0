import React from "react";

export function SkeletonDataGrid({ rows = 5, columns = 5 }) {
  const skeletonRows = Array.from({ length: rows });
  const skeletonCols = Array.from({ length: columns });

  return (
    <div className="space-y-2">
      {skeletonRows.map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2">
          {skeletonCols.map((_, colIndex) => (
            <div
              key={colIndex}
              className="flex-1 h-8 bg-gray-300 rounded animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
