
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FileImage, FileAudio } from "lucide-react";
import { UserContent } from "@/components/user/UserContent";

interface MediaTabProps {
  isOwnProfile: boolean;
  displayName: string;
  userImages: any[];
  userAudios: any[];
}

export const MediaTab: React.FC<MediaTabProps> = ({
  isOwnProfile,
  displayName,
  userImages,
  userAudios
}) => {
  return (
    <Tabs defaultValue="images">
      <TabsList>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="audio">Audio</TabsTrigger>
      </TabsList>
      
      <TabsContent value="images" className="mt-4">
        {(isOwnProfile || userImages.some(img => img.status === "published")) ? (
          <UserContent 
            items={userImages.filter(img => isOwnProfile ? true : img.status === "published")}
            type="image"
            isOwner={isOwnProfile}
          />
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">
                {`${displayName} hasn't uploaded any images yet`}
              </CardTitle>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="audio" className="mt-4">
        {(isOwnProfile || userAudios.some(audio => audio.status === "published")) ? (
          <UserContent 
            items={userAudios.filter(audio => isOwnProfile ? true : audio.status === "published")}
            type="audio"
            isOwner={isOwnProfile}
          />
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <FileAudio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">
                {`${displayName} hasn't uploaded any audio yet`}
              </CardTitle>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};
