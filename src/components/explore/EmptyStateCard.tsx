import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, Music, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface EmptyStateCardProps {
  type: 'stories' | 'audio' | 'general';
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  type,
  title,
  description,
  actionText,
  actionLink
}) => {
  const { isLoggedIn } = useAuth();

  const getIcon = () => {
    switch (type) {
      case 'stories':
        return <BookOpen className="h-16 w-16 text-heritage-purple" />;
      case 'audio':
        return <Music className="h-16 w-16 text-heritage-purple" />;
      default:
        return <Sparkles className="h-16 w-16 text-heritage-purple" />;
    }
  };

  return (
    <Card className="text-center py-16 border-dashed border-2">
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-br from-heritage-purple/10 to-cultural-gold/10 rounded-full w-32 h-32 mx-auto flex items-center justify-center">
          {getIcon()}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
        </div>

        <div className="space-y-3 max-w-sm mx-auto">
          <Button size="lg" asChild className="w-full">
            <Link to={isLoggedIn ? actionLink : "/signup"}>
              <Plus className="h-5 w-5 mr-2" />
              {actionText}
            </Link>
          </Button>
          {!isLoggedIn && (
            <p className="text-sm text-muted-foreground">
              Join our community to start sharing your cultural stories
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;