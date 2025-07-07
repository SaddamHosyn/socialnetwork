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
import Groups from "../components/Groups";
import { GroupCreate } from "../components/GroupCreate";
import type { Category } from "../types/types";

type MainView = "forum" | "groups";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentView, setCurrentView] = useState<MainView>("forum");
  const [showCreateGroup, setShowCreateGroup] = useState(false);

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
      } catch {
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

  const renderMainContent = () => {
    if (currentView === "groups") {
      return <Groups />;
    }

    // Default forum view
    return (
      <>
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
      </>
    );
  };

  return (
    <>
      <Header
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
        onProfile={() => setShowProfile(true)}
        onCreateGroup={() => setShowCreateGroup(true)}
      />

      {/* Navigation tabs */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem 2rem",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <button
          onClick={() => setCurrentView("forum")}
          style={{
            background: currentView === "forum" ? "#007bff" : "transparent",
            color: currentView === "forum" ? "white" : "#495057",
            border: "1px solid #007bff",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: currentView === "forum" ? "bold" : "normal",
          }}
        >
          Forum
        </button>

        <button
          onClick={() => setCurrentView("groups")}
          style={{
            background: currentView === "groups" ? "#007bff" : "transparent",
            color: currentView === "groups" ? "white" : "#495057",
            border: "1px solid #007bff",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: currentView === "groups" ? "bold" : "normal",
          }}
        >
          Groups
        </button>
      </div>

      <main
        style={{
          display: "flex",
          minHeight: "calc(100vh - 120px)", // Adjust based on header + nav height
        }}
      >
        {renderMainContent()}
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
      <Modal
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        containerId="create-group-container"
      >
        <GroupCreate
          onSuccess={() => setShowCreateGroup(false)}
          onCancel={() => setShowCreateGroup(false)}
        />
      </Modal>
    </>
  );
}
