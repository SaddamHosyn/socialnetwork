"use client";
import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';

interface PrivacySettingsProps {
  currentPrivacy: boolean; // true = private, false = public
  onPrivacyChange?: (isPrivate: boolean) => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  currentPrivacy,
  onPrivacyChange
}) => {
  const [isPrivate, setIsPrivate] = useState(currentPrivacy);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handlePrivacyChange = async (newPrivacy: boolean) => {
    setLoading(true);
    
    try {
      const formData = new URLSearchParams();
      formData.append("privacy", newPrivacy ? "private" : "public");

      const response = await fetch("/api/user/privacy", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIsPrivate(newPrivacy);
        onPrivacyChange?.(newPrivacy);
        addToast(data.message, 'success');
      } else {
        addToast(data.error || "Failed to update privacy setting", 'error');
      }
    } catch (error) {
      console.error("Error updating privacy:", error);
      addToast("Failed to update privacy setting", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      margin: "1.5rem 0", 
      padding: "1.5rem", 
      backgroundColor: "#f8f9fa", 
      borderRadius: "12px", 
      border: "1px solid #e9ecef" 
    }}>
      <h3 style={{ 
        margin: "0 0 1rem 0", 
        fontSize: "1.1rem", 
        fontWeight: "600",
        color: "#333",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        ⚙️ Privacy Settings
      </h3>
      
      <p style={{ 
        fontSize: "0.9rem", 
        color: "#666", 
        margin: "0 0 1.5rem 0",
        lineHeight: "1.5"
      }}>
        Control who can follow you and see your posts.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Public Account Option */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "flex-start", 
            gap: "0.75rem",
            padding: "1rem",
            borderRadius: "8px",
            border: "2px solid",
            borderColor: !isPrivate ? "#28a745" : "#dee2e6",
            backgroundColor: !isPrivate ? "#f8fff9" : "white",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s ease"
          }}
          onClick={() => !loading && handlePrivacyChange(false)}
        >
          <input
            type="radio"
            id="public-privacy"
            name="privacy-setting"
            checked={!isPrivate}
            onChange={() => !loading && handlePrivacyChange(false)}
            disabled={loading}
            style={{ 
              marginTop: "0.2rem",
              width: "18px",
              height: "18px",
              accentColor: "#28a745",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          />
          <div style={{ flex: 1 }}>
            <label 
              htmlFor="public-privacy" 
              style={{ 
                fontSize: "1rem", 
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                color: "#333",
                display: "block",
                marginBottom: "0.5rem"
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
              Anyone can follow you and see your posts immediately without approval.
            </p>
          </div>
        </div>

        {/* Private Account Option */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "flex-start", 
            gap: "0.75rem",
            padding: "1rem",
            borderRadius: "8px",
            border: "2px solid",
            borderColor: isPrivate ? "#dc3545" : "#dee2e6",
            backgroundColor: isPrivate ? "#fff8f8" : "white",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s ease"
          }}
          onClick={() => !loading && handlePrivacyChange(true)}
        >
          <input
            type="radio"
            id="private-privacy"
            name="privacy-setting"
            checked={isPrivate}
            onChange={() => !loading && handlePrivacyChange(true)}
            disabled={loading}
            style={{ 
              marginTop: "0.2rem",
              width: "18px",
              height: "18px",
              accentColor: "#dc3545",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          />
          <div style={{ flex: 1 }}>
            <label 
              htmlFor="private-privacy" 
              style={{ 
                fontSize: "1rem", 
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                color: "#333",
                display: "block",
                marginBottom: "0.5rem"
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
              Others must send follow requests to see your posts and profile information.
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ 
          marginTop: "1rem", 
          textAlign: "center", 
          fontSize: "0.9rem", 
          color: "#666" 
        }}>
          Updating privacy settings...
        </div>
      )}
    </div>
  );
};

export default PrivacySettings;
