
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { validateEmail, validatePassword, validateUsername } from '@/utils/validation';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  /**
   * Log in a user with email and password
   */
  login: async (email: string, password: string) => {
    // Validate inputs
    const emailError = validateEmail(email);
    if (emailError) {
      throw new AuthError(emailError);
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      throw new AuthError(passwordError);
    }

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      let errorMessage = error.message;
      
      // Provide user-friendly error messages
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email or password is incorrect. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email before logging in.";
      }
      
      throw new AuthError(errorMessage);
    }
    
    return data;
  },

  /**
   * Register a new user
   */
  signup: async (username: string, email: string, password: string) => {
    // Validate inputs
    const usernameError = validateUsername(username);
    if (usernameError) {
      throw new AuthError(usernameError);
    }

    const emailError = validateEmail(email);
    if (emailError) {
      throw new AuthError(emailError);
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      throw new AuthError(passwordError);
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    
    if (error) {
      let errorMessage = error.message;
      
      // Provide user-friendly error messages
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Try logging in instead.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Too many attempts. Please try again later.";
      }
      
      throw new AuthError(errorMessage);
    }
    
    return data;
  },

  /**
   * Log out the current user
   */
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new AuthError(`Failed to log out: ${error.message}`);
    }
  },

  /**
   * Update user profile data
   */
  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    if (!userId) {
      throw new AuthError("Authentication required to update profile");
    }

    // Validate profile updates
    if (updates.username && validateUsername(updates.username)) {
      throw new AuthError(validateUsername(updates.username) || "Invalid username");
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      throw new AuthError(`Failed to update profile: ${error.message}`);
    }
  },
  
  /**
   * Admin authentication method (mock)
   */
  adminLogin: (password: string): boolean => {
    if (!password) {
      throw new AuthError("Password is required");
    }
    
    if (password === "admin123") {
      return true;
    }
    
    throw new AuthError("Invalid admin password");
  }
};
