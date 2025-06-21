
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews, useCreateReview } from '@/hooks/useDiscovery';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReviewSectionProps {
  contentId: string;
  contentType: 'story' | 'song' | 'dialect';
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ contentId, contentType }) => {
  const { user } = useAuth();
  const { data: reviews = [], isLoading } = useReviews(contentId, contentType);
  const createReview = useCreateReview();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const userHasReviewed = reviews.some(review => review.user_id === user?.id);

  const handleSubmitReview = () => {
    if (!user || rating === 0) return;

    createReview.mutate({
      user_id: user.id,
      content_id: contentId,
      content_type: contentType,
      rating,
      review_text: reviewText.trim() || undefined,
    }, {
      onSuccess: () => {
        setShowReviewForm(false);
        setRating(0);
        setReviewText('');
      },
    });
  };

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reviews & Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {user && !userHasReviewed && (
            <div className="mb-6">
              {!showReviewForm ? (
                <Button onClick={() => setShowReviewForm(true)}>
                  Write a Review
                </Button>
              ) : (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Your Rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 cursor-pointer ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <Textarea
                    placeholder="Write your review (optional)..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSubmitReview} 
                      disabled={rating === 0 || createReview.isPending}
                      size="sm"
                    >
                      Submit Review
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowReviewForm(false);
                        setRating(0);
                        setReviewText('');
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.profiles?.avatar_url} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {review.profiles?.display_name || review.profiles?.username || 'Anonymous'}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.review_text && (
                        <p className="text-sm text-muted-foreground">{review.review_text}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSection;
