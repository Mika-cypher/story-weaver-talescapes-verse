
import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Share2, LogOut } from "lucide-react";

interface ProfileHeaderProps {
  displayName: string;
  isOwnProfile: boolean;
  isFollowing: boolean;
  handleFollow: () => void;
  handleShareProfile: () => void;
  publishedStoriesCount: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  displayName,
  isOwnProfile,
  isFollowing,
  handleFollow,
  handleShareProfile,
  publishedStoriesCount
}) => {
  const { user, logout } = useAuth();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} alt={displayName} />
              <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{displayName}</CardTitle>
              {!isOwnProfile && user && (
                <Button 
                  variant={isFollowing ? "outline" : "default"} 
                  size="sm"
                  onClick={handleFollow}
                  className="mt-2"
                >
                  {isFollowing ? (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              )}
              {isOwnProfile && user && (
                <CardDescription className="mt-2">{user.email}</CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleShareProfile} title="Share Profile">
              <Share2 className="h-4 w-4" />
            </Button>
            {isOwnProfile && (
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-xl font-bold">{publishedStoriesCount}</p>
            <p className="text-sm text-muted-foreground">Stories</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
