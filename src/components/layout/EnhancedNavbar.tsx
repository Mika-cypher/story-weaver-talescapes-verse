
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, PenSquare, Archive, User, LogOut, Search, Globe, Heart, Users } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const EnhancedNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, profile, isLoggedIn, logout } = useAuth();
  const location = useLocation();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const username = profile?.username || user?.user_metadata?.username || "User";
  const displayInitials = getInitials(username);

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { 
      id: "explore", 
      label: "Explore", 
      icon: BookOpen, 
      path: "/explore",
      description: "Discover stories from around the world"
    },
    { 
      id: "create", 
      label: "Create", 
      icon: PenSquare, 
      path: "/create",
      description: "Share your cultural stories"
    },
    { 
      id: "archive", 
      label: "Cultural Archive", 
      icon: Archive, 
      path: "/archive",
      description: "Preserve and celebrate heritage"
    },
  ];

  const communityItems = [
    { label: "Featured Creators", icon: Users, path: "/creators" },
    { label: "Community Guidelines", icon: Heart, path: "/guidelines" },
    { label: "Cultural Celebrations", icon: Globe, path: "/celebrations" },
  ];

  return (
    <nav className="navigation-enhanced fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-cultural-gradient rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-heritage-purple">
                  Talescapes
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Cultural Storytelling Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {mainNavItems.map((item) => (
                  <NavigationMenuItem key={item.id}>
                    {item.id === "explore" ? (
                      <>
                        <NavigationMenuTrigger className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-foreground hover:text-heritage-purple hover:bg-heritage-purple/5">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid gap-3 p-6 w-[400px]">
                            <div className="row-span-3">
                              <div className="grid gap-1">
                                <h4 className="text-sm font-medium text-cultural-gold">
                                  Discover Stories
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Explore narratives from diverse cultures and traditions
                                </p>
                              </div>
                            </div>
                            {communityItems.map((communityItem) => (
                              <Link
                                key={communityItem.label}
                                to={communityItem.path}
                                className="flex items-center space-x-3 p-3 rounded-md hover:bg-heritage-purple/5 transition-colors"
                              >
                                <communityItem.icon className="h-4 w-4 text-heritage-purple" />
                                <span className="text-sm font-medium">{communityItem.label}</span>
                              </Link>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive(item.path)
                            ? "text-heritage-purple bg-heritage-purple/10"
                            : "text-foreground hover:text-heritage-purple hover:bg-heritage-purple/5"
                        }`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center max-w-sm mx-4 flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories, creators, cultures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:border-heritage-purple/50 focus:ring-heritage-purple/20"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border-2 border-heritage-purple/20">
                      <AvatarFallback className="bg-heritage-purple/10 text-heritage-purple">
                        {displayInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{username}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/create" className="flex items-center">
                      <PenSquare className="mr-2 h-4 w-4" />
                      <span>Create Story</span>
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
                <Button variant="ghost" asChild className="hover:bg-heritage-purple/10 hover:text-heritage-purple">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-cultural-gradient hover:opacity-90">
                  <Link to="/signup">Join Community</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-heritage-purple hover:bg-heritage-purple/10 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Mobile Nav Items */}
              {mainNavItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-heritage-purple bg-heritage-purple/10"
                      : "text-foreground hover:text-heritage-purple hover:bg-heritage-purple/5"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}

              {/* Mobile User Section */}
              <div className="border-t border-border/50 pt-4 mt-4">
                {isLoggedIn ? (
                  <div className="space-y-1">
                    <div className="flex items-center px-3 py-2">
                      <Avatar className="h-8 w-8 mr-3 border-2 border-heritage-purple/20">
                        <AvatarFallback className="bg-heritage-purple/10 text-heritage-purple">
                          {displayInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-base font-medium">{username}</div>
                        <div className="text-sm text-muted-foreground">{user?.email}</div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:text-heritage-purple hover:bg-heritage-purple/5 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="mr-3 h-5 w-5" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-foreground hover:text-heritage-purple hover:bg-heritage-purple/5 rounded-md"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <Button variant="ghost" className="w-full justify-start hover:bg-heritage-purple/10 hover:text-heritage-purple" asChild>
                      <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                    <Button className="w-full bg-cultural-gradient hover:opacity-90" asChild>
                      <Link to="/signup" onClick={() => setIsOpen(false)}>Join Community</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EnhancedNavbar;
