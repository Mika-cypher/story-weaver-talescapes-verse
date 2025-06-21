
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  showSkeleton?: boolean;
  aspectRatio?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  showSkeleton = true,
  aspectRatio,
  className,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    if (!error && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ aspectRatio }}>
      {loading && showSkeleton && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100",
          className
        )}
      />
    </div>
  );
};
