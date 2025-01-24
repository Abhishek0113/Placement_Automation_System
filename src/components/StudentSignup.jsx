import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function StudentSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.endsWith('@student.com')) {
      setError('Student email must end with @student.com');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Student signed up successfully!');
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError('Failed to sign up. ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Section - Image or Placeholder */}
      <div style={styles.leftSection}>
        {/* Add your image link below */}
        <img
         // Replace with the image link
          src = "https://www.creative-tim.com/twcomponents/svg/queue-animate.svg"
          alt="Student"
          style={styles.image}
        />
      </div>

      {/* Right Section - Signup Form */}
      <div style={styles.rightSection}>
        <h2 style={styles.heading}>Student Signup</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: "'Roboto', sans-serif",
  },
  leftSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
  },
  image: {
    maxWidth: '90%',
    maxHeight: '90%',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
  },
  rightSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: 'white',
    boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    color: '#1976d2',
    marginBottom: '20px',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  error: {
    color: '#d32f2f',
    marginBottom: '10px',
    fontSize: '14px',
  },
  form: {
    width: '80%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    transition: 'border-color 0.2s ease',
  },
  inputFocus: {
    borderColor: '#1976d2',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#1976d2',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  buttonHover: {
    backgroundColor: '#1565c0',
  },
};

export default StudentSignup;
