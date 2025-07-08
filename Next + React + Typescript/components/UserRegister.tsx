"use client";
import { useState } from "react";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

const genders = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
  { value: "3", label: "Alien" },
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

      <div style={{ 
        margin: "1.5rem 0", 
        padding: "1rem", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "8px", 
        border: "1px solid #e9ecef" 
      }}>
        <h4 style={{ 
          margin: "0 0 1rem 0", 
          fontSize: "1rem", 
          fontWeight: "600",
          color: "#333" 
        }}>
          Account Privacy <span style={{ color: "#dc3545" }}>*</span>
        </h4>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Public Account Option */}
          <div style={{ 
            display: "flex", 
            alignItems: "flex-start", 
            gap: "0.75rem",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "2px solid",
            borderColor: isPrivate === false ? "#007bff" : "#e9ecef",
            backgroundColor: isPrivate === false ? "#f0f7ff" : "white",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onClick={() => setIsPrivate(false)}>
            <input
              type="radio"
              id="public-account"
              name="privacy"
              checked={isPrivate === false}
              onChange={() => setIsPrivate(false)}
              style={{ 
                marginTop: "0.2rem",
                width: "16px",
                height: "16px",
                accentColor: "#007bff",
                cursor: "pointer"
              }}
            />
            <div style={{ flex: 1 }}>
              <label 
                htmlFor="public-account" 
                style={{ 
                  fontSize: "0.95rem", 
                  fontWeight: "500",
                  cursor: "pointer",
                  color: "#333",
                  display: "block",
                  marginBottom: "0.25rem"
                }}
              >
                🌍 Public Account
              </label>
              <p style={{ 
                fontSize: "0.85rem", 
                color: "#666", 
                margin: 0,
                lineHeight: "1.4"
              }}>
                Anyone can follow you and see your posts immediately.
              </p>
            </div>
          </div>

          {/* Private Account Option */}
          <div style={{ 
            display: "flex", 
            alignItems: "flex-start", 
            gap: "0.75rem",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "2px solid",
            borderColor: isPrivate === true ? "#007bff" : "#e9ecef",
            backgroundColor: isPrivate === true ? "#f0f7ff" : "white",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onClick={() => setIsPrivate(true)}>
            <input
              type="radio"
              id="private-account"
              name="privacy"
              checked={isPrivate === true}
              onChange={() => setIsPrivate(true)}
              style={{ 
                marginTop: "0.2rem",
                width: "16px",
                height: "16px",
                accentColor: "#007bff",
                cursor: "pointer"
              }}
            />
            <div style={{ flex: 1 }}>
              <label 
                htmlFor="private-account" 
                style={{ 
                  fontSize: "0.95rem", 
                  fontWeight: "500",
                  cursor: "pointer",
                  color: "#333",
                  display: "block",
                  marginBottom: "0.25rem"
                }}
              >
                🔒 Private Account
              </label>
              <p style={{ 
                fontSize: "0.85rem", 
                color: "#666", 
                margin: 0,
                lineHeight: "1.4"
              }}>
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
        <div className="form-error" style={{ color: "red", marginTop: "1rem" }}>
          {error}
        </div>
      )}
    </form>
  );
};

export default UserRegister;
