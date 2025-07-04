"use client";
import { useState } from "react";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

const genders = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
  { value: "0", label: "Alien" },
];

/**
 * CORRECTED UserRegister Component.
 * This component is now ONLY the form's content. It no longer creates its own
 * popup container, preventing conflicts with the generic Modal component.
 * The root element is the <form> itself.
 */
const UserRegister: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("1");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [nickname, setNickname] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData();
    form.append("email", email.trim());
    form.append("password", password);
    form.append("first_name", firstName.trim());
    form.append("last_name", lastName.trim());
    form.append("date_of_birth", dateOfBirth);
    form.append("gender", gender);
    if (avatar) form.append("avatar", avatar);
    if (nickname.trim()) form.append("nickname", nickname.trim());
    if (aboutMe.trim()) form.append("about_me", aboutMe.trim());

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        credentials: "include",
        body: form,
      });

      if (res.ok) {
        onSuccess?.();
      } else {
        // Try to parse error message from server, with a fallback.
        const data = await res
          .json()
          .catch(() => ({ error: "An unknown error occurred." }));
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // The root element is now the form.
  // The CSS class "form-wrapper" is used for internal padding and layout,
  // which is correct. The popup container itself is handled by the Modal.
  return (
    <form onSubmit={handleSubmit} className="form-wrapper">
      <h2>Register</h2>
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
        max="2100-01-01" // It's good practice to set a reasonable max date
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
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        onChange={(e) => setAvatar(e.target.files?.[0] || null)}
      />
      <input
        type="text"
        placeholder="Nickname (optional)"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        maxLength={40}
      />
      <textarea
        placeholder="About Me (optional)"
        value={aboutMe}
        onChange={(e) => setAboutMe(e.target.value)}
        maxLength={500} // Increased from 40 to a more reasonable length
        rows={4}
      />

      <div className="button-group">
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
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

export default UserRegister;
