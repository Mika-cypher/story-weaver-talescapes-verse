import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, User, BookOpen, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import type { ExtendedUser, Profile } from "@/types/auth";

interface UserMenuProps {
  user: ExtendedUser;
  profile: Profile | null;
  onLogout: () => Promise<void>;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, profile, onLogout }) => {
  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Link to="/create" className="group">
        <Button 
          size="sm" 
          className="bg-cultural-gold hover:bg-cultural-gold/90 text-black font-medium"
        >
          <PenTool className="h-4 w-4 mr-2" />
          Create Story
        </Button>
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={profile?.avatar_url || user.avatar_url || ""} 
                alt={profile?.username || user.username || ""} 
              />
              <AvatarFallback className="bg-heritage-purple text-white">
                {(profile?.username || user.username || "U")?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 bg-card border border-border shadow-lg" 
          align="end" 
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile?.display_name || user.display_name || profile?.username || user.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                @{profile?.username || user.username}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/library" className="cursor-pointer">
              <BookOpen className="mr-2 h-4 w-4" />
              My Library
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;