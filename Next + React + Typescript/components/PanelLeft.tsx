import CategoryList from "./CategoryList";

type Props = {
  selectedCategoryId: number | null;
  onCategorySelect: (id: number | null) => void;
};

const PanelLeft = ({ selectedCategoryId, onCategorySelect }: Props) => (
  <aside id="left-panel">
    <h2>Categories</h2>
    <CategoryList selected={selectedCategoryId} onSelect={onCategorySelect} />
    <div className="footer-content">Gritlab &copy; 2025</div>
  </aside>
);

export default PanelLeft;
