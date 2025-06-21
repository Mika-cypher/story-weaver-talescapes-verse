
import React, { useState, useEffect } from 'react';
import { mediaService, CreatorMedia } from '@/services/mediaService';
import { analyticsService } from '@/services/analyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, Heart, Share, Download, Play, Pause } from 'lucide-react';

interface MediaGalleryProps {
  userId?: string;
  mediaType?: 'image' | 'audio' | 'video' | 'document';
  showUploadedOnly?: boolean;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  userId, 
  mediaType, 
  showUploadedOnly = false 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [media, setMedia] = useState<CreatorMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, [userId, mediaType, showUploadedOnly]);

  const loadMedia = async () => {
    try {
      let mediaData: CreatorMedia[];
      
      if (showUploadedOnly && userId) {
        mediaData = await mediaService.getUserMedia(userId);
      } else {
        mediaData = await mediaService.getPublicMedia(mediaType);
        if (userId) {
          mediaData = mediaData.filter(m => m.user_id === userId);
        }
      }
      
      setMedia(mediaData);
    } catch (error) {
      console.error('Error loading media:', error);
      toast({
        title: "Error",
        description: "Failed to load media",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (mediaItem: CreatorMedia) => {
    if (user) {
      await analyticsService.trackEvent(mediaItem.id, 'media', 'view', user.id);
    }
  };

  const handleLike = async (mediaItem: CreatorMedia) => {
    if (user) {
      await analyticsService.trackEvent(mediaItem.id, 'media', 'like', user.id);
      toast({
        title: "Liked!",
        description: "You liked this media"
      });
    }
  };

  const handleShare = async (mediaItem: CreatorMedia) => {
    if (navigator.share) {
      await navigator.share({
        title: mediaItem.title,
        text: mediaItem.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Media link copied to clipboard"
      });
    }
    
    if (user) {
      await analyticsService.trackEvent(mediaItem.id, 'media', 'share', user.id);
    }
  };

  const toggleAudio = (mediaId: string) => {
    setPlayingAudio(playingAudio === mediaId ? null : mediaId);
  };

  const renderMediaPreview = (mediaItem: CreatorMedia) => {
    switch (mediaItem.media_type) {
      case 'image':
        return (
          <img
            src={mediaItem.file_url}
            alt={mediaItem.title}
            className="w-full h-48 object-cover rounded-md cursor-pointer"
            onClick={() => handleView(mediaItem)}
          />
        );
      case 'audio':
        return (
          <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-md flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => toggleAudio(mediaItem.id)}
              className="text-white hover:bg-white/20"
            >
              {playingAudio === mediaItem.id ? 
                <Pause className="h-12 w-12" /> : 
                <Play className="h-12 w-12" />
              }
            </Button>
            {playingAudio === mediaItem.id && (
              <audio
                src={mediaItem.file_url}
                autoPlay
                controls
                className="hidden"
                onEnded={() => setPlayingAudio(null)}
              />
            )}
          </div>
        );
      case 'video':
        return (
          <video
            src={mediaItem.file_url}
            className="w-full h-48 object-cover rounded-md"
            controls
            onClick={() => handleView(mediaItem)}
          />
        );
      default:
        return (
          <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-500">Document</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-3 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {media.map((mediaItem) => (
        <Card key={mediaItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            {renderMediaPreview(mediaItem)}
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 truncate">{mediaItem.title}</h3>
              {mediaItem.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{mediaItem.description}</p>
              )}
              
              <div className="flex flex-wrap gap-1 mb-3">
                {mediaItem.tags?.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(mediaItem)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(mediaItem)}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
                
                <Badge variant="secondary" className="text-xs">
                  {mediaItem.media_type}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {media.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No media found</p>
        </div>
      )}
    </div>
  );
};
