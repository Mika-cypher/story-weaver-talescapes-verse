
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileSkeleton } from "@/components/common/LoadingStates";
import { useProfileData } from "@/hooks/useProfileData";

const Profile: React.FC = () => {
  const {
    user,
    isOwnProfile,
    displayName,
    loading,
    activeAudioId,
    openSettingsId,
    showDrafts,
    setShowDrafts,
    isFollowing,
    showUpload,
    setShowUpload,
    userPublishedStories,
    userSavedStories,
    handleToggleAudio,
    handleToggleSettings,
    handleFollow,
    handleShareProfile,
    handleMediaUploadComplete
  } = useProfileData();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <ProfileSkeleton />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <ProfileHeader 
              displayName={displayName}
              isOwnProfile={isOwnProfile}
              isFollowing={isFollowing}
              handleFollow={handleFollow}
              handleShareProfile={handleShareProfile}
              publishedStoriesCount={userPublishedStories.length}
            />
          </div>

          <ProfileTabs
            isOwnProfile={isOwnProfile}
            displayName={displayName}
            user={user}
            showDrafts={showDrafts}
            setShowDrafts={setShowDrafts}
            showUpload={showUpload}
            setShowUpload={setShowUpload}
            userPublishedStories={userPublishedStories}
            userSavedStories={userSavedStories}
            activeAudioId={activeAudioId}
            openSettingsId={openSettingsId}
            handleToggleAudio={handleToggleAudio}
            handleToggleSettings={handleToggleSettings}
            handleMediaUploadComplete={handleMediaUploadComplete}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
