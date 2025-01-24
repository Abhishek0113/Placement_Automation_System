import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export default function JobProfiles() {
  const [jobPostings, setJobPostings] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobPostingsCollection = collection(db, 'jobPostings');
        const jobPostingsSnapshot = await getDocs(jobPostingsCollection);
        const jobPostingsList = jobPostingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJobPostings(jobPostingsList);

        if (user) {
          const studentDocRef = doc(db, 'students', user.uid);
          const studentSnapshot = await getDoc(studentDocRef);
          if (studentSnapshot.exists()) {
            setStudentData(studentSnapshot.data());
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const analyzeSkills = (jobSkills) => {
    if (!studentData?.skills || !jobSkills) return { strengths: [], areasOfImprovement: [] };

    const jobSkillsArray = (typeof jobSkills === 'string' ? jobSkills.split(',') : jobSkills)
      .map(skill => skill.trim().toLowerCase());

    const studentSkills = studentData.skills.map(skill => skill.toLowerCase());

    const strengths = studentSkills.filter(skill => 
      jobSkillsArray.includes(skill)
    );

    const areasOfImprovement = jobSkillsArray.filter(skill => 
      !studentSkills.includes(skill)
    );

    return { strengths, areasOfImprovement };
  };

  if (loading) {
    return <div className="loading">Loading job profiles...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="job-profiles">
      <h1>Job Profiles</h1>
      {jobPostings.length === 0 ? (
        <p className="no-jobs">No job postings available at the moment.</p>
      ) : (
        <div className="job-list">
          {jobPostings.map(posting => {
            const { strengths, areasOfImprovement } = analyzeSkills(posting.preferredSkills);

            return (
              <div key={posting.id} className="job-card">
                <div className="job-content">
                  <div className="job-details">
                    <h2>{posting.companyName}</h2>
                    <p className="job-description">{posting.jobDescription}</p>

                    <div className="required-skills">
                      <h3>Required Skills:</h3>
                      <div className="skill-tags">
                        {(typeof posting.preferredSkills === 'string' 
                          ? posting.preferredSkills.split(',') 
                          : posting.preferredSkills
                        ).map(skill => (
                          <span key={skill} className="skill-tag">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="skills-analysis">
                    <h3>Your Skills:</h3>

                    <div className="skills-section">
                      <h4 className="strengths">Strengths</h4>
                      {strengths.length > 0 ? (
                        <ul className="skill-list">
                          {strengths.map(skill => (
                            <li key={skill} className="strength-item">
                              <span className="check-mark">✓</span>
                              {skill}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-skills">No matching skills</p>
                      )}
                    </div>

                    <div className="skills-section">
                      <h4 className="improvements">Areas for Improvement</h4>
                      {areasOfImprovement.length > 0 ? (
                        <ul className="skill-list">
                          {areasOfImprovement.map(skill => (
                            <li key={skill} className="improvement-item">
                              <span>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-skills">You have all required skills!</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="job-action">
                  <button className="apply-button">Applied</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style jsx>{`
        .job-profiles {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: #1e293;
        }
        .job-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .job-card {
          background-color: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }
        .job-card:hover {
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .job-content {
          display: flex;
          gap: 2rem;
        }
        .job-details {
          flex: 1;
        }
        h2 {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .job-description {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 1.5rem;
        }
        h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #444;
        }
        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .skill-tag {
          background-color: #f0f0f0;
          color: #333;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.9rem;
        }
        .skills-analysis {
          width: 300px;
          background-color: #f8f9fa;
          border-radius: 0.5rem;
          padding: 1.5rem;
        }
        .skills-section {
          margin-bottom: 1.5rem;
        }
        h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .strengths {
          color: #28a745;
        }
        .improvements {
          color: #ffa500;
        }
        .skill-list {
          list-style-type: none;
          padding: 0;
        }
        .strength-item, .improvement-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .check-mark {
          color: #28a745;
          margin-right: 0.5rem;
        }
        .job-action {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
        }
        .apply-button {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .apply-button:hover {
          background-color: #5a6268;
        }
        .loading, .error, .no-jobs {
          text-align: center;
          font-size: 1.2rem;
          color: #666;
          margin-top: 2rem;
        }
        .error {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
}