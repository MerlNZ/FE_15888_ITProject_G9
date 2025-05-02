import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Info } from "lucide-react";

interface GradeInfo {
  letterGrade: string;
  classLevel: string;
  marks: string;
}

const gradeRanges: GradeInfo[] = [
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

interface StudentGrade {
  score: number;
}

const getGradeInfo = (score: number): GradeInfo => {
  return gradeRanges.find(grade => {
    if (grade.marks === '-') return false;
    const [min, max] = grade.marks.split('-').map(Number);
    return score >= min && score <= max;
  }) || gradeRanges[gradeRanges.length - 1]; // Default to last grade if no match found
};

const StudentGrades: React.FC = () => {
  const [studentGrade, setStudentGrade] = useState<StudentGrade | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
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
        if (!response.ok) throw new Error('No Grades Available Yet');
        const data = await response.json();
        setStudentGrade(data);
      } catch (error) {
        console.error('No Grades Available or Error fetching grade:', error);
        toast({
          title: "No Grades Available",
          variant: "destructive",
          duration: 1000,
        });
      }
    };

    if (username) {
      fetchGrade();
    }
  }, [username, toast]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
           <h2 className="text-2xl font-bold text-yellow-700 flex items-center gap-2 mb-2">
             <FileText className="h-6 w-6" />
             My Kindness Level
           </h2>
          <Card className="transform transition-all duration-300 hover:scale-[1.02]">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="text-center">
                <div className="flex items-center justify-center gap-6">
                  <div className="bg-purple-100 rounded-full p-8 shadow-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {/* {getGradeInfo(studentGrade.score).classLevel} */}
                      {studentGrade && studentGrade.score ? getGradeInfo(studentGrade.score).classLevel : <span role="img" aria-label="smiling face" className="text-yellow-500 text-5xl">
                      😊
                    </span>}   
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-medium text-gray-700">
                      {studentGrade && studentGrade.score ? getGradeInfo(studentGrade.score).letterGrade : "Your Kindness Level is on its way!" }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      

      {/* Button to open modal */}
      <button
        onClick={() => setShowModal(true)}
        className="text-blue-700 font-bold underline flex items-center gap-1 hover:text-blue-900"
      >
        <Info className="h-5 w-5" />
        Grading System Information
      </button>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-lg font-bold text-red-600"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Grade Scale Reference</h3>
            <Card className="shadow-sm">
              <div className="grid grid-cols-3 bg-gray-100 font-semibold text-gray-700 border-b">
                <div className="p-3">Kindness Phrase</div>
                <div className="p-3">🏅 Kindness Level</div>
                <div className="p-3">Effort Score Range</div>
              </div>
              {gradeRanges.map((grade, index) => (
                <div
                  key={grade.letterGrade}
                  className={`grid grid-cols-3 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-blue-50 transition-colors`}
                >
                  <div className="p-3 border-b font-medium text-purple-600">{grade.letterGrade}</div>
                  <div className="p-3 border-b">{grade.classLevel}</div>
                  <div className="p-3 border-b">{grade.marks}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGrades;
