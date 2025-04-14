
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Share2, Trash2, Copy, Eye, Heart, FileEdit, 
  CheckCircle, AlertCircle, Clock 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContentItem {
  id: string;
  title: string;
  url?: string;
  date: string;  // This is the required property
  status?: string;
  duration?: string;
  type?: string;
  submittedDate?: string;
}

interface UserContentProps {
  items: ContentItem[];
  type: "image" | "audio" | "submission";
  isOwner: boolean;
}

export const UserContent: React.FC<UserContentProps> = ({ items, type, isOwner }) => {
  const { toast } = useToast();
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No content found.
      </div>
    );
  }

  const handleShare = (item: ContentItem) => {
    const url = `${window.location.origin}/${type}/${item.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: `Link to "${item.title}" has been copied to clipboard.`,
    });
  };

  const handleDelete = (item: ContentItem) => {
    toast({
      title: "Content deleted",
      description: `"${item.title}" has been removed.`,
    });
    // In a real app, this would call an API to delete the item
  };

  const handleEdit = (item: ContentItem) => {
    toast({
      title: "Edit initiated",
      description: `Editing "${item.title}"`,
    });
    // In a real app, this would navigate to an edit page
  };

  const handlePlayAudio = (id: string) => {
    setActiveAudio(activeAudio === id ? null : id);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case "published":
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" /> {status}
        </Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" /> {status}
        </Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          <AlertCircle className="h-3 w-3 mr-1" /> {status}
        </Badge>;
      case "draft":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <FileEdit className="h-3 w-3 mr-1" /> {status}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base line-clamp-1">{item.title}</CardTitle>
              {getStatusBadge(item.status)}
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow pb-2">
            {type === "image" && item.url && (
              <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden rounded-md">
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="object-cover w-full h-full" 
                />
              </AspectRatio>
            )}
            
            {type === "audio" && (
              <div className="space-y-2">
                <div className="h-12 bg-secondary/20 rounded-md flex items-center justify-center">
                  {activeAudio === item.id ? (
                    <div className="flex items-center space-x-1">
                      <span className="w-1 h-8 bg-primary rounded-full animate-pulse"></span>
                      <span className="w-1 h-12 bg-primary rounded-full animate-pulse delay-150"></span>
                      <span className="w-1 h-6 bg-primary rounded-full animate-pulse delay-300"></span>
                      <span className="w-1 h-10 bg-primary rounded-full animate-pulse delay-75"></span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">{item.duration || "0:00"}</span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handlePlayAudio(item.id)}
                >
                  {activeAudio === item.id ? "Pause" : "Play"}
                </Button>
              </div>
            )}
            
            {type === "submission" && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm font-medium">{item.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Submitted:</span>
                  <span className="text-sm">{item.submittedDate}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>15</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>42</span>
                </div>
              </div>
              <div>
                {item.date && <span>{item.date}</span>}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2">
            <Button variant="ghost" size="icon" onClick={() => handleShare(item)} title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
            
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => handleShare(item)} title="Copy Link">
                <Copy className="h-4 w-4" />
              </Button>
              
              {isOwner && (
                <>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} title="Edit">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item)} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
