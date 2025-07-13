/**
 * Utility functions for handling avatars and images
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Converts an avatar path to a full URL
 * @param avatarPath - The avatar path from the backend (e.g., "/uploads/avatars/abc123.jpg")
 * @returns Full URL to the avatar or default avatar if no path provided
 */
export const getAvatarUrl = (avatarPath?: string | null): string => {
  if (!avatarPath || avatarPath.trim() === '') {
    return `${BACKEND_URL}/uploads/avatars/default_avatar.svg`;
  }
  
  // If the path already includes the domain, return as-is
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  
  // Remove leading dot if present (e.g., "./uploads/avatars/abc123.jpg" -> "/uploads/avatars/abc123.jpg")
  const cleanPath = avatarPath.replace(/^\./, '');
  
  return `${BACKEND_URL}${cleanPath}`;
};

/**
 * Converts a post image path to a full URL
 * @param imagePath - The image path from the backend
 * @returns Full URL to the image
 */
export const getImageUrl = (imagePath?: string | null): string => {
  if (!imagePath || imagePath.trim() === '') {
    return '';
  }
  
  // If the path already includes the domain, return as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Remove leading dot if present
  const cleanPath = imagePath.replace(/^\./, '');
  
  return `${BACKEND_URL}${cleanPath}`;
};

/**
 * Get user initials from a name or nickname
 * @param name - User's name or nickname
 * @returns First letter capitalized
 */
export const getUserInitials = (name?: string): string => {
  if (!name || name.trim() === '') {
    return '?';
  }
  return name.charAt(0).toUpperCase();
};
