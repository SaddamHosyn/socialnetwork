import React from "react";

type CategoryProps = {
  name: string;
  icon?: string;
  selected?: boolean;
  onClick?: () => void;
};

const Category: React.FC<CategoryProps> = ({
  name,
  icon,
  selected,
  onClick,
}) => (
  <div
    className={`category-pill${selected ? " selected" : ""}`}
    onClick={onClick}
    style={{
      display: "inline-block",
      padding: "0.5em 1em",
      margin: "0.25em",
      borderRadius: "16px",
      background: selected ? "#cce6ff" : "#f0f0f0",
      cursor: "pointer",
      fontWeight: selected ? "bold" : "normal",
      userSelect: "none",
    }}
  >
    {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
    {name}
  </div>
);

export default Category;
