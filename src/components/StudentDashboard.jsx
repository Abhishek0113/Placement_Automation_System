import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import './StudentDashboard.css';

function StudentDashboard() {
  const [user] = useAuthState(auth);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [skillsData, setSkillsData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    collegeName: '',
    rollNumber: '',
    skills: '',
    internshipExperience: false,
    internships: [],
  });

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        doc(db, "students", user.uid),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setStudentData(data);
            updateSkillsData(data);
            setFormData({
              fullName: data.fullName || '',
              collegeName: data.collegeName || '',
              rollNumber: data.rollNumber || '',
              skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
              internshipExperience: data.internshipExperience || false,
              internships: data.internships || [],
            });
          } else {
            console.log("No such document!");
            initializeStudentDocument();
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching student data:", error);
          setError("Failed to fetch data. Please try again.");
          setLoading(false);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  const initializeStudentDocument = async () => {
    try {
      const initialData = {
        email: user.email,
        githubLink: "",
        hackathonCount: 0,
        resume: null,
        internshipExperience: false,
        internships: [],
        fullName: "",
        collegeName: "",
        rollNumber: "",
        skills: [],
      };
      await updateDoc(doc(db, "students", user.uid), initialData);
    } catch (error) {
      console.error("Error initializing student document:", error);
      setError("Failed to initialize your profile. Please try again.");
    }
  };

  const updateSkillsData = (data) => {
    const newSkillsData = [
      { name: "Resume", value: data.resume ? 20 : 0 },
      { name: "GitHub", value: data.githubLink ? 30 : 0 },
      { name: "Hackathons", value: Math.min(data.hackathonCount * 10, 20) },
      { name: "Internships", value: data.internshipExperience ? 30 : 0 },
    ];
    setSkillsData(newSkillsData);
  };

  const handleResumeUpload = async () => {
    if (resumeFile && user) {
      setUploading(true);
      setError(null);
      const storageRef = ref(storage, `resumes/${user.uid}/${resumeFile.name}`);
      try {
        await uploadBytes(storageRef, resumeFile);
        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(doc(db, "students", user.uid), {
          resume: downloadURL,
        });
        alert("Resume uploaded successfully!");
      } catch (error) {
        console.error("Error uploading resume:", error);
        setError("Failed to upload resume. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleInputChange = async (field, value) => {
    if (user) {
      setError(null);
      try {
        await updateDoc(doc(db, "students", user.uid), {
          [field]: value,
        });
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
        setError(`Failed to update ${field}. Please try again.`);
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "students", user.uid), {
        fullName: formData.fullName,
        collegeName: formData.collegeName,
        rollNumber: formData.rollNumber,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        internshipExperience: formData.internshipExperience,
        internships: formData.internships,
      });
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addInternship = () => {
    setFormData(prev => ({
      ...prev,
      internships: [...prev.internships, { companyName: '', from: '', to: '', workDone: '' }]
    }));
  };

  const handleInternshipChange = (index, field, value) => {
    const updatedInternships = formData.internships.map((internship, i) =>
      i === index ? { ...internship, [field]: value } : internship
    );
    setFormData(prev => ({ ...prev, internships: updatedInternships }));
  };

  const calculatePlacementScore = () => {
    return skillsData.reduce((total, skill) => total + skill.value, 0);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899"];
  const placementScore = calculatePlacementScore();

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="dashboard-content">
        <div className="profile-section">
          <div className="section-header">
            <h2>Your Profile</h2>
            <button 
              className="edit-button"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editMode ? (
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>College Name:</label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleFormChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Roll Number:</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleFormChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Skills (comma-separated):</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleFormChange}
                  className="form-input"
                  placeholder="e.g., JavaScript, React, Python"
                />
              </div>
              <div className="form-group">
                <label>Internship Experience:</label>
                <input
                  type="checkbox"
                  name="internshipExperience"
                  checked={formData.internshipExperience}
                  onChange={handleFormChange}
                />
              </div>
              {formData.internshipExperience && (
                <div className="internship-section">
                  <h3>Internship Details</h3>
                  {formData.internships.map((internship, index) => (
                    <div key={index} className="internship-group">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={internship.companyName}
                        onChange={(e) => handleInternshipChange(index, 'companyName', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="From (MM/YYYY)"
                        value={internship.from}
                        onChange={(e) => handleInternshipChange(index, 'from', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="To (MM/YYYY)"
                        value={internship.to}
                        onChange={(e) => handleInternshipChange(index, 'to', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Work Done"
                        value={internship.workDone}
                        onChange={(e) => handleInternshipChange(index, 'workDone', e.target.value)}
                      />
                    </div>
                  ))}
                  <button type="button" onClick={addInternship}>Add Another Internship</button>
                </div>
              )}
              <button type="submit" className="submit-button">Save Changes</button>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <label>Full Name:</label>
                <span>{studentData?.fullName}</span>
              </div>
              <div className="info-group">
                <label>College:</label>
                <span>{studentData?.collegeName}</span>
              </div>
              <div className="info-group">
                <label>Roll Number:</label>
                <span>{studentData?.rollNumber}</span>
              </div>
              <div className="info-group">
                <label>Skills:</label>
                <div className="skills-tags">
                  {studentData?.skills?.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="info-group">
                <label>Internship Experience:</label>
                <span>{studentData?.internshipExperience ? 'Yes' : 'No'}</span>
              </div>
              {studentData?.internshipExperience && (
                <div className="internship-info">
                  <h3>Internship Details</h3>
                  {studentData.internships
                    .sort((a, b) => new Date(b.to) - new Date(a.to))
                    .map((internship, index) => (
                      <div key={index} className="internship-group">
                        <p>Company Name: {internship.companyName}</p>
                        <p>From: {internship.from}</p>
                        <p>To: {internship.to}</p>
                        <p>Work Done: {internship.workDone}</p>
                        {index < studentData.internships.length - 1 && <hr />}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          <div className="form">
            <div>
              <label htmlFor="resume">Resume: </label>
              <input
                type="file"
                id="resume"
                onChange={(e) => setResumeFile(e.target.files[0])}
                accept=".pdf,.doc,.docx"
                disabled={uploading}
              />
              <button
                className="btn"
                onClick={handleResumeUpload}
                disabled={uploading || !resumeFile}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
              {studentData?.resume && (
                <span className="uploaded-tag">Uploaded</span>
              )}
            </div>
            <div>
              <label htmlFor="github">GitHub Profile: </label>
              <input
                type="text"
                id="github"
                value={studentData?.githubLink || ""}
                onChange={(e) => handleInputChange("githubLink", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="hackathons">Hackathons Participated: </label>
              <input
                type="number"
                id="hackathons"
                value={studentData?.hackathonCount || 0}
                onChange={(e) => handleInputChange("hackathonCount", parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="placement-score-section">
          <h2>Placement Score: {placementScore}%</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={skillsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;