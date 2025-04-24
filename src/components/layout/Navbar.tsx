
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, BookOpen, PenSquare, Headphones, Archive, User, LogOut } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, isLoggedIn, logout } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get username from profile or user metadata or default to "U"
  const username = profile?.username || user?.user_metadata?.username || "User";
  const displayInitials = getInitials(username);

  return (
    <nav className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary">
                  Talescapes
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/explore"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Stories
              </Link>
              <Link
                to="/create"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <PenSquare className="mr-2 h-4 w-4" />
                Create Story
              </Link>
              <Link
                to="/archive"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Archive className="mr-2 h-4 w-4" />
                Cultural Archive
              </Link>
              <Link
                to="/library"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Headphones className="mr-2 h-4 w-4" />
                Audio Library
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative flex items-center space-x-2">
              <ThemeToggle />
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{displayInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-background inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/explore"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              <BookOpen className="inline-block mr-2 h-4 w-4" />
              Explore Stories
            </Link>
            <Link
              to="/create"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              <PenSquare className="inline-block mr-2 h-4 w-4" />
              Create Story
            </Link>
            <Link
              to="/archive"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              <Archive className="inline-block mr-2 h-4 w-4" />
              Cultural Archive
            </Link>
            <Link
              to="/library"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              <Headphones className="inline-block mr-2 h-4 w-4" />
              Audio Library
            </Link>
            {isLoggedIn && (
              <Link
                to="/profile"
                className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted transition-colors"
              >
                <User className="inline-block mr-2 h-4 w-4" />
                My Profile
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-4">
              {isLoggedIn ? (
                <>
                  <div className="flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{displayInitials}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium">{username}</div>
                    <div className="text-sm text-muted-foreground">{user?.email}</div>
                  </div>
                  <Button variant="ghost" className="ml-auto" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2 w-full">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
