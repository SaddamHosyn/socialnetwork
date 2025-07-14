"use client";
import React, { useState, useEffect } from "react";
import Notificationbell from "./Notificationbell";
import { useNotifications } from "../hooks/useNotifications";

type PageType =
  | "home"
  | "posts"
  | "profile"
  | "login"
  | "register"
  | "groups"
  | "users"
  | "chat"
  | "user-profile";

type Props = {
  onLogout: () => void;
  isLoggedIn: boolean;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
};

const Header = ({ onLogout, isLoggedIn, currentPage, onNavigate }: Props) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, markAsRead, handleNotificationAction } =
    useNotifications();

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleNotificationClose = () => {
    setIsNotificationOpen(false);
  };

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isNotificationOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".notification-bell")) {
          setIsNotificationOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  return (
    <header className="header">
      <nav className="header-nav">
        {isLoggedIn ? (
          <>
            <button
              className={`nav-button ${
                currentPage === "posts" ? "active" : ""
              }`}
              onClick={() => onNavigate("posts")}
            >
              Posts
            </button>
            <button
              className={`nav-button ${
                currentPage === "groups" ? "active" : ""
              }`}
              onClick={() => onNavigate("groups")}
            >
              Groups
            </button>
            <button
              className={`nav-button ${
                currentPage === "users" ? "active" : ""
              }`}
              onClick={() => onNavigate("users")}
            >
              Users
            </button>
            <button
              className={`nav-button ${currentPage === "chat" ? "active" : ""}`}
              onClick={() => onNavigate("chat")}
            >
              Chat
            </button>
            <button
              className={`nav-button ${
                currentPage === "profile" ? "active" : ""
              }`}
              onClick={() => onNavigate("profile")}
            >
              Profile
            </button>
            <Notificationbell
              notifications={notifications}
              onClick={handleNotificationClick}
              isOpen={isNotificationOpen}
              onClose={handleNotificationClose}
              onMarkAsRead={markAsRead}
              onActionTaken={handleNotificationAction}
            />
            <button className="nav-button logout" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className={`nav-button ${
                currentPage === "login" ? "active" : ""
              }`}
              onClick={() => onNavigate("login")}
            >
              Login
            </button>
            <button
              className={`nav-button ${
                currentPage === "register" ? "active" : ""
              }`}
              onClick={() => onNavigate("register")}
            >
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
