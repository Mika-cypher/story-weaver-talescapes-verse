import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PenTool, User, BookOpen, LogOut } from "lucide-react";
import NavigationItems from "./NavigationItems";
import AuthButtons from "./AuthButtons";
import type { ExtendedUser, Profile } from "@/types/auth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  user: ExtendedUser | null;
  profile: Profile | null;
  onLogout: () => Promise<void>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  isLoggedIn, 
  user, 
  profile, 
  onLogout 
}) => {
  const handleLogout = async () => {
    try {
      await onLogout();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="md:hidden bg-card border border-border rounded-lg mt-2 p-4 shadow-lg"
    >
      <div className="flex flex-col space-y-2">
        <NavigationItems 
          className="flex flex-col space-y-2" 
          onItemClick={onClose}
        />
        
        <div className="border-t pt-2 mt-2">
          {isLoggedIn && user ? (
            <div className="space-y-2">
              <Link
                to="/create"
                onClick={onClose}
                className="block"
              >
                <Button 
                  size="sm" 
                  className="w-full bg-cultural-gold hover:bg-cultural-gold/90 text-black"
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Create Story
                </Button>
              </Link>
              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center space-x-2 px-3 py-2 text-sm"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                to="/library"
                onClick={onClose}
                className="flex items-center space-x-2 px-3 py-2 text-sm"
              >
                <BookOpen className="h-4 w-4" />
                <span>My Library</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm w-full text-left text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <AuthButtons 
              className="space-y-2" 
              fullWidth 
              onItemClick={onClose}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;