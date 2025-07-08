"use client";
import UserRegister from "../UserRegister";

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const RegisterPage = ({ onSuccess, onCancel }: Props) => (
  <div className="auth-page">
    <div className="auth-container">
      <div className="auth-header">
        <h1>Create Your Account</h1>
        <p>Join our community and start sharing!</p>
      </div>
      <UserRegister onSuccess={onSuccess} onCancel={onCancel} />
      <div className="auth-footer">
        <p>
          Already have an account?{" "}
          <button onClick={onCancel} className="link-button">
            Go back
          </button>{" "}
          and click Login
        </p>
      </div>
    </div>
  </div>
);

export default RegisterPage;
