/**
 * Calculates age based on a date of birth
 * @param dateOfBirth - Date object for the date of birth
 * @returns Age in years as a number
 */
export const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDifference = today.getMonth() - dateOfBirth.getMonth();
  
  // If birth month is later in the year or 
  // if birth month is the same but birth day is later in the month
  if (
    monthDifference < 0 || 
    (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }
  
  return age;
}; 