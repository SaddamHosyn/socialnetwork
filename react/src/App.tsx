import React, { useState } from "react";
import UserLogin from "./components/UserLogin";
import UserRegister from "./components/UserRegister";
import Modal from "./components/Modal";
import Header from "./components/Header";
import PanelLeft from "./components/PanelLeft";
import PanelMiddle from "./components/PanelMiddle";
import PanelRight from "./components/PanelRight";

const App: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    // TODO: Add real logout API call if needed
    setIsLoggedIn(false);
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Fixed header */}
      <Header
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />

      {/* Main panels */}
      <div style={{ flex: 1, display: "flex" }}>
        <PanelLeft
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />
        <PanelMiddle selectedCategoryId={selectedCategoryId} />
        <PanelRight />
      </div>

      {/* Auth modals */}
      <Modal open={showLogin} onClose={() => setShowLogin(false)}>
        <UserLogin
          onSuccess={() => {
            setIsLoggedIn(true);
            setShowLogin(false);
          }}
          onCancel={() => setShowLogin(false)}
        />
      </Modal>
      <Modal open={showRegister} onClose={() => setShowRegister(false)}>
        <UserRegister
          onSuccess={() => {
            setIsLoggedIn(true);
            setShowRegister(false);
          }}
          onCancel={() => setShowRegister(false)}
        />
      </Modal>
    </div>
  );
};

export default App;
