
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type UserRole = "user" | "admin";

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  adminLogin: (password: string) => boolean;
  signup: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  savedStories: string[];
  saveStory: (storyId: string) => void;
  unsaveStory: (storyId: string) => void;
  isStorySaved: (storyId: string) => boolean;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowingUser: (userId: string) => boolean;
  likeContent: (contentId: string, contentType: string) => void;
  unlikeContent: (contentId: string, contentType: string) => void;
  isContentLiked: (contentId: string) => boolean;
  getUserSubmissions: () => any[];
  submitContent: (content: any) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a simple admin authentication
// In a real application, you would use a proper authentication system
const ADMIN_PASSWORD = "admin123"; // You should change this to a secure password

// Mock users database
const MOCK_USERS_KEY = "talescapes_users";
const SAVED_STORIES_KEY = "talescapes_saved_stories";
const LIKED_CONTENT_KEY = "talescapes_liked_content";
const FOLLOWING_KEY = "talescapes_following";
const SUBMISSIONS_KEY = "talescapes_submissions";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [savedStories, setSavedStories] = useState<string[]>([]);
  const [likedContent, setLikedContent] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedInUser = localStorage.getItem("currentUser");
    const adminLoggedIn = localStorage.getItem("isAdmin") === "true";
    
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setUser(userData);
      
      // Load saved stories for the user
      const savedStoriesData = localStorage.getItem(`${SAVED_STORIES_KEY}_${userData.id}`);
      if (savedStoriesData) {
        setSavedStories(JSON.parse(savedStoriesData));
      }
      
      // Load liked content for the user
      const likedContentData = localStorage.getItem(`${LIKED_CONTENT_KEY}_${userData.id}`);
      if (likedContentData) {
        setLikedContent(JSON.parse(likedContentData));
      }
      
      // Load following data for the user
      const followingData = localStorage.getItem(`${FOLLOWING_KEY}_${userData.id}`);
      if (followingData) {
        setFollowing(JSON.parse(followingData));
      }
    }
    
    setIsAdmin(adminLoggedIn);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Get users from localStorage
    const usersData = localStorage.getItem(MOCK_USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : [];
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      // Don't store password in the state
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      
      // Load saved stories for the user
      const savedStoriesData = localStorage.getItem(`${SAVED_STORIES_KEY}_${foundUser.id}`);
      if (savedStoriesData) {
        setSavedStories(JSON.parse(savedStoriesData));
      }
      
      // Load liked content for the user
      const likedContentData = localStorage.getItem(`${LIKED_CONTENT_KEY}_${foundUser.id}`);
      if (likedContentData) {
        setLikedContent(JSON.parse(likedContentData));
      }
      
      // Load following data for the user
      const followingData = localStorage.getItem(`${FOLLOWING_KEY}_${foundUser.id}`);
      if (followingData) {
        setFollowing(JSON.parse(followingData));
      }
      
      toast({
        title: "Welcome back!",
        description: `You're now logged in as ${foundUser.username}`,
      });
      
      return true;
    }
    
    return false;
  };

  const adminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      return true;
    }
    return false;
  };

  const signup = (username: string, email: string, password: string): boolean => {
    // Get users from localStorage
    const usersData = localStorage.getItem(MOCK_USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : [];
    
    // Check if user already exists
    const userExists = users.some((u: any) => u.email === email);
    
    if (userExists) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In a real app, this would be hashed
      role: "user" as UserRole
    };
    
    // Save to "database"
    users.push(newUser);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    
    // Log in the new user (without the password in state)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    
    toast({
      title: "Account created!",
      description: `Welcome to Talescapes, ${username}!`,
    });
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setSavedStories([]);
    localStorage.removeItem("currentUser");
    
    if (isAdmin) {
      setIsAdmin(false);
      localStorage.removeItem("isAdmin");
      navigate("/admin/login");
    } else {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });
      navigate("/");
    }
  };

  const saveStory = (storyId: string) => {
    if (!user) return;
    
    if (!savedStories.includes(storyId)) {
      const updatedSavedStories = [...savedStories, storyId];
      setSavedStories(updatedSavedStories);
      localStorage.setItem(`${SAVED_STORIES_KEY}_${user.id}`, JSON.stringify(updatedSavedStories));
      
      toast({
        title: "Story saved",
        description: "This story has been added to your saved stories",
      });
    }
  };

  const unsaveStory = (storyId: string) => {
    if (!user) return;
    
    const updatedSavedStories = savedStories.filter(id => id !== storyId);
    setSavedStories(updatedSavedStories);
    localStorage.setItem(`${SAVED_STORIES_KEY}_${user.id}`, JSON.stringify(updatedSavedStories));
    
    toast({
      title: "Story removed",
      description: "This story has been removed from your saved stories",
    });
  };

  const isStorySaved = (storyId: string) => {
    return savedStories.includes(storyId);
  };
  
  // New functions for user social features
  
  const followUser = (userId: string) => {
    if (!user) return;
    
    if (!following.includes(userId)) {
      const updatedFollowing = [...following, userId];
      setFollowing(updatedFollowing);
      localStorage.setItem(`${FOLLOWING_KEY}_${user.id}`, JSON.stringify(updatedFollowing));
    }
  };
  
  const unfollowUser = (userId: string) => {
    if (!user) return;
    
    const updatedFollowing = following.filter(id => id !== userId);
    setFollowing(updatedFollowing);
    localStorage.setItem(`${FOLLOWING_KEY}_${user.id}`, JSON.stringify(updatedFollowing));
  };
  
  const isFollowingUser = (userId: string) => {
    return following.includes(userId);
  };
  
  const likeContent = (contentId: string, contentType: string) => {
    if (!user) return;
    
    const likeId = `${contentType}_${contentId}`;
    if (!likedContent.includes(likeId)) {
      const updatedLikedContent = [...likedContent, likeId];
      setLikedContent(updatedLikedContent);
      localStorage.setItem(`${LIKED_CONTENT_KEY}_${user.id}`, JSON.stringify(updatedLikedContent));
    }
  };
  
  const unlikeContent = (contentId: string, contentType: string) => {
    if (!user) return;
    
    const likeId = `${contentType}_${contentId}`;
    const updatedLikedContent = likedContent.filter(id => id !== likeId);
    setLikedContent(updatedLikedContent);
    localStorage.setItem(`${LIKED_CONTENT_KEY}_${user.id}`, JSON.stringify(updatedLikedContent));
  };
  
  const isContentLiked = (contentId: string) => {
    return likedContent.some(id => id.includes(contentId));
  };
  
  // Functions for user submissions
  
  const getUserSubmissions = () => {
    if (!user) return [];
    
    const submissions = localStorage.getItem(`${SUBMISSIONS_KEY}_${user.id}`);
    return submissions ? JSON.parse(submissions) : [];
  };
  
  const submitContent = async (content: any): Promise<boolean> => {
    if (!user) return false;
    
    const submission = {
      ...content,
      id: `sub_${Date.now()}`,
      userId: user.id,
      userName: user.username,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    
    const userSubmissions = getUserSubmissions();
    const updatedSubmissions = [...userSubmissions, submission];
    
    localStorage.setItem(`${SUBMISSIONS_KEY}_${user.id}`, JSON.stringify(updatedSubmissions));
    
    // Also add to global submissions for admin to review
    const allSubmissions = localStorage.getItem(SUBMISSIONS_KEY) || "[]";
    const parsedSubmissions = JSON.parse(allSubmissions);
    parsedSubmissions.push(submission);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(parsedSubmissions));
    
    return true;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAdmin, 
        isLoggedIn: !!user,
        login, 
        adminLogin,
        signup, 
        logout,
        savedStories,
        saveStory,
        unsaveStory,
        isStorySaved,
        followUser,
        unfollowUser,
        isFollowingUser,
        likeContent,
        unlikeContent,
        isContentLiked,
        getUserSubmissions,
        submitContent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
