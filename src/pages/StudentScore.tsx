import React, { useState, useEffect } from 'react';

interface StudentGrade {
  score: number;
}

const StudentScore: React.FC = () => {
  const [studentGrade, setStudentGrade] = useState<StudentGrade | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        if (!username) return;

        const responsestd = await fetch(`https://localhost:44361/api/Student/get-student-id/${username}`);
        if (!responsestd.ok) throw new Error("Failed to get student ID");
        const { studentId } = await responsestd.json();

        const response = await fetch(`https://localhost:44361/api/Grade/upcoming/${studentId}`);
        if (!response.ok) throw new Error("No Grades Available Yet");

        const data = await response.json();
        setStudentGrade(data);
      } catch (error) {
        console.error("Error fetching grade:", error);
      }
    };

    if (username) {
      fetchGrade();
    }
  }, [username]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Your Points:</h2>
      {studentGrade ? (
        <p className="text-4xl text-purple-700 font-semibold">{studentGrade.score}</p>
      ) : (
        <p>Loading your score...</p>
      )}
    </div>
  );
};

export default StudentScore;
