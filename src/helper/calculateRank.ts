export function calculateRank(scout_grade: any, max_grade = 100) {
  if (scout_grade < 1 || scout_grade > max_grade) {
    throw new Error('Scout grade must be between 1 and ' + max_grade);
  }
  
  // Assuming no ties and grades are from 1 to 100
  // Rank is determined by how much the grade is from the perfect score
  return max_grade - scout_grade + 1;
}