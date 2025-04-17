
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useSignUpReminder = (delay: number = 30000) => {
  const [showReminder, setShowReminder] = useState(false);
  const { isLoggedIn } = useAuth();
  
  useEffect(() => {
    // Only show reminder for non-logged in users
    if (!isLoggedIn) {
      // Check if we've already shown the reminder in this session
      const hasSeenReminder = sessionStorage.getItem("hasSeenSignUpReminder");
      
      if (!hasSeenReminder) {
        const timer = setTimeout(() => {
          setShowReminder(true);
          // Mark that we've shown the reminder in this session
          sessionStorage.setItem("hasSeenSignUpReminder", "true");
        }, delay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isLoggedIn, delay]);
  
  return {
    showReminder,
    setShowReminder
  };
};
