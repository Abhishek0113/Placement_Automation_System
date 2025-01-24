import React from 'react';
import { NavLink } from 'react-router-dom';
//import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <NavLink to="/student/dashboard" className="sidebar-item" activeClassName="active">
        <i className="fas fa-home"></i>
        <span>Home</span>
      </NavLink>
      <NavLink to="/student/job-profiles" className="sidebar-item" activeClassName="active">
        <i className="fas fa-briefcase"></i>
        <span>Job Profiles</span>
      </NavLink>
      <NavLink to="/student/dashboard" className="sidebar-item" activeClassName="active">
        <i className="fas fa-user"></i>
        <span>My Profile</span>
      </NavLink>
      <NavLink to="/student/interviews" className="sidebar-item" activeClassName="active">
        <i className="fas fa-comments"></i>
        <span>Interviews</span>
      </NavLink>
      <NavLink to="/student/assessments" className="sidebar-item" activeClassName="active">
        <i className="fas fa-tasks"></i>
        <span>Assessments</span>
      </NavLink>
      <NavLink to="/student/events" className="sidebar-item" activeClassName="active">
        <i className="fas fa-calendar-alt"></i>
        <span>Events</span>
      </NavLink>
      <NavLink to="/student/resume" className="sidebar-item" activeClassName="active">
        <i className="fas fa-file-alt"></i>
        <span>Resume</span>
      </NavLink>
    </div>
  );
}

export default Sidebar;