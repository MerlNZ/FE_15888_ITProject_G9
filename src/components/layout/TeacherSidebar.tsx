import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TeacherSidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear username from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        // Redirect to login page
        navigate('/');
    };

    return (
        <aside className="w-64 bg-white border-r p-4 h-screen">
            <div> 
            <img 
  src="/KHLogoTeacher.png" 
  alt="App Logo" 
  className="w-full h-auto object-contain mb-4"
/>
                <h2 className="text-xl font-bold mb-6">Teacher's Dashboard</h2>
                <nav className="flex flex-col space-y-4">
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/TeacherDashboard')}> 🏠 Home</Button>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/myclasses')}> 📚 My Classes</Button>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/activitiespagination')}> 📥 Activities</Button>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/activities/create')}> ➕ Create Activity</Button>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/submission-page')}> 📥 Submissions</Button>
                    {/* <Button variant="ghost" className="justify-start">🗓 Calendar</Button> */}
                </nav>
            </div>
            <div className="mt-10">
                <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleLogout}
                >
                    🔒 Logout
                </Button>
            </div>
        </aside>
    );
};

export default TeacherSidebar;