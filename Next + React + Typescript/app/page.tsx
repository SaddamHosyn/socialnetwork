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
  const [authChecked, setAuthChecked] = useState(false); // Track if initial auth check is done
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // --- UPDATED LOGOUT FUNCTION ---
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (res.ok) {
        setIsLoggedIn(false);
      } else {
        console.error("Logout failed:", await res.text());
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  // --- USE EFFECT FOR AUTH CHECK & DATA FETCHING ---
  useEffect(() => {
    // Function to check the user's authentication status
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true); // Mark auth check as complete
      }
    };

    checkAuthStatus();

    // Fetch categories (can run in parallel with auth check)
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      });
  }, []);

  // Don't render the main content until the initial auth check is complete
  if (!authChecked) {
    return <div>Loading...</div>; // Or a spinner component
  }

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
            setShowRegister(false);
            setShowLogin(true);
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
