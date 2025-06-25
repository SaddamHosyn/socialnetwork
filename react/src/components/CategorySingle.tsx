import React from "react";

type Props = {
  name: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
};

const CategorySingle: React.FC<Props> = ({ name, icon, selected, onClick }) => (
  <span
    onClick={onClick}
    style={{
      display: "inline-block",
      padding: "5px 14px",
      margin: "4px 0",
      marginRight: 10,
      borderRadius: 12,
      cursor: "pointer",
      background: selected ? "#8ecae6" : "#e3e8f0",
      color: selected ? "#fff" : "#222",
      fontWeight: selected ? "bold" : "normal",
      userSelect: "none",
    }}
  >
    <span style={{ marginRight: 6 }}>{icon}</span>
    {name}
  </span>
);

export default CategorySingle;
