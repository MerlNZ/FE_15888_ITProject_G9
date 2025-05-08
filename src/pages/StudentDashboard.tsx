import React from 'react';
import { Award, HandHeart, BookOpen, Calendar, Clock, File, Upload, Sparkles, User, Users, ChartBar, MessageSquare, Book, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import { useNavigate } from "react-router-dom"; 
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useStudentActivities } from "@/hooks/useStudentActivities";
import KindnessJournalModal from "@/components/KindnessJournalModal";  // Import the modal component
import { useStudentId } from "@/hooks/useStudentId"; // Your hook to get studentId
import useStudentFeedback from '@/hooks/useStudentFeedback';  // StudentRecentFeedback
import StudentBadges from './StudentBadges';
import StudentScore from './StudentScore';
import StudentStars from './StudentScoreWithStars';

// Sample data for Student dashboard
const studentActivities = [
  { id: 1, title: "Activities", url: "/StudentActivities"},
  { id: 2, title: "Kindness Journal"},
  // { id: 3, title: "Kindness Quest", url: "#"} // KindnessQuest - Future Development 
];

// const studentAchievements = [
//   {
//     id: 1,
//     title: "Math Whiz",
//     description: "Completed 5 math activities with high scores",
//     icon: <Award className="h-8 w-8 text-yellow-500" />
//   },
//   {
//     id: 2,
//     title: "Science Explorer",
//     description: "Finished all science activities for the month",
//     icon: <Award className="h-8 w-8 text-blue-500" />
//   }
// ];

const StudentPageDashboard = ({ userType = "student", userName = "User" }) => {

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}>
    <Header/>  
      <main className="flex-1 py-10"> 
      <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            {/* Stats Section - Role-specific */}
            {userType === "student" ? (
              // <StudentDashboard activities={studentActivities} 
              //  achievements={studentAchievements} 
              // />
              <StudentDashboard activities={studentActivities} 
             
              />
            ) : (
              <div>Teacher Dashboard coming soon!</div> // fallback for now
            )}
          </div>
        </div>
      </main>
    </div>
  );
};



// Student Dashboard Component
  const StudentDashboard = ({ activities }) => {

  const navigate = useNavigate();    
  const { getUpcomingActivities } = useStudentActivities(); //Fetch upcoming activites
  const upcomingTasks = getUpcomingActivities(); //Fetch upcoming activites
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const { studentId } = useStudentId(); // Get the studentId from your custom hook
  const { feedback} = useStudentFeedback(studentId);  // Use the custom hook
  const [achievements, setAchievements] = useState<any[]>([]);


  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal and reset URL hash
  const closeModal = () => {
    setIsModalOpen(false);
    window.history.pushState({}, '', '/Resources'); // Remove hash when closing modal
  };

    // Fetch achievements from the API
    useEffect(() => {
      const fetchAchievements = async () => {
        try {
          const response = await fetch(`https://localhost:44361/api/Certificate/student/${studentId}`);
          const data = await response.json();
          
          // Map over the data to format the date
          const formattedAchievements = data.map((achievement: any) => ({
            ...achievement,
            formattedDate: new Date(achievement.dateIssued).toLocaleDateString('en-GB') // dd/mm/yyyy format
          }));
          
          setAchievements(formattedAchievements);
        } catch (error) {
          console.error("Error fetching achievements:", error);
        }
      };
  
      fetchAchievements();
    }, [studentId]);

  const [profile, setProfile] = useState<any>(null);
  const userName = localStorage.getItem('username');

  //fetch student profile details and upcomming activiites
       useEffect(() => {
        const fetchData = async () => {
          try {
            if (!userName) {
              console.warn("No username found in localStorage");
              return;
            }
      
            // 1. Fetch student profile
            const profileRes = await axios.get(`https://localhost:44361/api/Profile/${userName}`);
            setProfile(profileRes.data.profile);
      
            // 2. Fetch student ID
            const studentRes = await fetch(`https://localhost:44361/api/Student/get-student-id/${userName}`);
            const { studentId } = await studentRes.json();
            localStorage.setItem("studentId", studentId) //store studentID for rewards and other query

         } catch (error) {
            console.error("Error in fetchData:", error);
            
          }
        };
      
        fetchData();
      }, [userName]);
        
      if (!profile) return <div>Loading profile...or Profile not found</div>;

      return (
        <>
          {/* Top Grid Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Section 1 - Activities */}
            <section className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Card className="bg-yellow-100 border-4 border-yellow-300 shadow-lg hover:bg-yellow-100 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <HandHeart className="h-10 w-10 text-red-500" />
                    <span>Learn Kindness</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-4 rounded-lg border bg-yellow-200 hover:bg-yellow-300 transition-all cursor-pointer shadow-md"
                        onClick={() => {
                          if (activity.title === "Kindness Journal") {
                            openModal();
                          } else {
                            navigate(activity.url);
                          }
                        }}
                      >
                        <h3 className="text-2xl font-bold text-blue-500 font-comic">
                          {activity.title}
                        </h3>
                      </div>
                    ))}
                 </div>
                </CardContent>
              </Card>
              
              {/* <Card className="p-2 bg-blue-200 rounded-2xl shadow-lg hover:bg-blue-300 transition-all mt-4">
                <div className="absolute top-0 h-1 w-full bg-accent" />
                <CardHeader className="pb-1">
                  <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span>Grade Level Progress</span>
                      <span className="font-medium">50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </CardContent>
              </Card>
               */}
            </section>
            
      
            {/* Section 2 - Student Profile */}
            <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Card className="bg-blue-100 border-4 border-blue-300 shadow-lg hover:bg-blue-200 transition-all">
                <CardHeader className="flex flex-col items-center">
                  <img src="avatar.jpg" alt="Student Avatar" className="w-20 h-20 rounded-full border-2 border-blue-700 shadow-md" />
                  <CardTitle className="flex items-center gap-2"></CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <h2 className="text-xl font-bold text-blue-800">Hi! {profile.firstName}</h2>
                  <p className="text-gray-600">Email: {profile.email}</p>
                  <StudentStars />
                </CardContent>
              </Card>
            </section>
          </div>
      
          {/* Bottom Grid Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Section 3 - Tasks, Feedback, Progress */}
            <section className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* Upcoming Tasks */}
              <Card className="bg-pink-100 border-4 border-pink-300 shadow-lg hover:bg-pink-200 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  {upcomingTasks.length > 0 ? (
                    <ul className="mt-2 space-y-2 text-left">
                      {upcomingTasks.map((task) => (
                        <li key={task.id} className="flex items-center gap-3 bg-pink-100 p-3 rounded-lg shadow-sm hover:bg-pink-200 transition-all">
                          <span className="text-red-500 text-xl">📌</span>
                          <span className="font-medium text-lg">{task.title}</span>
                          <span className="text-gray-600">— Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm mt-2 text-gray-600">🎉 No pending tasks</p>
                  )}
                </CardContent>
              </Card>
      
              {/* Recent Feedback */}
              <Card className="p-2 bg-orange-200 rounded-2xl shadow-lg hover:bg-orange-300 transition-all mt-4">
                <div className="absolute top-0 h-1 w-full bg-secondary" />
                <CardHeader className="pb-1">
                  <CardTitle>Recent Feedback</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[200px] overflow-y-auto">
                  <div className="text-xl">
                    {feedback.length === 0 ? (
                      <p>No feedback available.</p>
                    ) : (
                      <ul className="mt-2 space-y-1 text-left">
                        {feedback.map((item: any) => (
                          <li key={item.submissionId}>
                            <p>✨ {item.feedback}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
      
              {/* Overall Progress */}
              {/* <Card className="p-2 bg-blue-200 rounded-2xl shadow-lg hover:bg-blue-300 transition-all mt-4">
                <div className="absolute top-0 h-1 w-full bg-accent" />
                <CardHeader className="pb-1">
                  <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span>Grade Level Progress</span>
                      <span className="font-medium">50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </CardContent>
              </Card> */}


            </section>
      
            {/* Section 4 - Achievements */}
            <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Card className="bg-green-100 border-4 border-green-300 shadow-lg hover:bg-green-200 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-10 w-10 text-primary" />
                    <span>Kindness Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-green-200 hover:bg-green-400 transition-all cursor-pointer shadow-md"
                      >
                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-background">
                          <Award className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.formattedDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
      
          {/* Kindness Journal Modal */}
          <KindnessJournalModal isOpen={isModalOpen} closeModal={closeModal} studentId={studentId} />
        </>
      );
}; 

export default StudentPageDashboard;