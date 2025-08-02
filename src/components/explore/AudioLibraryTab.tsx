
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Pause, Search, Music, MessageSquare, Heart, Share, User, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreatorMedia } from '@/services/mediaService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AudioLibraryTabProps {
  audioMedia: CreatorMedia[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading: boolean;
}

const AudioLibraryTab: React.FC<AudioLibraryTabProps> = ({
  audioMedia,
  searchTerm,
  onSearchChange,
  loading
}) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleAudio = (mediaId: string) => {
    setPlayingAudio(playingAudio === mediaId ? null : mediaId);
  };

  const handleLike = (mediaItem: CreatorMedia) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like audio",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Liked!",
      description: "You liked this audio"
    });
  };

  const handleShare = async (mediaItem: CreatorMedia) => {
    if (navigator.share) {
      await navigator.share({
        title: mediaItem.title,
        text: mediaItem.description || '',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Audio link copied to clipboard"
      });
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
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audio by title or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Audio Grid */}
      {audioMedia.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-heritage-purple/10 to-cultural-gold/10 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <Music className="h-16 w-16 text-heritage-purple" />
          </div>
          <h3 className="text-2xl font-bold mb-4">
            {searchTerm ? "No Audio Found" : "Be the First to Share"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {searchTerm 
              ? "Try adjusting your search terms or browse our categories." 
              : "Help us build a rich library of African audio content. Share traditional songs, stories, or spoken word that celebrates our heritage."
            }
          </p>
          {!searchTerm && (
            <Button size="lg" asChild>
              <a href="/create">
                <Plus className="h-5 w-5 mr-2" />
                Share Your Audio
              </a>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audioMedia.map((mediaItem, index) => (
            <motion.div
              key={mediaItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => toggleAudio(mediaItem.id)}
                      className="text-white hover:bg-white/20 rounded-full p-4"
                    >
                      {playingAudio === mediaItem.id ? 
                        <Pause className="h-8 w-8" /> : 
                        <Play className="h-8 w-8" />
                      }
                    </Button>
                  </div>
                  
                  {playingAudio === mediaItem.id && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50">
                      <audio
                        src={mediaItem.file_url}
                        autoPlay
                        controls
                        className="w-full h-8"
                        onEnded={() => setPlayingAudio(null)}
                      />
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {mediaItem.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span>Creator</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {mediaItem.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {mediaItem.description}
                    </p>
                  )}
                  
                  {mediaItem.tags && mediaItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {mediaItem.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(mediaItem)}
                        className="hover:text-red-500"
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
                    
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Discuss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioLibraryTab;
