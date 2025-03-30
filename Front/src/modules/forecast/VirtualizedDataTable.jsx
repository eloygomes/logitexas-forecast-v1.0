// src/components/VirtualizedDataTable.jsx
import React from "react";
import { FixedSizeList as List } from "react-window";

export function VirtualizedDataTable({
  columns,
  data,
  rowHeight = 40,
  height = 400,
  renderRow,
}) {
  // renderRow is a function that receives an index and style, and returns the row component.
  // For example, it might render a <tr> for table rows.
  const Row = ({ index, style }) => {
    return <div style={style}>{renderRow(data[index], index)}</div>;
  };

  return (
    <List
      height={height} // total height of the visible window (adjust as needed)
      itemCount={data.length}
      itemSize={rowHeight} // height of each row
      width="100%"
    >
      {Row}
    </List>
  );
}
