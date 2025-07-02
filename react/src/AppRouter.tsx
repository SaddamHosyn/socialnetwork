import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Header from "./components/Header";
import Modal from "./components/Modal";
import UserLogin from "./components/UserLogin";
import UserRegister from "./components/UserRegister";
import UserProfile from "./components/UserProfile";
import PanelLeft from "./components/PanelLeft";
import PanelRight from "./components/PanelRight";
import PanelMiddle from "./components/PanelMiddle";
import PostSingle from "./components/PostSingle";

const AppRouter: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Header
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
        onProfile={() => setShowProfile(true)}
      />
      <main>
        <PanelLeft
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={<PanelMiddle selectedCategoryId={selectedCategoryId} />}
            />
            <Route path="/post/:postId" element={<PostSingleWrapper />} />
          </Routes>
        </div>
        <PanelRight />
      </main>
      {/* Modals go here, INSIDE the BrowserRouter return */}
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
      <Modal open={showProfile} onClose={() => setShowProfile(false)}>
        <UserProfile />
      </Modal>
    </BrowserRouter>
  );
};

// Single post wrapper to read postId from URL
function PostSingleWrapper() {
  const { postId } = useParams();
  if (!postId) return <div>No post found.</div>;
  return <PostSingle postId={Number(postId)} onClose={() => {}} />;
}

export default AppRouter;
