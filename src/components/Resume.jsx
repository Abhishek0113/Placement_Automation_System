import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

function Resume() {
  const [user] = useAuthState(auth);
  const [resumeUrl, setResumeUrl] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchResume();
    }
  }, [user]);

  const fetchResume = async () => {
    const userDoc = await getDoc(doc(db, 'students', user.uid));
    if (userDoc.exists()) {
      setResumeUrl(userDoc.data().resumeUrl || '');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        await updateDoc(doc(db, 'students', user.uid), {
          resumeUrl: downloadUrl
        });
        setResumeUrl(downloadUrl);
        setFile(null);
        alert('Resume uploaded successfully!');
        fetchResume();
      } catch (error) {
        console.error('Error uploading resume:', error);
        alert('Failed to upload resume. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (resumeUrl) {
      try {
        const storageRef = ref(storage, resumeUrl);
        await deleteObject(storageRef);
        await updateDoc(doc(db, 'students', user.uid), {
          resumeUrl: null
        });
        setResumeUrl('');
        alert('Resume deleted successfully!');
      } catch (error) {
        console.error('Error deleting resume:', error);
        alert('Failed to delete resume. Please try again.');
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Resume</h1>

        {resumeUrl ? (
          <div className="bg-blue-50 rounded-lg p-6 space-y-4">
            <p className="text-lg font-semibold text-gray-700">Current Resume</p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => window.open(resumeUrl, '_blank')}
                className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                📄 View Resume
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(resumeUrl, '_blank')}
                  className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  ⬇️ Download
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No resume uploaded yet.</p>
        )}

         <div className="space-y-4">
          
          <div className="flex items-center justify-center w-full">
            <label htmlFor="resume-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-500 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                
                <p className="mb-2 text-sm text-blue-600 font-semibold">Click to upload</p>
                <p className="text-xs text-blue-500">PDF, DOC, or DOCX (MAX. 10MB)</p>
              </div>
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
            </label>
          </div>
          {file && (
            <p className="text-sm text-gray-500 truncate">Selected file: {file.name}</p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              ⬆️ Upload Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Resume;