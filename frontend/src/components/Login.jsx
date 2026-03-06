import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Use env variable for API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // ✅ Send trimmed email & password
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password.trim()
        })
      });

      const json = await response.json();

      if (json.authToken || json.authtoken) {
        const token = json.authToken || json.authtoken;

        // ✅ Remember me: localStorage or sessionStorage
        if (rememberMe) {
          localStorage.setItem('auth-token', token);
        } else {
          sessionStorage.setItem('auth-token', token);
        }

        setSuccess("Login successful! 🎉");

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError(json.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error! Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow-lg rounded p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#FFF8F0",
          borderLeft: "6px solid",
          borderImage: "linear-gradient(to bottom, #FF9A8B, #FF6A88, #FF99AC) 1",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h2
            className="fw-bold"
            style={{
              background: "linear-gradient(45deg, #FF6A88, #FF99AC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.5rem"
            }}
          >
            Welcome Back
          </h2>
          <p className="text-muted">Please sign in to your account</p>
        </div>

        {/* Success Alert */}
        {success && (
          <div
            className="d-flex align-items-center mb-3 p-3"
            style={{
              borderLeft: "6px solid",
              borderImage: "linear-gradient(to bottom, #6DD5FA, #2980B9, #00C9FF) 1",
              backgroundColor: "#F0FFF8",
              color: "#2F855A",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              fontWeight: "600",
              fontSize: "0.95rem",
            }}
          >
            ✅ {success}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            className="d-flex align-items-center mb-3 p-3"
            style={{
              borderLeft: "6px solid",
              borderImage: "linear-gradient(to bottom, #FF6A88, #FF6A88, #FF99AC) 1",
              backgroundColor: "#FFF0F0",
              color: "#C53030",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              fontWeight: "600",
              fontSize: "0.95rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">📧 Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">🔒 Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <label className="form-check-label fw-semibold" htmlFor="rememberMe">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="btn w-100 py-2"
            disabled={loading}
            style={{
              background: loading ? "#ccc" : "linear-gradient(to right, #6DD5FA, #2980B9)",
              color: "#fff",
              fontWeight: "600",
              fontSize: "1rem",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Logging in..." : "🚀 Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="#forgot-password" className="text-decoration-none fw-semibold" style={{ color: "#FF6A88", fontSize: "0.9rem" }}>
            Forgot your password?
          </a>
        </div>

        <div className="text-center mt-3">
          <span className="text-muted" style={{ fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <button className="btn btn-link fw-bold text-decoration-none p-0"
              style={{ color: "#FF6A88", border: "none", background: "none" }}
              onClick={() => navigate('/signup')}>
              Sign up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;