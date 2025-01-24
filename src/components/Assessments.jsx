import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Assessments() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      const assessmentsCollection = collection(db, 'assessments');
      const assessmentsSnapshot = await getDocs(assessmentsCollection);
      const assessmentsList = assessmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssessments(assessmentsList);
    };

    fetchAssessments();
  }, []);

  return (
    <div className="assessments">
      <h1>Assessments</h1>
      <ul>
        {assessments.map(assessment => (
          <li key={assessment.id}>
            <h2>{assessment.title}</h2>
            <p>Due Date: {assessment.dueDate}</p>
            <p>Status: {assessment.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Assessments;