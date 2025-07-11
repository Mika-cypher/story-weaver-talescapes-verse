import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider"

const Navbar = () => {
  const { user, logout, isLoggedIn, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-heritage-purple to-cultural-gold bg-clip-text text-transparent">
              Talescapes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-heritage-purple transition-colors">
              Home
            </Link>
            <Link to="/explore" className="text-foreground hover:text-heritage-purple transition-colors">
              Explore
            </Link>
            <Link to="/community" className="text-foreground hover:text-heritage-purple transition-colors">
              Community
            </Link>
            <Link to="/archive" className="text-foreground hover:text-heritage-purple transition-colors">
              Archive
            </Link>
            <Link to="/create" className="text-foreground hover:text-heritage-purple transition-colors">
              Create
            </Link>
            
            {isLoggedIn && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt={profile.username} />
                      <AvatarFallback>{profile.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate(`/profile/${profile.username}`)}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={toggleMobileMenu}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate Talescapes
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Link to="/" className="text-foreground hover:text-heritage-purple transition-colors block py-2">
                  Home
                </Link>
                <Link to="/explore" className="text-foreground hover:text-heritage-purple transition-colors block py-2">
                  Explore
                </Link>
                 <Link to="/community" className="text-foreground hover:text-heritage-purple transition-colors block py-2">
                  Community
                </Link>
                <Link to="/archive" className="text-foreground hover:text-heritage-purple transition-colors block py-2">
                  Archive
                </Link>
                <Link to="/create" className="text-foreground hover:text-heritage-purple transition-colors block py-2">
                  Create
                </Link>
                {!isLoggedIn ? (
                  <>
                    <Button variant="ghost" onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }} className="w-full justify-start">
                      Sign In
                    </Button>
                    <Button onClick={() => { navigate("/signup"); setIsMobileMenuOpen(false); }} className="w-full justify-start">
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to={`/profile/${profile?.username}`} className="text-foreground hover:text-heritage-purple transition-colors block py-2">
                      Profile
                    </Link>
                    <Link to="/settings" className="text-foreground hover:text-heritage-purple transition-colors block py-2">
                      Settings
                    </Link>
                    <Button variant="destructive" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full justify-start">
                      Log out
                    </Button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      Theme
                      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="h-4 w-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
