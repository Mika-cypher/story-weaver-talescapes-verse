
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Upload } from "lucide-react";
import { SubmissionForm } from "@/components/user/SubmissionForm";
import { AccountSettings } from "@/components/user/AccountSettings";
import { MediaUpload } from "@/components/media/MediaUpload";
import { MediaGallery } from "@/components/media/MediaGallery";
import { StoriesTab } from "./StoriesTab";
import { SavedStoriesTab } from "./SavedStoriesTab";
import { ContributionsTab } from "./ContributionsTab";

interface ProfileTabsProps {
  isOwnProfile: boolean;
  displayName: string;
  user: any;
  showDrafts: boolean;
  setShowDrafts: (value: boolean) => void;
  showUpload: boolean;
  setShowUpload: (value: boolean) => void;
  userPublishedStories: any[];
  userSavedStories: any[];
  activeAudioId: string | null;
  openSettingsId: string | null;
  handleToggleAudio: (storyId: string) => void;
  handleToggleSettings: (storyId: string) => void;
  handleMediaUploadComplete: (media: any) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  isOwnProfile,
  displayName,
  user,
  showDrafts,
  setShowDrafts,
  showUpload,
  setShowUpload,
  userPublishedStories,
  userSavedStories,
  activeAudioId,
  openSettingsId,
  handleToggleAudio,
  handleToggleSettings,
  handleMediaUploadComplete
}) => {
  return (
    <Tabs defaultValue="stories" className="mt-8">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="stories">Stories</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="saved">Saved</TabsTrigger>
        <TabsTrigger value="contributions">Contributions</TabsTrigger>
        {isOwnProfile && <TabsTrigger value="submit">Submit</TabsTrigger>}
        {isOwnProfile && <TabsTrigger value="upload"><Upload className="h-4 w-4 mr-2" />Upload</TabsTrigger>}
        {isOwnProfile && <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-2" />Settings</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="stories" className="mt-6">
        <StoriesTab 
          isOwnProfile={isOwnProfile}
          showDrafts={showDrafts}
          setShowDrafts={setShowDrafts}
          userPublishedStories={userPublishedStories}
          displayName={displayName}
          activeAudioId={activeAudioId}
          openSettingsId={openSettingsId}
          handleToggleAudio={handleToggleAudio}
          handleToggleSettings={handleToggleSettings}
        />
      </TabsContent>

      <TabsContent value="media" className="mt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              {isOwnProfile ? "Your Media" : `${displayName}'s Media`}
            </h3>
            {isOwnProfile && (
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="text-sm text-primary hover:underline"
              >
                {showUpload ? "Hide Upload" : "Upload Media"}
              </button>
            )}
          </div>
          
          {showUpload && isOwnProfile && (
            <MediaUpload onUploadComplete={handleMediaUploadComplete} />
          )}
          
          <MediaGallery 
            userId={user?.id} 
            showUploadedOnly={isOwnProfile}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="saved" className="mt-6">
        <SavedStoriesTab 
          isOwnProfile={isOwnProfile}
          userSavedStories={userSavedStories}
          activeAudioId={activeAudioId}
          openSettingsId={openSettingsId}
          handleToggleAudio={handleToggleAudio}
          handleToggleSettings={handleToggleSettings}
        />
      </TabsContent>
      
      <TabsContent value="contributions" className="mt-6">
        <ContributionsTab 
          isOwnProfile={isOwnProfile}
          displayName={displayName}
          userSubmissions={[]}
        />
      </TabsContent>
      
      {isOwnProfile && (
        <TabsContent value="submit" className="mt-6">
          <SubmissionForm />
        </TabsContent>
      )}

      {isOwnProfile && (
        <TabsContent value="upload" className="mt-6">
          <MediaUpload onUploadComplete={handleMediaUploadComplete} />
        </TabsContent>
      )}
      
      {isOwnProfile && (
        <TabsContent value="settings" className="mt-6">
          <AccountSettings />
        </TabsContent>
      )}
    </Tabs>
  );
};
