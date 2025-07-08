"use client";

type PageType = "home" | "posts" | "profile" | "login" | "register" | "groups";

type Props = {
  onLogout: () => void;
  isLoggedIn: boolean;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
};

const Header = ({ onLogout, isLoggedIn, currentPage, onNavigate }: Props) => (
  <header className="header">
    <div className="header-left">
      <h1 onClick={() => onNavigate("home")} className="logo">
        Gritlab Gossiper
      </h1>
    </div>
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
