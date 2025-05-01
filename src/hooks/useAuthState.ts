
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Profile, ExtendedUser } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

export const useAuthState = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [savedStories, setSavedStories] = useState<string[]>([]);
  const [likedContent, setLikedContent] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError(`Failed to fetch profile: ${error.message}`);
        toast({
          title: "Profile Error",
          description: `Could not load your profile data: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      if (!data) {
        console.error('No profile data found');
        setError('No profile data found');
        toast({
          title: "Profile Missing",
          description: "Your profile data could not be found",
          variant: "destructive",
        });
        return;
      }
      
      // Validate and sanitize profile data
      const profileWithRole: Profile = {
        id: data.id || userId,
        username: data.username || 'user',
        display_name: data.display_name || null,
        avatar_url: data.avatar_url || null,
        bio: data.bio || '',
        role: ((data as any).role as string) || "user"
      };
      
      setProfile(profileWithRole);
      setIsAdmin(profileWithRole.role === "admin");

      // Load user preferences from localStorage
      if (userId) {
        loadUserPreferences(userId);
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

  const loadUserPreferences = (userId: string) => {
    try {
      // Load saved stories
      const savedStoriesData = localStorage.getItem(`talescapes_saved_stories_${userId}`);
      if (savedStoriesData) {
        setSavedStories(JSON.parse(savedStoriesData));
      }
      
      // Load liked content
      const likedContentData = localStorage.getItem(`talescapes_liked_content_${userId}`);
      if (likedContentData) {
        setLikedContent(JSON.parse(likedContentData));
      }
      
      // Load following data
      const followingData = localStorage.getItem(`talescapes_following_${userId}`);
      if (followingData) {
        setFollowing(JSON.parse(followingData));
      }
    } catch (error: any) {
      console.error('Error loading user preferences:', error);
      toast({
        title: "Warning",
        description: "Some of your preferences couldn't be loaded",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            const userWithUsername: ExtendedUser = currentSession.user;
            
            if (currentSession.user.user_metadata?.username) {
              userWithUsername.username = currentSession.user.user_metadata.username;
            }
            
            setUser(userWithUsername);
            
            // Use setTimeout to avoid Supabase auth deadlock issues
            setTimeout(() => {
              fetchProfile(currentSession.user.id);
            }, 0);
          } catch (error: any) {
            console.error('Auth state change error:', error);
            setError(`Auth error: ${error.message}`);
          }
        } else {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(sessionError.message);
        }
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          const userWithUsername: ExtendedUser = currentSession.user;
          
          if (currentSession.user.user_metadata?.username) {
            userWithUsername.username = currentSession.user.user_metadata.username;
          }
          
          setUser(userWithUsername);
          await fetchProfile(currentSession.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error('Session initialization error:', error);
        setError(`Session error: ${error.message}`);
        setIsLoading(false);
        toast({
          title: "Authentication Error",
          description: "There was a problem with your authentication session",
          variant: "destructive",
        });
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    profile,
    isAdmin,
    savedStories,
    setSavedStories,
    likedContent,
    setLikedContent,
    following,
    setFollowing,
    isLoading,
    error
  };
};
