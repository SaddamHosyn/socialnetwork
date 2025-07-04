import React from "react";
import type { Category } from "../types/types";

type Props = {
  category: Category;
  selected: boolean;
  onClick: () => void;
};

const CategorySingle: React.FC<Props> = ({ category, selected, onClick }) => (
  <span
    className={`category-pill${selected ? " selected" : ""}`}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-pressed={selected}
  >
    {category.name}
  </span>
);

export default CategorySingle;
