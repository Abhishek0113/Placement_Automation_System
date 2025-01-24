import React, { useState } from 'react';

function Dashboard() {
  const [resume, setResume] = useState(null);
  const [hackathonExperience, setHackathonExperience] = useState('');
  const [internshipExperience, setInternshipExperience] = useState('');
  const [githubLink, setGithubLink] = useState('');

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', {
      resume,
      hackathonExperience,
      internshipExperience,
      githubLink
    });
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="resume">Upload Resume:</label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
          />
        </div>
        <div>
          <label htmlFor="hackathonExperience">Hackathon Experience:</label>
          <textarea
            id="hackathonExperience"
            value={hackathonExperience}
            onChange={(e) => setHackathonExperience(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="internshipExperience">Internship Experience:</label>
          <textarea
            id="internshipExperience"
            value={internshipExperience}
            onChange={(e) => setInternshipExperience(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="githubLink">GitHub Link:</label>
          <input
            type="url"
            id="githubLink"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Dashboard;