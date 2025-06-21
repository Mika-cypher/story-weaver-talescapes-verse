
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAdmin, isLoggedIn, profile } = useAuth();
  
  console.log("AdminProtectedRoute - isLoggedIn:", isLoggedIn, "isAdmin:", isAdmin, "profile role:", profile?.role);

  if (!isLoggedIn) {
    console.log("User not logged in, redirecting to admin login");
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    console.log("User logged in but not admin, redirecting to admin login");
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
