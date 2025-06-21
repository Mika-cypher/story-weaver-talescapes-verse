
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { ExtendedUser } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';
import { useProfileManagement } from './useProfileManagement';
import { useUserPreferences } from './useUserPreferences';

export const useAuthState = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const { toast } = useToast();
  
  // Use our refactored hooks
  const { 
    profile, 
    isAdmin, 
    isLoading, 
    error, 
    fetchProfile 
  } = useProfileManagement();
  
  const {
    savedStories,
    setSavedStories,
    likedContent,
    setLikedContent,
    following,
    setFollowing,
    loadUserPreferences
  } = useUserPreferences(user?.id);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change event:", event, "Session:", currentSession?.user?.email);
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
              console.log("Fetching profile for user:", currentSession.user.id);
              fetchProfile(currentSession.user.id, loadUserPreferences);
            }, 0);
          } catch (error: any) {
            console.error('Auth state change error:', error);
            toast({
              title: "Authentication Error",
              description: `Error during authentication: ${error.message}`,
              variant: "destructive",
            });
          }
        } else {
          console.log("No user in session, clearing state");
          setUser(null);
        }
        
        if (!authInitialized) {
          setAuthInitialized(true);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state");
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(sessionError.message);
        }
        
        console.log("Current session:", currentSession?.user?.email);
        setSession(currentSession);
        
        if (currentSession?.user) {
          const userWithUsername: ExtendedUser = currentSession.user;
          
          if (currentSession.user.user_metadata?.username) {
            userWithUsername.username = currentSession.user.user_metadata.username;
          }
          
          setUser(userWithUsername);
          await fetchProfile(currentSession.user.id, loadUserPreferences);
        }
        
        setAuthInitialized(true);
      } catch (error: any) {
        console.error('Session initialization error:', error);
        toast({
          title: "Authentication Error",
          description: "There was a problem with your authentication session",
          variant: "destructive",
        });
        setAuthInitialized(true);
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
    isLoading: isLoading || !authInitialized,
    error
  };
};
