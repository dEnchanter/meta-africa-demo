export const calculateStarRating = (scoutGrade: number): number => {
  if (scoutGrade >= 90) return 5; // 5 stars
  else if (scoutGrade >= 80) return 4; // 4 stars
  else if (scoutGrade >= 70) return 3; // 3 stars
  else if (scoutGrade >= 60) return 2; // 2 stars
  else if (scoutGrade >= 50) return 1; // 1 star
  return 0; // less than 50 is considered as 0 stars
};