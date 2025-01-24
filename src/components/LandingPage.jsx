// File: src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <header>
        <h1>Student Resume Portal</h1>
      </header>
      <main>
        <section className="hero">
          <h2>Showcase Your Skills and Experiences</h2>
          <p>Upload your resume, share your achievements, and connect with opportunities.</p>
        </section>
        <section className="cta-section">
          <div className="cta-card">
            <h3>For Students</h3>
            <p>Build your professional profile and explore opportunities.</p>
            <div className="cta-buttons">
              <Link to="/student/login" className="btn btn-primary">Login</Link>
              <Link to="/student/signup" className="btn btn-secondary">Sign Up</Link>
            </div>
          </div>
          <div className="cta-card">
            <h3>For Admins</h3>
            <p>Manage student profiles and review submissions.</p>
            <div className="cta-buttons">
              <Link to="/admin/login" className="btn btn-primary">Login</Link>
              <Link to="/admin/signup" className="btn btn-secondary">Sign Up</Link>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 Student Resume Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage; 