import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import AdminLogin from "./components/AdminLogin";
import AdminSignup from "./components/AdminSignup";
import StudentLogin from "./components/StudentLogin";
import StudentSignup from "./components/StudentSignup";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import JobProfiles from "./components/JobProfiles";
import Interviews from "./components/Interviews";
import Assessments from "./components/Assessments";
import Events from "./components/Events";
import Resume from "./components/Resume";
import StudentProfileCompletion from "./components/StudentProfileCompletion";
import "./App.css";

function ProtectedRoute({ children, adminOnly = false }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (adminOnly && !user.email.endsWith("@admin.com")) {
    return <Navigate to="/" />;
  }

  return children;
}

function StudentLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/signup" element={<StudentSignup />} />

          {/* New route for profile completion */}
          <Route
            path="/student/complete-profile/:userId"
            element={
              <ProtectedRoute>
                <StudentProfileCompletion />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/*"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <Routes>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="job-profiles" element={<JobProfiles />} />
                    <Route path="interviews" element={<Interviews />} />
                    <Route path="assessments" element={<Assessments />} />
                    <Route path="events" element={<Events />} />
                    <Route path="resume" element={<Resume />} />
                  </Routes>
                </StudentLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
