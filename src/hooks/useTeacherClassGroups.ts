import { useEffect, useState } from "react";

export interface StudentProfile {
  userId: string;
  userName: string; // <-- Add this
  firstName: string;
  lastName: string;
  email: string;
  submissionSummary?: {
    totalSubmissions: number;
    ungradedSubmissions: number;
    gradedSubmissions: number;
    totalActivities: number;
  };
}


export interface ClassGroupWithStudents {
  classGroupId: string;
  className: string;
  students: StudentProfile[];
}


export const useTeacherClassGroups = () => {
  const [data, setData] = useState<ClassGroupWithStudents[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassGroups = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) return;

        const res = await fetch(`https://localhost:44361/api/Teacher/${username}/students`);
        const result = await res.json();

        // 🆕 Fetch submission summary for each student by username
        for (const group of result) {
          for (const student of group.students) {
            const username = student.userName; // ✅ Get username from student
            if (!username) continue;
        
            try {
              const summaryRes = await fetch(`https://localhost:44361/api/Student/student/summary/${username}`);
              const summaryData = await summaryRes.json();
              student.submissionSummary = summaryData;
            } catch (err) {
              console.error("Error fetching submission summary for:", username);
              student.submissionSummary = {
                totalSubmissions: 0,
                ungradedSubmissions: 0,
                gradedSubmissions: 0,
                totalActivities: 0,
              };
            }
          }
        }

        setData(result);
      } catch (error) {
        console.error("Failed to fetch teacher class groups:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassGroups();
  }, []);

  return { classGroups: data, loading };
};
