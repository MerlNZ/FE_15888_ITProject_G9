import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface StudentGrade {
  score: number;
}

// Function to determine number of stars based on score
const getStars = (score: number): string => {
  if (score >= 90) return "⭐⭐⭐⭐⭐";
  if (score >= 80) return "⭐⭐⭐⭐";
  if (score >= 70) return "⭐⭐⭐";
  if (score >= 60) return "⭐⭐";
  if (score >= 50) return "⭐";
  return "No Stars";
};

// Function to determine how many badges based on points
// const getBadges = (points: number): string => {
//   const badgeCount = Math.floor(points / 1000);
//   return badgeCount > 0 ? '🏅'.repeat(badgeCount) : "No badges yet";
// };
const getBadges = (points: number): string => {
    const badgeCount = Math.floor(points / 1000);
    const badgePool = ['🏅', '🎖️', '🥇', '🌟', '💎', '🏆'];
  
    let badges = "";
    for (let i = 0; i < badgeCount; i++) {
      const randomBadge = badgePool[Math.floor(Math.random() * badgePool.length)];
      badges += randomBadge;
    }
  
    return badges || "No badges yet";
  };

const StudentScoreWithStars: React.FC = () => {
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
    <div className="p-1 text-center">
      {studentGrade ? (
        <>
          <p className="text-2xl mt-4 font-semibold text-green-600">Stars: {getStars(studentGrade.score)}</p>
          <p className="text-lg font-semibold text-purple-600">Kindness Badges: {getBadges(Math.round(studentGrade.score) * 50)}</p>
          <p className="text-lg font-semibold text-blue-600">Your Points: {Math.round(studentGrade.score) * 50}</p>
          <p className="text-lg font-semibold text-pink-500">💖Kindness Score: {Math.round(studentGrade.score)}%</p>
          <div className="mt-3">
          <div className="flex justify-between text-sm px-2">
          <span className="text-gray-700">Progress</span>
            {/* <span className="font-medium">{Math.round(studentGrade.score)}%</span> */}
          </div>
            <Progress value={studentGrade.score} className="h-2 mt-1" />
        </div>
        </>
      ) : (
        <p className="text-lg font-semibold text-blue-700">Begin your kindness journey — perform activities, earn stars, collect badges, and track your progress!</p>
      )}
    </div>
  );
};

export default StudentScoreWithStars;
