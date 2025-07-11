
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  MessageCircle,
  Share,
  Lock,
  Unlock,
  Eye,
  Edit,
  Send,
  UserPlus
} from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'reviewer';
  isOnline: boolean;
  lastSeen: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  position: { line: number; character: number };
  resolved: boolean;
}

export const CollaborativeEditor: React.FC = () => {
  const [collaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: '/placeholder.svg',
      role: 'owner',
      isOnline: true,
      lastSeen: 'now'
    },
    {
      id: '2',
      name: 'Ahmed Hassan',
      role: 'editor',
      isOnline: true,
      lastSeen: 'now'
    },
    {
      id: '3',
      name: 'Maria Garcia',
      role: 'reviewer',
      isOnline: false,
      lastSeen: '5 minutes ago'
    }
  ]);

  const [comments] = useState<Comment[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Ahmed Hassan',
      content: 'This paragraph beautifully captures the cultural significance. Consider adding more context about the ritual.',
      timestamp: '2 hours ago',
      position: { line: 5, character: 20 },
      resolved: false
    },
    {
      id: '2',
      userId: '3',
      userName: 'Maria Garcia',
      content: 'The transition here feels abrupt. Maybe we need a connecting sentence?',
      timestamp: '1 hour ago',
      position: { line: 12, character: 0 },
      resolved: false
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [storyContent, setStoryContent] = useState(`The ancient baobab tree stood sentinel in the village square, its massive trunk scarred by centuries of wind and rain. Grandmother Amara approached it slowly, her weathered hands carrying the traditional calabash filled with honey and milk.

"Every tree tells a story," she whispered to her granddaughter Kaia, "but this one holds the memories of our ancestors."

The ritual of offering had been passed down through generations, each family taking turns to honor the great tree that provided shade for the market, shelter during storms, and wisdom to those who listened.

Kaia watched as her grandmother poured the offering at the base of the tree, the liquid seeping into the rich, dark earth. The old woman's lips moved in silent prayer, words in the ancient language that few still remembered.

"What is she saying, Mama?" Kaia asked her mother in a whisper.

"She's asking the ancestors to bless our harvest and protect our village," her mother replied, placing a gentle hand on Kaia's shoulder. "One day, you'll learn these words too, and you'll carry on this tradition for your own children."`);

  const addComment = () => {
    if (!newComment.trim()) return;
    
    // In a real implementation, this would send the comment to the backend
    console.log('Adding comment:', newComment);
    setNewComment('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-heritage-purple text-white';
      case 'editor': return 'bg-cultural-gold text-white';
      case 'reviewer': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">The Baobab's Memory</h1>
            <Badge variant="secondary">Collaborative Draft</Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {collaborators.slice(0, 3).map((collaborator) => (
                <div key={collaborator.id} className="relative">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={collaborator.avatar} />
                    <AvatarFallback className={getRoleColor(collaborator.role)}>
                      {collaborator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {collaborator.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
            
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-6">
          <Textarea
            value={storyContent}
            onChange={(e) => setStoryContent(e.target.value)}
            className="w-full h-full resize-none font-serif text-lg leading-relaxed"
            placeholder="Start writing your collaborative story..."
          />
        </div>

        {/* Editor Footer */}
        <div className="border-t p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{storyContent.split(' ').length} words</span>
            <span>{storyContent.split('\n\n').length} paragraphs</span>
            <span>Last saved: just now</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Comments ({comments.filter(c => !c.resolved).length})
            </Button>
          </div>
        </div>
      </div>

      {/* Comments & Collaboration Panel */}
      {showComments && (
        <div className="w-80 border-l bg-muted/30">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-4">Collaboration</h3>
            
            {/* Collaborators */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-muted-foreground">Team Members</h4>
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={collaborator.avatar} />
                      <AvatarFallback className={getRoleColor(collaborator.role)}>
                        {collaborator.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {collaborator.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{collaborator.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {collaborator.role} • {collaborator.isOnline ? 'online' : collaborator.lastSeen}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {collaborator.role === 'owner' ? (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    ) : collaborator.role === 'editor' ? (
                      <Edit className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <Eye className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Comments</h4>
              
              {/* Add Comment */}
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="text-sm"
                />
                <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>
                  <Send className="h-3 w-3 mr-1" />
                  Comment
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className="p-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {comment.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium">{comment.userName}</p>
                          <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};
