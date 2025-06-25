// PanelLeft.tsx
import React from "react";
import CategoryList from "./CategoryList";

type Props = {
  selectedCategoryId: number | null;
  onCategorySelect: (id: number | null) => void;
};

const PanelLeft: React.FC<Props> = ({
  selectedCategoryId,
  onCategorySelect,
}) => {
  return (
    <aside style={{ width: 220, padding: 16, borderRight: "1px solid #eee" }}>
      <h3>Categories</h3>
      <CategoryList selected={selectedCategoryId} onSelect={onCategorySelect} />

      {/* Future: Add groups section here */}
      <hr style={{ margin: "24px 0" }} />
      <h3>Groups</h3>
      <div style={{ color: "#aaa", fontSize: 14 }}>(Groups coming soon)</div>
    </aside>
  );
};

export default PanelLeft;
