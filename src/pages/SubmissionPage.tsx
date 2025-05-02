import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import TeacherSidebar from "../components/layout/TeacherSidebar";
import { useTeacherClassGroups, ClassGroupWithStudents } from "@/hooks/useTeacherClassGroups";
import axios from 'axios';

const SubmissionPage: React.FC = () => {
  const { classGroups, loading } = useTeacherClassGroups();
  const [selectedGroup, setSelectedGroup] = useState<ClassGroupWithStudents | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]); // State to store submissions
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Fetch submissions for a specific student
  const fetchSubmissions = async (studentId: string) => {
    setLoadingSubmissions(true);
    try {
      const response = await axios.get(
        `https://localhost:44361/api/Submissions/user/${studentId}/submissions`
      );
      console.log("Fetched submissions for studentId:", studentId, response.data); // Log the fetched submissions to inspect data
      setSubmissions(response.data); // Store fetched submissions in state
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Handle student selection to fetch submissions
  const handleViewSubmissions = (userId: string) => {
    fetchSubmissions(userId);
  };

  // Calculate total, ungraded, and graded submissions for a student
  const getSubmissionDetails = (studentId: string) => {
    const studentSubmissions = submissions.filter(submission => submission.studentId === studentId);
    const totalSubmissions = studentSubmissions.length;

    // Log the submissions for debugging to inspect the structure
    console.log("Submissions for studentId", studentId, studentSubmissions);

    // Ungraded submissions are those with grade <= 0 or grade is undefined/null/empty
    const ungradedSubmissions = studentSubmissions.filter(submission => {
      return submission.grade == null || submission.grade <= 0 || submission.grade === '';
    }).length;
    
    // Graded submissions are those with grade > 0
    const gradedSubmissions = totalSubmissions - ungradedSubmissions;

    return { totalSubmissions, ungradedSubmissions, gradedSubmissions };
  };

  return (
    <div className="flex h-screen">
      <TeacherSidebar />
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Check Student Submissions</h1>

        {loading ? (
          <p>Loading classes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {classGroups.map((group) => (
              <Card
                key={group.classGroupId}
                onClick={() => setSelectedGroup(group)}
                className="cursor-pointer hover:shadow-lg transition"
              >
                <CardContent className="p-4">
                  <h2 className="text-lg font-bold">{group.className}</h2>
                  <p>{group.students.length} students</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedGroup && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Students in {selectedGroup.className}</h2>

            {selectedGroup.students.length > 0 ? (
              <table className="min-w-full bg-white shadow rounded overflow-hidden">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-2">Student Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Ungraded Submissions</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedGroup.students.map((student) => {
                    const { totalSubmissions, ungradedSubmissions, gradedSubmissions } = getSubmissionDetails(student.userId);
                    return (
                      <tr key={student.userId} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{student.firstName} {student.lastName}</td>
                        <td className="px-4 py-2">{student.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {/* Display total, ungraded, and graded submission counts */}
                          {totalSubmissions} total | {ungradedSubmissions} ungraded | {gradedSubmissions} graded
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                            onClick={() => handleViewSubmissions(student.userId)}
                          >
                            👁️ View Submissions
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No students in this class group.</p>
            )}
          </div>
        )}

        {/* Show submissions when a student is selected */}
        <div className="mt-6">
          {loadingSubmissions ? (
            <p>Loading submissions...</p>
          ) : (
            <div>
              <h3 className="text-xl font-bold">Student Submissions</h3>
              <ul className="mt-2 space-y-2">
                {submissions.map((submission) => (
                  <li key={submission.submissionId} className="border p-4 rounded shadow">
                    <h4 className="font-semibold">Activity: {submission.activityId}</h4>
                    <p>Feedback: {submission.feedback}</p>
                    <p>Grade: {submission.grade}</p>
                    <p>Status: {submission.isSubmitted ? "Submitted" : "Not Submitted"}</p>
                    <p>Student Comment: {submission.studentComment}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubmissionPage;
