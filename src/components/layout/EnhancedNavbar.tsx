import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import NavbarLogo from "./navbar/NavbarLogo";
import NavigationItems from "./navbar/NavigationItems";
import UserMenu from "./navbar/UserMenu";
import AuthButtons from "./navbar/AuthButtons";
import MobileMenu from "./navbar/MobileMenu";

const EnhancedNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, profile, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navigation-enhanced">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavbarLogo />

          {/* Desktop Navigation */}
          <NavigationItems className="hidden md:flex items-center space-x-1" />

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {isLoggedIn && user ? (
              <UserMenu user={user} profile={profile} onLogout={logout} />
            ) : (
              <AuthButtons className="flex items-center space-x-3" />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <MobileMenu 
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          isLoggedIn={isLoggedIn}
          user={user}
          profile={profile}
          onLogout={logout}
        />
      </div>
    </nav>
  );
};

export default EnhancedNavbar;
