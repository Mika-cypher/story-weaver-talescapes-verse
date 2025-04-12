
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a simple admin authentication
// In a real application, you would use a proper authentication system
const ADMIN_PASSWORD = "admin123"; // You should change this to a secure password

// Mock users database
const MOCK_USERS_KEY = "talescapes_users";
const SAVED_STORIES_KEY = "talescapes_saved_stories";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [savedStories, setSavedStories] = useState<string[]>([]);
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
        isStorySaved
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
