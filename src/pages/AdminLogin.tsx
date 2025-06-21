
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAdmin, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already logged in as admin
  useEffect(() => {
    console.log("AdminLogin useEffect - isLoggedIn:", isLoggedIn, "isAdmin:", isAdmin, "user:", user?.email);
    
    if (isLoggedIn && isAdmin) {
      console.log("User is already logged in as admin, redirecting to dashboard");
      navigate("/admin/dashboard");
    } else if (isLoggedIn && !isAdmin) {
      console.log("User is logged in but not admin");
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this area.",
        variant: "destructive",
      });
    }
  }, [isAdmin, isLoggedIn, navigate, user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting admin login with email:", email);
      
      await login(email, password);
      
      console.log("Login successful");
      
    } catch (error: any) {
      console.log("Admin login failed:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials or insufficient permissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the form if already logged in as admin
  if (isLoggedIn && isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting to admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your admin credentials to access the dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid gap-4">
              <Input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Sign up with talescapesverse@gmail.com to get admin access, or use your admin credentials.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
