import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Interviews() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      const interviewsCollection = collection(db, 'interviews');
      const interviewsSnapshot = await getDocs(interviewsCollection);
      const interviewsList = interviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInterviews(interviewsList);
    };

    fetchInterviews();
  }, []);

  return (
    <div className="interviews">
      <h1>Interviews</h1>
      <ul>
        {interviews.map(interview => (
          <li key={interview.id}>
            <h2>{interview.company}</h2>
            <p>Date: {interview.date}</p>
            <p>Time: {interview.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Interviews;