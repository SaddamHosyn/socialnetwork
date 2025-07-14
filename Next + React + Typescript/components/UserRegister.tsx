"use client";
import { useState } from "react";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

const genders = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
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
  const [isPrivate, setIsPrivate] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate that privacy choice is made
    if (isPrivate === null) {
      setError("Please select your account privacy preference.");
      setLoading(false);
      return;
    }

    // Validate nickname if provided
    if (nickname.trim()) {
      if (nickname.trim().length < 3 || nickname.trim().length > 20) {
        setError("Nickname must be 3-20 characters if provided.");
        setLoading(false);
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(nickname.trim())) {
        setError("Nickname can only contain letters, numbers, and underscores.");
        setLoading(false);
        return;
      }
    }

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
    // Always append privacy setting since it's now required
    form.append("privacy", isPrivate ? "private" : "public");

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
    } catch {
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
        placeholder="Nickname (optional - 3-20 chars, letters/numbers/_)"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        maxLength={20}
      />
      <textarea
        placeholder="About Me (optional)"
        value={aboutMe}
        onChange={(e) => setAboutMe(e.target.value)}
        maxLength={500} // Increased from 40 to a more reasonable length
        rows={4}
      />

      <div className="privacy-section">
        <h4>
          Account Privacy <span style={{ color: "#dc3545" }}>*</span>
        </h4>
        
        <div className="privacy-options">
          {/* Public Account Option */}
          <div 
            className={`privacy-option ${isPrivate === false ? 'selected' : ''}`}
            onClick={() => setIsPrivate(false)}
          >
            <input
              type="radio"
              id="public-account"
              name="privacy"
              checked={isPrivate === false}
              onChange={() => setIsPrivate(false)}
            />
            <div className="privacy-option-content">
              <label htmlFor="public-account">
                🌍 Public Account
              </label>
              <p>
                Anyone can follow you and see your posts immediately.
              </p>
            </div>
          </div>

          {/* Private Account Option */}
          <div 
            className={`privacy-option ${isPrivate === true ? 'selected' : ''}`}
            onClick={() => setIsPrivate(true)}
          >
            <input
              type="radio"
              id="private-account"
              name="privacy"
              checked={isPrivate === true}
              onChange={() => setIsPrivate(true)}
            />
            <div className="privacy-option-content">
              <label htmlFor="private-account">
                🔒 Private Account
              </label>
              <p>
                Others must send follow requests to see your posts and profile.
              </p>
            </div>
          </div>
        </div>
      </div>

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
        <div className="form-error">
          {error}
        </div>
      )}
    </form>
  );
};

export default UserRegister;
