import React, { useState } from "react";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

const genders = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
  { value: "0", label: "Other" },
];

const Register: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new URLSearchParams();
    form.append("nickname", nickname.trim());
    form.append("email", email.trim());
    form.append("password", password);
    form.append("first_name", firstName.trim());
    form.append("last_name", lastName.trim());
    form.append("date_of_birth", dateOfBirth);
    form.append("gender", gender);

    const res = await fetch("/api/register", {
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
      setError(data.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 350 }}>
      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
        maxLength={40}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        maxLength={40}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        maxLength={40}
      />
      <input
        type="date"
        placeholder="Date of Birth"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        required
        max="2100-01-01"
      />
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required
      >
        {genders.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      )}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default Register;
