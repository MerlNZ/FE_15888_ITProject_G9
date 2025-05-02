import React, { useEffect, useState } from 'react';
import useStudentFeedback from '@/hooks/useStudentFeedback'; // Import your custom hook

const TestStudentFeedbackPage = () => {
  
  const [studentId, setStudentId] = useState<string>(''); // You can set this to a test student ID
  const { feedback, loading, error } = useStudentFeedback(studentId); // Use the custom hook

  // For testing purposes, manually set a studentId (you can replace this with any valid ID)
  useEffect(() => {
    // Manually setting a test student ID (replace with a valid studentId)
    setStudentId('EE08B5AF-2371-43E0-8979-91B6BA6482B3');
  }, []);

  // Handling loading and error states
  if (loading) return <div>Loading feedback...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Student Feedback Test</h1>

      {feedback.length === 0 ? (
        <p>No feedback found for this student.</p>
      ) : (
        <div>
          <h2>Recent Feedback:</h2>
          <ul>
            {feedback.map((item: any) => (
              <li key={item.SubmissionId}>
                <h4>Activity ID: {item.ActivityId}</h4>
                <p><strong>Feedback:</strong> {item.Feedback}</p>
                <p><strong>Grade:</strong> {item.Grade}</p>
                <p><strong>Student Comment:</strong> {item.StudentComment}</p>
                <p><strong>Submitted on:</strong> {new Date(item.SubmissionDate).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestStudentFeedbackPage;
