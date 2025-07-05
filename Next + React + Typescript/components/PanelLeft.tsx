import CategoryList from "./CategoryList";
import type { Category } from "../types/types";

type Props = {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategorySelect: (id: number | null) => void;
};

const PanelLeft = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: Props) => (
  <aside id="left-panel">
    <h2>Categories</h2>
    <CategoryList
      categories={categories}
      selected={selectedCategoryId}
      onSelect={onCategorySelect}
    />
    <div className="footer-content">Gritlab &copy; 2025</div>
  </aside>
);

export default PanelLeft;
