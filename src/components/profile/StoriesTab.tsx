
import React from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, PenSquare } from "lucide-react";
import StoryList from "@/components/stories/StoryList";

interface StoriesTabProps {
  isOwnProfile: boolean;
  showDrafts: boolean;
  setShowDrafts: (value: boolean) => void;
  userPublishedStories: any[];
  displayName: string;
  activeAudioId: number | null;
  openSettingsId: number | null;
  handleToggleAudio: (storyId: number) => void;
  handleToggleSettings: (storyId: number) => void;
}

export const StoriesTab: React.FC<StoriesTabProps> = ({
  isOwnProfile,
  showDrafts,
  setShowDrafts,
  userPublishedStories,
  displayName,
  activeAudioId,
  openSettingsId,
  handleToggleAudio,
  handleToggleSettings
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      {isOwnProfile && (
        <div className="flex items-center space-x-2 mb-4">
          <Switch 
            id="show-drafts" 
            checked={showDrafts} 
            onCheckedChange={setShowDrafts} 
          />
          <Label htmlFor="show-drafts">Show drafts</Label>
        </div>
      )}
      
      {userPublishedStories.length > 0 ? (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">
              {isOwnProfile ? "Your Stories" : `${displayName}'s Stories`}
            </h3>
            <StoryList 
              stories={userPublishedStories.filter(story => 
                showDrafts ? true : story.status === "published"
              )}
              activeAudioId={activeAudioId}
              openSettingsId={openSettingsId}
              onToggleAudio={handleToggleAudio}
              onToggleSettings={handleToggleSettings}
            />
          </div>
          
          {isOwnProfile && (
            <Button 
              className="mt-2" 
              onClick={() => navigate("/create")}
            >
              <PenSquare className="h-4 w-4 mr-2" />
              Create New Story
            </Button>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">
              {isOwnProfile ? "No stories yet" : `${displayName} hasn't published any stories yet`}
            </CardTitle>
            <CardDescription>
              {isOwnProfile 
                ? "Start creating your own interactive stories"
                : "Check back later for new content"}
            </CardDescription>
            {isOwnProfile && (
              <Button className="mt-4" onClick={() => navigate("/create")}>
                Create New Story
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};
