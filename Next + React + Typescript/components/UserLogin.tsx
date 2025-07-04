"use client";
import { useState } from "react";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

const Login: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [login, setLogin] = useState(""); // can be email or nickname
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new URLSearchParams();
    form.append("login", login.trim());
    form.append("password", password);

    const res = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    setLoading(false);

    if (res.ok) {
      onSuccess?.();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-wrapper">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        required
        maxLength={80}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        maxLength={128}
      />
      <div className="button-group">
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
      </div>
      {error && (
        <div className="form-error" style={{ color: "red", marginTop: "1rem" }}>
          {error}
        </div>
      )}
    </form>
  );
};

export default Login;
