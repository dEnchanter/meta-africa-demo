import React from 'react';
import { Star } from 'lucide-react';

type RatingComponentProps = {
  rating: number;
  className?: string; // Optional className prop
};

const RatingComponent: React.FC<RatingComponentProps> = ({ rating, className }) => {
  // Determine the number of full stars
  const fullStars = Math.floor(rating);
  // Determine if there is a half star
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  // Determine the number of empty stars
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }, (_, index) => (
        <Star key={`full-${index}`} className={`text-yellow-500 ${className}`} />
      ))}
      {halfStar === 1 && (
        <Star key="half" className={`text-yellow-500 ${className}`} fill="none" />
      )}
      {Array.from({ length: emptyStars }, (_, index) => (
        <Star key={`empty-${index}`} className={`text-gray-300 ${className}`} fill="none" />
      ))}
    </div>
  );
};

export default RatingComponent;
