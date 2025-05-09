import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import TeacherSidebar from "../components/layout/TeacherSidebar";
import { useTeacherClassGroups, ClassGroupWithStudents } from "@/hooks/useTeacherClassGroups";
import axios from 'axios';

const SubmissionPage: React.FC = () => {
  const { classGroups, loading } = useTeacherClassGroups();
  const [selectedGroup, setSelectedGroup] = useState<ClassGroupWithStudents | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [activityTitles, setActivityTitles] = useState<{ [key: string]: string }>({});
  const [selectedStudentName, setSelectedStudentName] = useState<string | null>(null);
  const [submissionSummary, setSubmissionSummary] = useState<{
    [username: string]: {
      totalSubmissions: number;
      ungradedSubmissions: number;
      gradedSubmissions: number;
      totalActivities: number;
    };
  }>({});

  const fetchSubmissions = async (studentId: string) => {
    setLoadingSubmissions(true);
    try {
      const response = await axios.get(
        `https://localhost:44361/api/Submissions/user/${studentId}/submissions`
      );
      const submissionsData = response.data;
      setSubmissions(submissionsData);

      const activityIds = [...new Set(submissionsData.map((s: any) => s.activityId))];
      const activityResponses = await Promise.all(
        activityIds.map(id => axios.get(`https://localhost:44361/api/activities/activitychanges/${id}`))
      );
      const titlesMap: { [key: string]: string } = {};
      activityResponses.forEach((res, index) => {
        titlesMap[activityIds[index]] = res.data.title || "Untitled";
      });
      setActivityTitles(titlesMap);

    } catch (error) {
      console.error("Error fetching submissions or activity titles:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleViewSubmissions = (userId: string, fullName: string) => {
    setSelectedStudentName(fullName);
    fetchSubmissions(userId);
  };

  // const fetchSubmissionSummary = async (username: string) => {
  //   try {
  //     const res = await axios.get(`https://localhost:44361/api/Student/student/summary/${username}`);
  //           setSubmissionSummary(prev => ({
  //       ...prev,
  //       [username]: res.data,
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching summary:", error);
  //   }
  // };

  useEffect(() => {
    if (selectedGroup) {
      selectedGroup.students.forEach(student => {
        // fetchSubmissionSummary(student.userName);
      });
    }
  }, [selectedGroup]);

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
                onClick={() => {
                  setSelectedGroup(group);
                  setSubmissions([]);
                  setSelectedStudentName(null);
                }}
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
                    <th className="px-4 py-2">Submission Summary</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                {/* <tbody>
                  {selectedGroup.students.map((student) => {
                    const summary = submissionSummary[student.userName];
                    return (
                      <tr key={student.userId} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{student.firstName} {student.lastName} </td>
                        <td className="px-4 py-2">{student.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {summary ? (
                            <>
                      {summary.totalSubmissions} submitted | {summary.ungradedSubmissions} ungraded |
                      {summary.gradedSubmissions} graded | {summary.totalActivities} Total Activities
                            </>
                          ) : (
                            "Loading..."
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                            onClick={() => handleViewSubmissions(student.userId, `${student.firstName} ${student.lastName}`)}
                          >
                            👁️ View Submissions 
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody> */}
                <tbody>
  {selectedGroup.students.map((student) => {
    const summary = student.submissionSummary; // ✅ read directly from student

    return (
      <tr key={student.userId} className="border-t hover:bg-gray-50">
        <td className="px-4 py-2">{student.firstName} {student.lastName}</td>
        <td className="px-4 py-2">{student.email}</td>
        <td className="px-4 py-2 text-sm text-gray-700">
          {summary ? (
            <>
              {summary.totalSubmissions} submitted | {summary.ungradedSubmissions} ungraded |{" "}
              {summary.gradedSubmissions} graded | {summary.totalActivities} Total Activities
            </>
          ) : (
            "Loading..."
          )}
        </td>
        <td className="px-4 py-2">
          <button
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
            onClick={() =>
              handleViewSubmissions(student.userId, `${student.firstName} ${student.lastName}`)
            }
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

        <div className="mt-6">
          {loadingSubmissions ? (
            <p>Loading submissions...</p>
          ) : (
            <div>
              {selectedStudentName && (
                <h3 className="text-xl font-bold mb-2">
                  {selectedStudentName}'s submissions:
                </h3>
              )}
              <ul className="mt-2 space-y-2">
                {submissions.length === 0 ? (
                  <p className="text-gray-600 italic">No submissions yet for this student.</p>
                ) : (
                  submissions.map((submission) => (
                    <li key={submission.submissionId} className="border p-4 rounded shadow">
                      <h4 className="font-semibold">
                        Activity: {activityTitles[submission.activityId] || submission.activityId}
                      </h4>
                      <p>Feedback: {submission.feedback}</p>
                      <p>Grade: {submission.grade}</p>
                      <p>Status: {submission.isSubmitted ? "Submitted" : "Not Submitted"}</p>
                      <p>Student Comment: {submission.studentComment}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubmissionPage;
