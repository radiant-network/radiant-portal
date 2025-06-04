import { Star } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/utils';

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating?: number;
  numberOfStars?: number;
  starSize?: number;
}

function Rating({ rating = 0, numberOfStars = 4, starSize = 16, className, ...props }: RatingProps) {
  const stars = Array.from({ length: numberOfStars }, (_, index) => {
    const starRating = index + 1;
    const isFilled = starRating <= rating;

    return (
      <Star
        key={index}
        size={starSize}
        className={cn('text-bookmark-off', {
          'text-bookmark-amber fill-bookmark-amber': isFilled,
        })}
      />
    );
  });

  return (
    <div className={cn('flex items-center gap-px', className)} {...props}>
      {stars}
    </div>
  );
}

export default Rating;
