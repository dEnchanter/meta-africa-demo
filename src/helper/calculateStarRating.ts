export type PlayerRatings = {
  regional_rank: number;
  position_rank: number;
  country_rank: number;
};

export const calculateStarRating = (ratings: PlayerRatings): number => {
  // Normalize ranks (assuming 1 is highest rank and 100 is lowest)
  const maxRank = 100; // This should be the maximum possible rank value
  const normalizedRegional = (maxRank - ratings.regional_rank) / maxRank;
  const normalizedPosition = (maxRank - ratings.position_rank) / maxRank;
  const normalizedCountry = (maxRank - ratings.country_rank) / maxRank;

  // Calculate average of the normalized values
  const averageNormalized = (normalizedRegional + normalizedPosition + normalizedCountry) / 3;

  // Convert to a 1-5 scale, rounding to nearest half-star
  const starRating = Math.max(1, Math.round(averageNormalized * 5 * 2) / 2);

  return starRating;
};