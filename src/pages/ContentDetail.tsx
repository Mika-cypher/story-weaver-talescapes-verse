
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { africanStories, africanSongs, africanDialects } from '@/data/culturalData';
import RatingDisplay from '@/components/discovery/RatingDisplay';
import AddToListButton from '@/components/discovery/AddToListButton';
import ReviewSection from '@/components/discovery/ReviewSection';

const ContentDetail: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();

  if (!type || !id) {
    return <Navigate to="/archive" replace />;
  }

  let content: any = null;
  let contentType: 'story' | 'song' | 'dialect' = 'story';

  if (type === 'story') {
    content = africanStories.find(story => story.id.toString() === id);
    contentType = 'story';
  } else if (type === 'song') {
    content = africanSongs.find(song => song.id.toString() === id);
    contentType = 'song';
  } else if (type === 'dialect') {
    content = africanDialects.find(dialect => dialect.id.toString() === id);
    contentType = 'dialect';
  }

  if (!content) {
    return <Navigate to="/archive" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-6">
                {content.imageUrl && (
                  <div className="w-full md:w-64 aspect-video md:aspect-square">
                    <img 
                      src={content.imageUrl} 
                      alt={content.title || content.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{content.region}</Badge>
                    <Badge variant="outline">{content.tribe}</Badge>
                  </div>
                  <CardTitle className="text-3xl mb-4">{content.title || content.name}</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                    <RatingDisplay contentId={id} contentType={contentType} />
                    <AddToListButton contentId={id} contentType={contentType} />
                  </div>
                  <p className="text-muted-foreground">{content.description}</p>
                  
                  {contentType === 'dialect' && content.examplePhrases && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Example Phrases</h3>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <ul className="space-y-2">
                          {content.examplePhrases.map((phrase: any, index: number) => (
                            <li key={index} className="flex justify-between items-center">
                              <span className="font-medium">{phrase.native}</span>
                              <span className="text-muted-foreground">{phrase.english}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Speakers: {content.speakerCount}
                      </p>
                    </div>
                  )}
                  
                  {(contentType === 'story' || contentType === 'song') && content.likes && (
                    <p className="text-sm text-muted-foreground mt-4">
                      {content.likes} people have engaged with this {contentType}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="mt-8">
            <ReviewSection contentId={id} contentType={contentType} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContentDetail;
