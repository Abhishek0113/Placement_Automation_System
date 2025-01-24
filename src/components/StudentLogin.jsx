import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
      navigate("/student/dashboard");
    } catch (error) {
      setError("Failed to log in. " + error.message);
      console.error("Error during login:", error);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Image */}
      <div style={styles.leftSection}>
        <img
          src="https://www.creative-tim.com/twcomponents/svg/secure-login-animate.svg" // Replace with the image link
          alt="Student"
          style={styles.image}
        />
      </div>

      {/* Right Side - Login Form */}
      <div style={styles.rightSection}>
        <h1 style={styles.heading}>Welcome Back, Student!</h1>
        <p style={styles.subheading}>
          Log in to access your dashboard and explore the resources.
        </p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
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
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f7f7f7",
  },
  leftSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9ecef",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "cover",
  },
  rightSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "white",
    boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    color: "#007bff",
    fontSize: "2rem",
    marginBottom: "10px",
    textAlign: "center",
  },
  subheading: {
    color: "#555",
    fontSize: "1rem",
    marginBottom: "20px",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  form: {
    width: "80%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    color: "white",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default StudentLogin;
