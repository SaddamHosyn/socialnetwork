"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import HomePage from "../components/pages/HomePage";
import PostsPage from "../components/pages/PostsPage";
import ProfilePage from "../components/pages/ProfilePage";
import LoginPage from "../components/pages/LoginPage";
import RegisterPage from "../components/pages/RegisterPage";
import GroupsPage from "../components/pages/GroupsPage";
import UsersPage from "../components/pages/UsersPage";
import PrivateChat from "../components/PrivateChat";
import NotificationBanner from "../components/NotificationBanner";

type PageType =
  | "home"
  | "posts"
  | "profile"
  | "login"
  | "register"
  | "groups"
  | "users"
  | "chat";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>("home");

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setIsLoggedIn(false);
        setCurrentPage("home");
        localStorage.removeItem("currentPage");
      } else {
        console.error("Logout failed:", await res.text());
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const savedPage = localStorage.getItem("currentPage") as PageType;
    // If user was trying to access a protected page before login, go there
    if (savedPage && ["posts", "profile", "groups", "users", "chat"].includes(savedPage)) {
      setCurrentPage(savedPage);
    } else {
      setCurrentPage("posts");
    }
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("login");
  };

  const handleNavigate = (page: PageType) => {
    // Check if trying to access protected page while not logged in
    if (!isLoggedIn && ["posts", "profile", "groups", "users", "chat"].includes(page)) {
      // Save the intended page to localStorage
      localStorage.setItem("currentPage", page);
      setCurrentPage("login");
      return;
    }
    
    setCurrentPage(page);
    // Save current page to localStorage for persistence across refreshes
    localStorage.setItem("currentPage", page);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          setIsLoggedIn(true);
          
          // Restore the previous page from localStorage if user is logged in
          const savedPage = localStorage.getItem("currentPage") as PageType;
          if (savedPage && ["posts", "profile", "groups", "users", "chat"].includes(savedPage)) {
            setCurrentPage(savedPage);
          } else if (savedPage === "home" || savedPage === "login" || savedPage === "register") {
            setCurrentPage(savedPage);
          }
          // If no saved page or invalid page, stay on home
        } else {
          setIsLoggedIn(false);
          // If not logged in, check if current page is protected
          const savedPage = localStorage.getItem("currentPage") as PageType;
          if (savedPage && !["home", "login", "register"].includes(savedPage)) {
            // User was on a protected page but is not logged in
            setCurrentPage("home");
          }
        }
      } catch {
        setIsLoggedIn(false);
        setCurrentPage("home");
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuthStatus();
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
        return <PostsPage />;
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
      case "users":
        return <UsersPage />;
      case "chat":
        return <PrivateChat />;
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
      {isLoggedIn && (
        <NotificationBanner 
          onRequestsClick={() => setCurrentPage("profile")}
        />
      )}
      <main className="main-content">{renderCurrentPage()}</main>
    </>
  );
}
