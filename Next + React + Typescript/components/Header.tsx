"use client";

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

const Header = ({ onLogout, isLoggedIn, currentPage, onNavigate }: Props) => (
  <header className="header">
    <nav className="header-nav">
      {isLoggedIn ? (
        <>
          <button
            className={`nav-button ${currentPage === "posts" ? "active" : ""}`}
            onClick={() => onNavigate("posts")}
          >
            Posts
          </button>
          <button
            className={`nav-button ${currentPage === "groups" ? "active" : ""}`}
            onClick={() => onNavigate("groups")}
          >
            Groups
          </button>
          <button
            className={`nav-button ${currentPage === "users" ? "active" : ""}`}
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
          <button className="nav-button logout" onClick={onLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            className={`nav-button ${currentPage === "login" ? "active" : ""}`}
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

export default Header;
