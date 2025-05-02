interface StudentGrades {
    scores: number[]; // e.g., [30, 90, 70, 100]
    kindnessLevel: number; // e.g., 90 for 90%
  }
  
  export const calculateStudentStats = ({ scores, kindnessLevel }: StudentGrades) => {
    const totalPoints = scores.reduce((acc, val) => acc + val, 0);
    const badges = Math.floor(totalPoints / 10);
    const kindnessScore = `${kindnessLevel}%`;
  
    return { totalPoints, badges, kindnessScore };
  };
  