type Props = {
  onLogout: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onProfile: () => void;
};

const Header = ({
  onLogout,
  isLoggedIn,
  onLogin,
  onRegister,
  onProfile,
}: Props) => (
  <header>
    <div className="header-left">
      <h1>Gritlab Gossiper</h1>
    </div>
    <div className="header-right">
      {!isLoggedIn ? (
        <>
          <button onClick={onLogin}>Login</button>
          <button onClick={onRegister}>Register</button>
        </>
      ) : (
        <>
          <button onClick={onProfile}>Profile</button>
          <button onClick={onLogout}>Logout</button>
        </>
      )}
    </div>
  </header>
);

export default Header;
