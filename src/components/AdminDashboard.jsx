import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    jobDescription: "",
    companyCriteria: "",
    companyDescription: "",
    preferredSkills: "",
    logo: null,
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [data, setData] = useState({
    studentCount: 0,
    companyCount: 0,
    applications: [],
    jobPostings: [],
    assessments: [],
    events: [],
    interviews: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        studentsSnapshot,
        companiesSnapshot,
        applicationsSnapshot,
        jobPostingsSnapshot,
        assessmentsSnapshot,
        eventsSnapshot,
        interviewsSnapshot,
      ] = await Promise.all([
        getDocs(collection(db, "students")),
        getDocs(collection(db, "jobPostings")),
        getDocs(collection(db, "applications")),
        getDocs(collection(db, "jobPostings")),
        getDocs(collection(db, "assessments")),
        getDocs(collection(db, "events")),
        getDocs(collection(db, "interviews")),
      ]);

      setData({
        studentCount: studentsSnapshot.size,
        companyCount: companiesSnapshot.size,
        applications: applicationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        jobPostings: jobPostingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        assessments: assessmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        events: eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        interviews: interviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({
        text: "An error occurred while fetching data. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user || !user.email.endsWith("@admin.com")) {
        navigate("/admin/login");
      } else {
        fetchData();
      }
    });

    return () => unsubscribe();
  }, [navigate, fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      logo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setIsLoading(true);

    try {
      let logoUrl = "";
      if (formData.logo) {
        const storageRef = ref(
          storage,
          `company-logos/${formData.companyName}-${Date.now()}`,
        );
        await uploadBytes(storageRef, formData.logo);
        logoUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "jobPostings"), {
        ...formData,
        logoUrl,
        createdAt: serverTimestamp(),
        isActive: true,
      });

      setMessage({ text: "Job posting added successfully!", type: "success" });
      setFormData({
        companyName: "",
        jobDescription: "",
        companyCriteria: "",
        companyDescription: "",
        preferredSkills: "",
        logo: null,
      });
      fetchData();
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage({
        text: "Error adding job posting. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (e, collectionName) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    try {
      await addDoc(collection(db, collectionName), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setMessage({
        text: `${collectionName} added successfully!`,
        type: "success",
      });
      fetchData();
      e.target.reset();
    } catch (error) {
      console.error(`Error adding ${collectionName}:`, error);
      setMessage({
        text: `Error adding ${collectionName}. Please try again.`,
        type: "error",
      });
    }
  };

  const handleRemoveCompany = async (companyId) => {
    try {
      await deleteDoc(doc(db, "jobPostings", companyId));
      setMessage({ text: "Company removed successfully!", type: "success" });
      fetchData();
    } catch (error) {
      console.error("Error removing company:", error);
      setMessage({
        text: "Error removing company. Please try again.",
        type: "error",
      });
    }
  };

  const handleDeactivateCompany = async (companyId) => {
    try {
      await updateDoc(doc(db, "jobPostings", companyId), {
        isActive: false,
      });
      setMessage({
        text: "Company deactivated successfully!",
        type: "success",
      });
      fetchData();
    } catch (error) {
      console.error("Error deactivating company:", error);
      setMessage({
        text: "Error deactivating company. Please try again.",
        type: "error",
      });
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/admin/login");
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn">
          Logout
        </button>

        <div className="card">
          <h2>Statistics</h2>
          <p>Number of Registered Students: {data.studentCount}</p>
          <p>Number of Companies Added: {data.companyCount}</p>
        </div>

        <div className="card">
          <h2>Add New Job Posting</h2>
          <form onSubmit={handleSubmit} className="form">
            <div>
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="companyCriteria">Company Criteria</label>
              <textarea
                id="companyCriteria"
                name="companyCriteria"
                value={formData.companyCriteria}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="companyDescription">Company Description</label>
              <textarea
                id="companyDescription"
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="preferredSkills">Preferred Skills</label>
              <textarea
                id="preferredSkills"
                name="preferredSkills"
                value={formData.preferredSkills}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="logo">Company Logo</label>
              <input
                type="file"
                id="logo"
                name="logo"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Job Posting"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Add Assessment</h2>
          <form
            onSubmit={(e) => handleAddItem(e, "assessments")}
            className="form"
          >
            <input
              type="text"
              name="title"
              placeholder="Assessment Title"
              required
            />
            <input type="date" name="dueDate" required />
            <button type="submit" className="btn">
              Add Assessment
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Add Event</h2>
          <form onSubmit={(e) => handleAddItem(e, "events")} className="form">
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              required
            />
            <input type="date" name="date" required />
            <input
              type="text"
              name="location"
              placeholder="Location"
              required
            />
            <textarea
              name="description"
              placeholder="Event Description"
              required
            ></textarea>
            <button type="submit" className="btn">
              Add Event
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Schedule Interview</h2>
          <form
            onSubmit={(e) => handleAddItem(e, "interviews")}
            className="form"
          >
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              required
            />
            <input type="date" name="date" required />
            <input type="time" name="time" required />
            <button type="submit" className="btn">
              Schedule Interview
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Job Postings</h2>
          <ul>
            {data.jobPostings.map((posting) => (
              <li key={posting.id}>
                <h3>{posting.companyName}</h3>
                <p>{posting.jobDescription?.substring(0, 100)}...</p>
                <p>Status: {posting.isActive ? "Active" : "Inactive"}</p>
                <button
                  onClick={() => handleRemoveCompany(posting.id)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
                {posting.isActive && (
                  <button
                    onClick={() => handleDeactivateCompany(posting.id)}
                    className="btn btn-warning"
                  >
                    Deactivate
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {message.text && (
          <p className={message.type === "success" ? "success" : "error"}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;