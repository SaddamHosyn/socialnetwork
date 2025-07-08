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
  const [currentPage, setCurrentPage] = useState<PageType>("home"); // Always start with home

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setIsLoggedIn(false);
        setCurrentPage("home");
      } else {
        console.error("Logout failed:", await res.text());
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("posts");
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("login");
  };

  const handleNavigate = (page: PageType) => {
    // Prevent navigation to protected pages if not logged in
    if (!isLoggedIn && ["posts", "profile", "groups"].includes(page)) {
      setCurrentPage("login");
      return;
    }
    setCurrentPage(page);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          setIsLoggedIn(true);
          // Don't automatically redirect to posts - let user choose
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
    fetch("/api/categories", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

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
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Header
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <main className="main-content">{renderCurrentPage()}</main>
    </>
  );
}
