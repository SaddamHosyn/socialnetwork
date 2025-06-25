import React, { useState } from "react";
import Header from "./components/PageHeader";
import PanelLeft from "./components/PanelLeft";
import PanelMiddle from "./components/PanelMiddle";
import PanelRight from "./components/PanelRight";

const App: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <div style={{ flex: 1, display: "flex" }}>
        <PanelLeft
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />
        <PanelMiddle selectedCategoryId={selectedCategoryId} />
        <PanelRight />
      </div>
    </div>
  );
};

export default App;
