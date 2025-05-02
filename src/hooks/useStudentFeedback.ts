//This will display the recent feedback from the teacher.
//showing on specific student dashboard

import { useState, useEffect } from 'react';

const useStudentFeedback = (studentId: string) => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`https://localhost:44361/api/Submissions/feedback/${studentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const data = await response.json();
        setFeedback(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchFeedback();
    }
  }, [studentId]);

  return { feedback, loading, error };
};

export default useStudentFeedback;