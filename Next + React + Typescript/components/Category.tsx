type CategoryProps = {
  name: string;
  icon?: string;
  selected?: boolean;
  onClick?: () => void;
};

const Category = ({ name, icon, selected, onClick }: CategoryProps) => (
  <div
    className={`category-pill${selected ? " selected" : ""}`}
    onClick={onClick}
  >
    {icon && <span className="category-icon">{icon}</span>}
    {name}
  </div>
);

export default Category;
