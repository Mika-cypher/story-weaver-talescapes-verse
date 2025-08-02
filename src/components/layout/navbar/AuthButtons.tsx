import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AuthButtonsProps {
  className?: string;
  fullWidth?: boolean;
  onItemClick?: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ className, fullWidth, onItemClick }) => {
  return (
    <div className={className}>
      <Button 
        variant="ghost" 
        size="sm" 
        className={fullWidth ? "w-full justify-start" : ""} 
        asChild
      >
        <Link to="/login" onClick={onItemClick}>Sign In</Link>
      </Button>
      <Button 
        size="sm" 
        className={`bg-heritage-purple hover:bg-heritage-purple/90 text-white ${fullWidth ? "w-full" : ""}`}
        asChild
      >
        <Link to="/signup" onClick={onItemClick}>Join Community</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;