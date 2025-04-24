
import { useAuth } from "@/contexts/AuthContext";

export const useVerification = () => {
  const { user, profile } = useAuth();
  
  // In a real app, this would check actual verification status
  // For this demo, we'll assume all users with an @ in their email are verified
  const isEmailVerified = user?.email?.includes('@') || false;
  
  // Calculate profile completion percentage
  const calculateProfileCompletion = (): number => {
    if (!user) return 0;
    
    let completionPoints = 0;
    let totalPoints = 3; // Basic fields: username, email, (avatar would be third in a real app)
    
    if (profile?.username) completionPoints += 1;
    if (user.email) completionPoints += 1;
    if (isEmailVerified) completionPoints += 1;
    
    return Math.floor((completionPoints / totalPoints) * 100);
  };
  
  return {
    isEmailVerified,
    profileCompletionPercentage: calculateProfileCompletion(),
  };
};
