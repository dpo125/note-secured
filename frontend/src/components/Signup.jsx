import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Use env variable for API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Signup = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ Passwords match check
    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }

    // ✅ Terms agreement check
    if (!agreeTerms) {
      setError("Please agree to the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      // ✅ Fetch request to backend
      const response = await fetch(`${API_URL}/api/auth/createuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: credentials.name.trim(),
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password.trim()
        })
      });

      const json = await response.json();

      if (json.success) {
        // ✅ Save the correct token from backend
        localStorage.setItem("auth-token", json.authToken);

        alert("Account created successfully! 🎉");

        navigate("/"); // Redirect to homepage after signup
      } else {
        setError(json.error || "Signup failed! Please try again.");
      }

    } catch (err) {
      setError("Network error! Please check your connection.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg rounded p-4" style={{
        width: "100%",
        maxWidth: "450px",
        backgroundColor: "#FFF8F0",
        borderLeft: "6px solid",
        borderImage: "linear-gradient(to bottom, #6DD5FA, #2980B9, #6DD5FA) 1",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}>
        <div className="text-center mb-4">
          <h2 style={{
            background: "linear-gradient(45deg, #6DD5FA, #2980B9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem"
          }}>Create Account</h2>
          <p className="text-muted">Join us and get started today!</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert" style={{ fontSize: "0.9rem" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">👤 Full Name</label>
            <input type="text" className="form-control" id="name" name="name"
              value={credentials.name} onChange={onChange} required
              placeholder="Enter your full name" disabled={loading}
              style={{ backgroundColor: "#fff", border: "2px solid", borderImage: "linear-gradient(to right, #FF9A8B, #FF6A88) 1" }} />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">📧 Email Address</label>
            <input type="email" className="form-control" id="email" name="email"
              value={credentials.email} onChange={onChange} required
              placeholder="Enter your email" disabled={loading}
              style={{ backgroundColor: "#fff", border: "2px solid", borderImage: "linear-gradient(to right, #FF9A8B, #FF6A88) 1" }} />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">🔒 Password</label>
            <input type="password" className="form-control" id="password" name="password"
              value={credentials.password} onChange={onChange} required
              placeholder="Create a password" disabled={loading}
              style={{ backgroundColor: "#fff", border: "2px solid", borderImage: "linear-gradient(to right, #FF9A8B, #FF6A88) 1" }} />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label fw-semibold">✅ Confirm Password</label>
            <input type="password" className="form-control" id="confirmPassword" name="confirmPassword"
              value={credentials.confirmPassword} onChange={onChange} required
              placeholder="Confirm your password" disabled={loading}
              style={{ backgroundColor: "#fff", border: "2px solid", borderImage: "linear-gradient(to right, #FF9A8B, #FF6A88) 1" }} />
          </div>

          <div className="mb-4 form-check">
            <input type="checkbox" className="form-check-input" id="agreeTerms"
              checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} disabled={loading} />
            <label className="form-check-label fw-semibold" htmlFor="agreeTerms">
              I agree to the <a href="#terms">Terms & Conditions</a>
            </label>
          </div>

          <button type="submit" className="btn w-100 py-2" disabled={loading}
            style={{
              background: loading ? "#ccc" : "linear-gradient(to right, #FF9A8B, #FF6A88)",
              color: "#fff",
              border: "none",
              fontWeight: "600",
              fontSize: "1rem",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer"
            }}>
            {loading ? "Creating Account..." : "🎉 Create Account"}
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted" style={{ fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <button className="btn btn-link fw-bold text-decoration-none p-0"
              onClick={() => navigate('/login')} disabled={loading}>
              Sign in
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;