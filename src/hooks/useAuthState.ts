
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Profile, ExtendedUser } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [savedStories, setSavedStories] = useState<string[]>([]);
  const [likedContent, setLikedContent] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      const profileWithRole: Profile = {
        id: data.id,
        username: data.username,
        display_name: data.display_name,
        avatar_url: data.avatar_url,
        bio: data.bio,
        role: (data as any).role || "user"
      };
      
      setProfile(profileWithRole);
      setIsAdmin(profileWithRole.role === "admin");
      
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          const userWithUsername: ExtendedUser = currentSession.user;
          
          if (currentSession.user.user_metadata?.username) {
            userWithUsername.username = currentSession.user.user_metadata.username;
          }
          
          setUser(userWithUsername);
          
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        const userWithUsername: ExtendedUser = currentSession.user;
        
        if (currentSession.user.user_metadata?.username) {
          userWithUsername.username = currentSession.user.user_metadata.username;
        }
        
        setUser(userWithUsername);
        fetchProfile(currentSession.user.id);
      }
    });

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
    setFollowing
  };
};
