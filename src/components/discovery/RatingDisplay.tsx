
import React from 'react';
import { Star } from 'lucide-react';
import { useAverageRating } from '@/hooks/useDiscovery';

interface RatingDisplayProps {
  contentId: string;
  contentType: string;
  showCount?: boolean;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ contentId, contentType, showCount = true }) => {
  const { data: ratingData, isLoading } = useAverageRating(contentId, contentType);

  if (isLoading || !ratingData) {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-muted-foreground" />
        ))}
        {showCount && <span className="text-sm text-muted-foreground ml-1">No reviews</span>}
      </div>
    );
  }

  const { average, count } = ratingData;
  const fullStars = Math.floor(average);
  const hasHalfStar = average % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
        } else if (i === fullStars && hasHalfStar) {
          return (
            <div key={i} className="relative">
              <Star className="h-4 w-4 text-muted-foreground" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
            </div>
          );
        } else {
          return <Star key={i} className="h-4 w-4 text-muted-foreground" />;
        }
      })}
      {showCount && (
        <span className="text-sm text-muted-foreground ml-1">
          {count > 0 ? `${average.toFixed(1)} (${count} review${count !== 1 ? 's' : ''})` : 'No reviews'}
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
