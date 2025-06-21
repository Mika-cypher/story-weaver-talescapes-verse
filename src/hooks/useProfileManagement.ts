
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

export const useProfileManagement = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = async (userId: string, loadPreferences?: (userId: string) => void) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching profile for user:", userId);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError(`Failed to fetch profile: ${error.message}`);
        
        // Only show toast for unexpected errors, not missing profiles
        if (error.code !== 'PGRST116') {
          toast({
            title: "Profile Error",
            description: `Could not load your profile data: ${error.message}`,
            variant: "destructive",
          });
        }
        return;
      }
      
      if (!data) {
        console.error('No profile data found for user:', userId);
        setError('No profile data found');
        return;
      }
      
      // Validate and sanitize profile data
      const profileWithRole: Profile = {
        id: data.id || userId,
        username: data.username || 'user',
        display_name: data.display_name || null,
        avatar_url: data.avatar_url || null,
        bio: data.bio || '',
        // Cast the role string to UserRole type or default to "user"
        role: (((data as any).role as string) || "user") as UserRole
      };
      
      console.log("Profile fetched successfully:", profileWithRole);
      console.log("User role:", profileWithRole.role);
      
      setProfile(profileWithRole);
      const adminStatus = profileWithRole.role === "admin";
      setIsAdmin(adminStatus);
      console.log("Admin status set to:", adminStatus);

      // Load user preferences from localStorage if callback provided
      if (userId && loadPreferences) {
        loadPreferences(userId);
      }
      
    } catch (error: any) {
      console.error('Error in profile fetching process:', error);
      setError(`Profile error: ${error.message}`);
      toast({
        title: "Error",
        description: "Failed to load user profile information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isAdmin,
    isLoading,
    error,
    fetchProfile,
    setProfile
  };
};
