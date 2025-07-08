// app/page.tsx - Main page with navigation
"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import HomePage from "../components/pages/HomePage";
import PostsPage from "../components/pages/PostsPage";
import ProfilePage from "../components/pages/ProfilePage";
import LoginPage from "../components/pages/LoginPage";
import RegisterPage from "../components/pages/RegisterPage";
import GroupsPage from "../components/pages/GroupsPage";
import type { Category } from "../types/types";

type PageType = "home" | "posts" | "profile" | "login" | "register" | "groups";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>("home");

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (res.ok) {
        setIsLoggedIn(false);
        setCurrentPage("home"); // Redirect to home after logout
      } else {
        console.error("Logout failed:", await res.text());
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("posts"); // Redirect to posts after login
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("login"); // Redirect to login after successful registration
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          setIsLoggedIn(true);
          // If user is already logged in, show posts page instead of home
          if (currentPage === "home") {
            setCurrentPage("posts");
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuthStatus();

    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      });
  }, []);

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onLogin={() => setCurrentPage("login")}
            onRegister={() => setCurrentPage("register")}
          />
        );
      case "posts":
        return (
          <PostsPage
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
          />
        );
      case "profile":
        return <ProfilePage />;
      case "login":
        return (
          <LoginPage
            onSuccess={handleLoginSuccess}
            onCancel={() => setCurrentPage("home")}
          />
        );
      case "register":
        return (
          <RegisterPage
            onSuccess={handleRegisterSuccess}
            onCancel={() => setCurrentPage("home")}
          />
        );
      case "groups":
        return <GroupsPage />;
      default:
        return (
          <HomePage
            onLogin={() => setCurrentPage("login")}
            onRegister={() => setCurrentPage("register")}
          />
        );
    }
  };

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <main className="main-content">{renderCurrentPage()}</main>
    </>
  );
}
