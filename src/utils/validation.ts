
/**
 * Utility functions for input validation
 */

/**
 * Validates an email address format
 */
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === '') return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
  return null;
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

/**
 * Validates username format and length
 */
export const validateUsername = (username: string): string | null => {
  if (!username || username.trim() === '') return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
  return null;
};
