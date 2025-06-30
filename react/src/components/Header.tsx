import React from "react";
import { Link } from "react-router-dom";

type Props = {
  onLogout: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onProfile: () => void;
};

const Header: React.FC<Props> = ({
  onLogout,
  isLoggedIn,
  onLogin,
  onRegister,
  onProfile,
}) => (
  <header /* ...styles... */>
    <nav /* ...styles... */>
      <Link to="/" /* ...logo styles... */>Gritlab Gossiper</Link>
      <div style={{ flex: 1 }} />
      {!isLoggedIn ? (
        <>
          <button onClick={onLogin} style={{ marginRight: 10 }}>
            Login
          </button>
          <button onClick={onRegister}>Register</button>
        </>
      ) : (
        <>
          <button onClick={onProfile} style={{ marginRight: 10 }}>
            Profile
          </button>
          <button onClick={onLogout}>Logout</button>
        </>
      )}
    </nav>
  </header>
);

export default Header;
