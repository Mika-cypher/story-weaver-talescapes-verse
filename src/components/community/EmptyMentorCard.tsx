import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const EmptyMentorCard: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-16">
      <Card className="text-center border-dashed border-2">
        <CardHeader>
          <div className="bg-gradient-to-br from-heritage-purple/10 to-cultural-gold/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <GraduationCap className="h-10 w-10 text-heritage-purple" />
          </div>
          <CardTitle>Become a Mentor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Share your storytelling expertise and help preserve African cultural heritage by guiding new writers.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to={isLoggedIn ? "/community" : "/signup"}>
                <Plus className="h-4 w-4 mr-2" />
                Apply to Mentor
              </Link>
            </Button>
            {!isLoggedIn && (
              <p className="text-xs text-muted-foreground">
                Sign up to start mentoring
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="text-center border-dashed border-2">
        <CardHeader>
          <div className="bg-gradient-to-br from-heritage-purple/10 to-cultural-gold/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-10 w-10 text-heritage-purple" />
          </div>
          <CardTitle>Find a Mentor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Connect with experienced storytellers to learn authentic cultural storytelling techniques and grow your craft.
          </p>
          <div className="space-y-2">
            <Button variant="outline" asChild className="w-full">
              <Link to={isLoggedIn ? "/community" : "/signup"}>
                <GraduationCap className="h-4 w-4 mr-2" />
                Explore Mentors
              </Link>
            </Button>
            {!isLoggedIn && (
              <p className="text-xs text-muted-foreground">
                Sign up to connect with mentors
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyMentorCard;