export function calculateRank(scout_grade: any, max_grade = 100) {
  // Check if scout_grade is null or undefined
  if (scout_grade === null || scout_grade === undefined) {
    return "unranked";
  }

  if (scout_grade < 1 || scout_grade > max_grade) {
    return "unranked";
  }
  
  // Assuming no ties and grades are from 1 to 100
  // Rank is determined by how much the grade is from the perfect score
  return max_grade - scout_grade + 1;
}