
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService, AuthError } from "@/services/authService";
import { ExtendedUser, Profile } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

export const useAuthOperations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      console.log("Checking admin status for user:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        return false;
      }
      
      console.log("User profile role:", profile?.role);
      return profile?.role === 'admin';
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await authService.login(email, password);
      
      // Check if user is admin and redirect accordingly
      if (data?.user) {
        const isAdmin = await checkAdminStatus(data.user.id);
        console.log("User is admin:", isAdmin);
        
        if (isAdmin) {
          toast({
            title: "Welcome back, Admin!",
            description: "Redirecting to admin dashboard.",
          });
          navigate("/admin/dashboard");
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in.",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      if (error instanceof AuthError) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const { data } = await authService.signup(username, email, password);
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
      
      // For admin email, redirect to admin login after signup
      if (email === 'talescapesverse@gmail.com') {
        console.log("Admin email detected, redirecting to admin login");
        navigate("/admin/login");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      if (error instanceof AuthError) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signup error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: error instanceof AuthError ? error.message : "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (user: ExtendedUser | null, updates: Partial<Profile>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    try {
      await authService.updateProfile(user.id, updates);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error instanceof AuthError ? error.message : "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    login,
    signup,
    logout,
    updateProfile
  };
};
