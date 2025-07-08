("use client");
import UserLogin from "../UserLogin";

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const LoginPage = ({ onSuccess, onCancel }: Props) => (
  <div className="auth-page">
    <div className="auth-container">
      <div className="auth-header">
        <h1>Login to Your Account</h1>
        <p>Welcome back! Please enter your credentials.</p>
      </div>
      <UserLogin onSuccess={onSuccess} onCancel={onCancel} />
      <div className="auth-footer">
        <p>
          Don't have an account?{" "}
          <button onClick={onCancel} className="link-button">
            Go back
          </button>{" "}
          and click Sign Up
        </p>
      </div>
    </div>
  </div>
);

export default LoginPage;
