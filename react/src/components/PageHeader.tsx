// Header.tsx
import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => (
  <header
    style={{
      background: "#fff",
      borderBottom: "1px solid #eee",
      padding: "10px 20px",
    }}
  >
    <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      {/* Add Login/Logout links here */}
      {/* Add more links as needed */}
    </nav>
  </header>
);

export default Header;
