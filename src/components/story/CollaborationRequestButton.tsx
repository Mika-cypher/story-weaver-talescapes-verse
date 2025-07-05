
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Palette, Camera, Music, PenTool } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface CollaborationRequestButtonProps {
  storyId: string;
  storyTitle: string;
  isPublished: boolean;
}

const CollaborationRequestButton: React.FC<CollaborationRequestButtonProps> = ({
  storyId,
  storyTitle,
  isPublished
}) => {
  const [showCollabTypes, setShowCollabTypes] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const collaborationTypes = [
    { id: 'illustration', label: 'Illustration', icon: Palette, description: 'Add visual artwork' },
    { id: 'photography', label: 'Photography', icon: Camera, description: 'Provide photos/imagery' },
    { id: 'music', label: 'Music & Sound', icon: Music, description: 'Compose audio elements' },
    { id: 'writing', label: 'Co-Writing', icon: PenTool, description: 'Collaborate on content' },
  ];

  const handleCollaborationRequest = (type: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to request collaboration",
        variant: "destructive"
      });
      return;
    }

    // Here you would implement the actual collaboration request logic
    // For now, we'll show a success message
    toast({
      title: "Collaboration request sent!",
      description: `Your ${type} collaboration request has been sent to the story creator.`
    });
    
    setShowCollabTypes(false);
  };

  if (!isPublished) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Collaboration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showCollabTypes ? (
          <Button 
            onClick={() => setShowCollabTypes(true)}
            className="w-full"
            variant="outline"
          >
            <Users className="h-4 w-4 mr-2" />
            Request Collaboration
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose the type of collaboration you'd like to offer:
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              {collaborationTypes.map((type) => (
                <Button
                  key={type.id}
                  variant="ghost"
                  className="justify-start h-auto p-3"
                  onClick={() => handleCollaborationRequest(type.label)}
                >
                  <type.icon className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => setShowCollabTypes(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Open to Collaboration
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborationRequestButton;
