
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { UserContent } from "@/components/user/UserContent";

interface ContributionsTabProps {
  isOwnProfile: boolean;
  displayName: string;
  userSubmissions: any[];
}

export const ContributionsTab: React.FC<ContributionsTabProps> = ({
  isOwnProfile,
  displayName,
  userSubmissions
}) => {
  const navigate = useNavigate();
  
  if ((isOwnProfile || userSubmissions.some(sub => sub.status === "approved"))) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {isOwnProfile ? "Your Contributions" : `${displayName}'s Contributions`}
        </h3>
        <UserContent 
          items={userSubmissions.filter(sub => 
            isOwnProfile ? true : sub.status === "approved"
          )}
          type="submission"
          isOwner={isOwnProfile}
        />
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <CardTitle className="text-xl mb-2">
          {isOwnProfile 
            ? "You haven't made any contributions yet" 
            : `${displayName} hasn't made any contributions yet`}
        </CardTitle>
        <CardDescription>
          Cultural Heritage contributions help preserve stories, music, and art
        </CardDescription>
        {isOwnProfile && (
          <Button className="mt-4" onClick={() => navigate("/profile?tab=submit")}>
            Submit to Cultural Heritage Archive
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
