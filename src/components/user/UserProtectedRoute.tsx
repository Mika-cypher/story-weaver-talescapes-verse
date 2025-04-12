
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

export const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  console.log("UserProtectedRoute - isLoggedIn:", isLoggedIn);

  if (!isLoggedIn) {
    console.log("Redirecting to login page from UserProtectedRoute");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
