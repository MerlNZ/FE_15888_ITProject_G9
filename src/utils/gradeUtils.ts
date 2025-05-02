export interface GradeInfo {
    letterGrade: string;
    classLevel: string;
    marks: string;
  }
  
  export const gradeRanges: GradeInfo[] = [
    { letterGrade: '🌟 Amazing Effort!', classLevel: 'Kindness Hero', marks: '90-100' },
    { letterGrade: '✨ You’re Shining Bright!', classLevel: 'Kindness Champion', marks: '85-89.99' },
    { letterGrade: '💪 Keep Growing Strong!', classLevel: 'Kindness Leader', marks: '80-84.99' },
    { letterGrade: '🌈 Great Job, Keep It Up!', classLevel: 'Kindness Explorer', marks: '75-79.99' },
    { letterGrade: '😊 You’re Doing Well!', classLevel: 'Kindness Starter', marks: '70-74.99' },
    { letterGrade: '👍 Keep Practicing!', classLevel: 'Learning Helper', marks: '65-69.99' },
    { letterGrade: '🌻 You’re Growing Every Day!', classLevel: 'Kindness Learner', marks: '60-64.99' },
    { letterGrade: '💡 You’re Making Progress!', classLevel: 'Kindness Beginner', marks: '55-59.99' },
    { letterGrade: '🌱 Let’s Try Again Together!', classLevel: 'Kindness Seedling', marks: '50-54.99' },
    { letterGrade: '💗 We Understand You Tried', classLevel: 'Kindness Pass (AG)', marks: '-' },
    { letterGrade: '🤝 Participation Acknowledged', classLevel: 'Ungraded Kindness Pass', marks: '-' }
  ];
  
  export const getGradeInfo = (score: number): GradeInfo => {
    return gradeRanges.find(grade => {
      if (grade.marks === '-') return false;
      const [min, max] = grade.marks.split('-').map(Number);
      return score >= min && score <= max;
    }) || gradeRanges[gradeRanges.length - 1];
  };
  