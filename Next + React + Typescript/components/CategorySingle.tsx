import type { Category } from "../types/types";

type Props = {
  category: Category;
  selected: boolean;
  onClick: () => void;
};

const CategorySingle = ({ category, selected, onClick }: Props) => (
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
