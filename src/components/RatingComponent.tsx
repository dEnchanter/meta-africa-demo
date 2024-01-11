import React from 'react';
import { Star } from 'lucide-react';

type RatingComponentProps = {
  rating: number;
  className?: string; // Optional className prop
};

const RatingComponent: React.FC<RatingComponentProps> = ({ rating, className }) => {
  // Determine the number of full stars
  const fullStars = Math.floor(rating);

  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }, (_, index) => (
        <Star key={`full-${index}`} fill="#facc15" strokeWidth={0} size={20} className={`text-yellow-500 ${className}`} />
      ))}
    </div>
  );
};

export default RatingComponent;
