"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Modal from "../components/Modal";
import UserLogin from "../components/UserLogin";
import UserRegister from "../components/UserRegister";
import UserProfile from "../components/UserProfile";
import PanelLeft from "../components/PanelLeft";
import PanelRight from "../components/PanelRight";
import PanelMiddle from "../components/PanelMiddle";
import type { Category } from "../types/types";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => setIsLoggedIn(false);

  useEffect(() => {
    fetch("/api/categories", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      });
  }, []);

  return (
    <>
      <Header
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
        onProfile={() => setShowProfile(true)}
      />
      <main>
        <PanelLeft
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />
        <div style={{ flex: 1 }}>
          <PanelMiddle
            selectedCategoryId={selectedCategoryId}
            categories={categories}
          />
        </div>
        <PanelRight />
      </main>
      <Modal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        containerId="login-container"
      >
        <UserLogin
          onSuccess={() => {
            setIsLoggedIn(true);
            setShowLogin(false);
          }}
          onCancel={() => setShowLogin(false)}
        />
      </Modal>
      <Modal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        containerId="register-container"
      >
        <UserRegister
          onSuccess={() => {
            setIsLoggedIn(true);
            setShowRegister(false);
          }}
          onCancel={() => setShowRegister(false)}
        />
      </Modal>
      <Modal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        containerId="profile-container"
      >
        <UserProfile />
      </Modal>
    </>
  );
}
