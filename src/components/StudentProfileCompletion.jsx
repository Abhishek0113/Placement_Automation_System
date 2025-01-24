import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

function StudentProfileCompletion() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [formData, setFormData] = useState({
    fullName: '',
    collegeName: '',
    rollNumber: '',
    skills: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const studentRef = doc(db, 'students', user.uid);
        const studentDoc = await getDoc(studentRef);

        if (studentDoc.exists()) {
          const data = studentDoc.data();
          setFormData({
            fullName: data.fullName || '',
            collegeName: data.collegeName || '',
            rollNumber: data.rollNumber || '',
            skills: Array.isArray(data.skills) ? data.skills.join(', ') : ''
          });
        } else {
          // Initialize the document if it doesn't exist
          await updateDoc(studentRef, {
            email: user.email,
            profileCompleted: false,
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to complete your profile');
      return;
    }

    // Validate form data
    if (!formData.fullName.trim() || !formData.collegeName.trim() || 
        !formData.rollNumber.trim() || !formData.skills.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      const studentRef = doc(db, 'students', user.uid);

      // Prepare update data
      const updateData = {
        fullName: formData.fullName.trim(),
        collegeName: formData.collegeName.trim(),
        rollNumber: formData.rollNumber.trim(),
        skills: formData.skills.split(',').map(skill => skill.trim()),
        profileCompleted: true,
        lastUpdated: new Date().toISOString()
      };

      // Update the document
      await updateDoc(studentRef, updateData);
      navigate('/student/dashboard');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  // Handle authentication loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Handle not authenticated state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Please log in to complete your profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Profile
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">
                College Name
              </label>
              <input
                id="collegeName"
                name="collegeName"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="Enter your college name"
              />
            </div>

            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">
                Roll Number
              </label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="Enter your roll number"
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills (comma-separated)
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                required
                placeholder="e.g., JavaScript, React, Python"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileCompletion;