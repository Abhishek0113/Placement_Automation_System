import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function AdminSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.endsWith('@admin.com')) {
      setError('Admin email must end with @admin.com');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Admin signed up successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError('Failed to sign up. ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Image */}
      <div style={styles.leftSection}>
        {/* Add your image link below */}
        <img
          src="https://www.creative-tim.com/twcomponents/svg/website-designer-bro-purple.svg" // Replace with the image link
          alt="Admin"
          style={styles.image}
        />
      </div>

      {/* Right Side - Signup Form */}
      <div style={styles.rightSection}>
        <h2 style={styles.heading}>Admin Signup</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Admin Email"
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

// Inline Styles
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f7f7f7',
  },
  leftSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef', // Optional background for placeholder
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
  },
  rightSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    color: '#007bff',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
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
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default AdminSignup;
