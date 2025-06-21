
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Image as ImageIcon, 
  Music, 
  Video, 
  FileText, 
  Download, 
  Heart, 
  Share2,
  Search,
  Filter,
  ZoomIn,
  Play,
  Pause
} from "lucide-react";
import { mediaService, CreatorMedia } from "@/services/mediaService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EnhancedMediaGalleryProps {
  userId?: string;
  showUserContent?: boolean;
}

const EnhancedMediaGallery: React.FC<EnhancedMediaGalleryProps> = ({ 
  userId, 
  showUserContent = false 
}) => {
  const [media, setMedia] = useState<CreatorMedia[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<CreatorMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<CreatorMedia | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadMedia();
  }, [userId, showUserContent]);

  useEffect(() => {
    filterMedia();
  }, [media, filterType, searchTerm]);

  const loadMedia = async () => {
    try {
      let mediaData: CreatorMedia[];
      
      if (showUserContent && userId) {
        mediaData = await mediaService.getUserMedia(userId);
      } else {
        mediaData = await mediaService.getPublicMedia();
      }
      
      setMedia(mediaData);
    } catch (error) {
      console.error("Failed to load media:", error);
      toast({
        title: "Error",
        description: "Failed to load media content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMedia = () => {
    let filtered = media;

    if (filterType !== "all") {
      filtered = filtered.filter(item => item.media_type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredMedia(filtered);
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return <ImageIcon className="h-6 w-6" />;
      case 'audio':
        return <Music className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'document':
        return <FileText className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = (media: CreatorMedia) => {
    window.open(media.file_url, '_blank');
    toast({
      title: "Download started",
      description: `Downloading ${media.title}`
    });
  };

  const toggleAudio = (mediaId: string) => {
    if (isPlaying === mediaId) {
      setIsPlaying(null);
    } else {
      setIsPlaying(mediaId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            {searchTerm || filterType !== "all" 
              ? "No media found matching your criteria." 
              : "No media available yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getMediaIcon(item.media_type)}
                    <Badge variant="secondary" className="text-xs">
                      {item.media_type}
                    </Badge>
                  </div>
                  {item.is_featured && (
                    <Badge variant="default" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm line-clamp-1">{item.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-2">
                {item.media_type === 'image' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative cursor-pointer group">
                        <img
                          src={item.file_url}
                          alt={item.title}
                          className="w-full h-32 object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <ZoomIn className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{item.title}</DialogTitle>
                      </DialogHeader>
                      <img
                        src={item.file_url}
                        alt={item.title}
                        className="w-full h-auto max-h-[70vh] object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                )}

                {item.media_type === 'audio' && (
                  <div className="space-y-2">
                    <div className="bg-muted p-3 rounded flex items-center justify-center">
                      <Music className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => toggleAudio(item.id)}
                    >
                      {isPlaying === item.id ? (
                        <><Pause className="h-4 w-4 mr-2" /> Pause</>
                      ) : (
                        <><Play className="h-4 w-4 mr-2" /> Play</>
                      )}
                    </Button>
                    {isPlaying === item.id && (
                      <audio
                        src={item.file_url}
                        controls
                        autoPlay
                        className="w-full"
                        onEnded={() => setIsPlaying(null)}
                      />
                    )}
                  </div>
                )}

                {item.media_type === 'video' && (
                  <video
                    src={item.file_url}
                    controls
                    className="w-full h-32 object-cover rounded"
                  />
                )}

                {item.media_type === 'document' && (
                  <div className="bg-muted p-6 rounded flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {item.description || "No description"}
                </p>
                
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDownload(item)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {formatFileSize(item.file_size)}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedMediaGallery;
