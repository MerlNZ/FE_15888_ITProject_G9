import React, { useEffect, useState } from "react";
import Header from '@/components/layout/Header';
import StudentGrades from './StudentGrades';
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";

interface Activity {
  activityId: string;
  title: string;
  description: string;
  dueDate: string;
  pdfUrl: string;
  teacherPdfUrl: string;
  isSubmitted: boolean;
  submissionUrl?: string;
  submissionDate?: string;
  feedback?: string;
  grade?: number;
  studentcomment?: string;
}

const StudentActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [username, setUsername] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [studentcomment, setStudentComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);


  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    setUsername(storedUsername);

    if (storedUsername) {
      fetch(`https://localhost:44361/api/student/${storedUsername}/activities-with-submission`)
        .then(res => res.json())
        .then(data =>
        //  console.log(data)
          setActivities(data)
          
          )
        .catch(err => console.error("Failed to fetch activities", err));
    }
  }, []);

  const getUpcomingActivities = () => {
    const now = new Date();
    return activities.filter(a => new Date(a.dueDate) > now);
  };

  const handleActivitySubmit = async () => {
    if (!file || !selectedActivity) return alert("Please upload a file");
  
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      // Upload file
      const formData = new FormData();
      formData.append("file", file);
      const fileRes = await fetch("https://localhost:44361/api/upload", {
        method: "POST",
        body: formData
      });
  
      if (!fileRes.ok) throw new Error("File upload failed");
      const { downloadUrl } = await fileRes.json();
  
      // Get student ID
      const response = await fetch(`https://localhost:44361/api/Student/get-student-id/${username}`);
      if (!response.ok) throw new Error("Failed to get student ID");
      const { studentId } = await response.json();
  
      // Submit activity
      const endpoint = isResubmitting
        ? "https://localhost:44361/api/Submissions/resubmit"
        : "https://localhost:44361/api/Submissions/submit";
  
      const submitRes = await fetch(endpoint, {
        method: isResubmitting ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: selectedActivity.activityId,
          studentId,
          pdfUrl: downloadUrl,
          studentComment: studentcomment
        })
      });
  
      if (!submitRes.ok) throw new Error("Submission failed");
  
      // Only if all previous requests were successful:
      
      // 1. Fetch updated activities
      const activitiesRes = await fetch(`https://localhost:44361/api/student/${username}/activities-with-submission`);
      if (!activitiesRes.ok) throw new Error("Failed to refresh activities");
      const updatedActivities = await activitiesRes.json();
      
      // 2. Update state and show success message
      setActivities(updatedActivities);

      alert(isResubmitting ? "Resubmitted successfully!" : "Submitted successfully!");
      // 3. Reset form state
      setSelectedActivity(null);
      setFile(null);
      setStudentComment("");
      
    } catch (error) {
      console.error("Submission error:", error);
      // toast.error("Failed to submit activity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#FFDAB9] via-[#98FB98] to-[#00FFFF]">
      <Header isLoggedIn={true} userType="student" userName={username} />

<main className="flex-1 py-8">
  <div className="container px-4 md:px-6">
  <h2 className="text-2xl font-bold text-purple-700 mb-4">📚 My Activities</h2>
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* LEFT COLUMN: Scrollable Activity List */}
      
      <div className="w-full md:w-2/3 h-[70vh] overflow-y-auto space-y-6 pr-2">
      
        {activities.length === 0 ? (
          <p className="text-center text-gray-600">No activities available.</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.activityId} className="bg-white p-4 rounded-xl shadow border border-yellow-300">
              <h3 className="text-lg font-semibold text-purple-800">{activity.title}</h3>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <div className="mt-2 text-sm">
                📅 <strong>Due:</strong> {new Date(activity.dueDate).toLocaleDateString()}<br />
                📄 <a href={activity.teacherPdfUrl} target="_blank" className="text-blue-600 underline">Download Instructions</a>
              </div>

              <div className="mt-2">
                {activity.isSubmitted ? (
                  <div className="text-green-700 text-sm">
                    ✅ Submitted on {new Date(activity.submissionDate || "").toLocaleDateString()}
                    {activity.grade !== null && <p>📊 Grade: <strong>{activity.grade}</strong></p>}
                    {activity.feedback && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-700">🗣️ Teacher's Feedback:</p>
                        <p className="text-gray-600 mt-1 italic">{activity.feedback}</p>
                      </div>
                    )}
                    {activity.studentcomment && <p>📝 Your Comment: <em>{activity.studentcomment}</em></p>}
                    {!activity.feedback && new Date(activity.dueDate) >= new Date() && (
                      <button
                        className="mt-2 text-blue-600 underline"
                        onClick={() => {
                          setSelectedActivity(activity);
                          setIsResubmitting(true);
                        }}
                      >
                        🔁 Resubmit Activity
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-red-600 text-sm">🚨 Not submitted yet</p>
                    <button
                      className="mt-2 text-blue-600 underline"
                      onClick={() => {
                        setSelectedActivity(activity);
                        setIsResubmitting(false);
                      }}
                    >
                      ✏️ Submit This Activity
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* RIGHT COLUMN: Grades + Upcoming Activities */}
      <div className="w-full md:w-1/3 space-y-6">
        {/* Grading Info */}
        <div className="bg-white p-4 rounded-xl shadow border border-yellow-300">
          {/* <h1 className="text-xl font-bold text-yellow-700 flex items-center gap-2">
            <FileText className="h-5 w-5" /> My Current Grade
          </h1> */}
          <div className="mt-2">
            <StudentGrades />
          </div>
        </div>

        {/* Grading System Info */}
        {/* <Accordion type="single" collapsible>
          <AccordionItem value="grading-system-info">
            <AccordionTrigger className="text-md font-medium text-blue-700">
              📊 Grading System Information
            </AccordionTrigger>
            <AccordionContent>
              <StudentGrades />
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}

        {/* Upcoming Activities */}
        <div className="bg-white p-4 rounded-xl shadow border border-green-300">
          <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
            ⏰ Upcoming Activities
          </h2>
          <ul className="list-disc pl-5 mt-3 text-sm text-gray-700 space-y-2 max-h-60 overflow-y-auto">
            {getUpcomingActivities().map((a) => (
              <li key={a.activityId}>
                {a.title} – Due {new Date(a.dueDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  </div>
</main>


      {/* Modal for Activity Submission */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl relative">
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-3 right-4 text-lg font-bold text-red-600"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-aqua-700 mb-2">{selectedActivity.title}</h2>
            <p className="text-sm text-gray-700">{selectedActivity.description}</p>
            <p className="text-sm mt-2">
              📅 Due: <strong>{new Date(selectedActivity.dueDate).toLocaleDateString()}</strong>
            </p>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-1">Upload Your Work</label>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-semibold mb-1">Student Comment</label>
              <textarea
                className="w-full border rounded p-2 bg-gray-50"
                placeholder="Optional message for your teacher"
                value={studentcomment}
                onChange={(e) => setStudentComment(e.target.value)}
              />
            </div>

            <button 
              onClick={handleActivitySubmit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (isResubmitting ? "Resubmitting..." : "Submitting...")
                : (isResubmitting ? "Resubmit Activity" : "Submit Activity")}
            </button>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default StudentActivities;