
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import StoryList from "@/components/stories/StoryList";

interface SavedStoriesTabProps {
  isOwnProfile: boolean;
  userSavedStories: any[];
  activeAudioId: number | null;
  openSettingsId: number | null;
  handleToggleAudio: (storyId: number) => void;
  handleToggleSettings: (storyId: number) => void;
}

export const SavedStoriesTab: React.FC<SavedStoriesTabProps> = ({
  isOwnProfile,
  userSavedStories,
  activeAudioId,
  openSettingsId,
  handleToggleAudio,
  handleToggleSettings
}) => {
  const navigate = useNavigate();
  
  if (!isOwnProfile) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <CardTitle className="text-xl mb-2">Saved stories are private</CardTitle>
          <CardDescription>
            Users can only see their own saved stories
          </CardDescription>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      {userSavedStories.length > 0 ? (
        <StoryList 
          stories={userSavedStories}
          activeAudioId={activeAudioId}
          openSettingsId={openSettingsId}
          onToggleAudio={handleToggleAudio}
          onToggleSettings={handleToggleSettings}
        />
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <BookmarkPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">No saved stories yet</CardTitle>
            <CardDescription>
              Explore stories and bookmark the ones you like to see them here
            </CardDescription>
            <Button className="mt-4" onClick={() => navigate("/explore")}>
              Explore Stories
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};
