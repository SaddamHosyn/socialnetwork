import React from "react";
import { Link } from "react-router-dom";

type Props = {
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
};

const Header: React.FC<Props> = ({
  onLogin,
  onRegister,
  onLogout,
  isLoggedIn,
}) => (
  <header
    style={{
      background: "#fff",
      borderBottom: "1px solid #eee",
      padding: "10px 20px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}
  >
    <nav style={{ display: "flex", alignItems: "center" }}>
      {/* Logo (left) */}
      <Link
        to="/"
        style={{
          fontWeight: "bold",
          fontSize: 24,
          color: "#3b3b3b",
          textDecoration: "none",
        }}
      >
        SocialNet
      </Link>
      {/* Navigation (middle, add more if needed) */}
      <div style={{ flex: 1 }} />
      {/* Auth buttons (right) */}
      {!isLoggedIn ? (
        <>
          <button onClick={onLogin}>Login</button>
          <button onClick={onRegister}>Register</button>
        </>
      ) : (
        <>
          <Link to="/profile">Profile</Link>
          <button onClick={onLogout}>Logout</button>
        </>
      )}
    </nav>
  </header>
);

export default Header;
