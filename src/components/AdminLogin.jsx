import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function AdminLogin() {
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
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Admin logged in successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Image */}
      <div style={styles.leftSection}>
        <img
          src="https://rurutek.com/jio/assets/img/login-animate.gif" // Replace with the image link
          alt="Admin"
          style={styles.image}
        />
      </div>

      {/* Right Side - Login Form */}
      <div style={styles.rightSection}>
        <h1 style={styles.heading}>Welcome Back, Admin!</h1>
        <p style={styles.subheading}>
          Log in to access your dashboard and manage the platform.
        </p>
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
            Login
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
    backgroundColor: '#e9ecef',
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
    fontSize: '2rem',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subheading: {
    color: '#555',
    fontSize: '1rem',
    marginBottom: '20px',
    textAlign: 'center',
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

export default AdminLogin;
