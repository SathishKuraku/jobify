
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, getUserByEmail } from "../../Services/jobApi";
import "./index.scss";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check passwords
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check password length
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Check whether email already exists
      const response = await getUserByEmail(form.email.trim());

      if (response.data.length > 0) {
        setError("This email is already registered.");
        return;
      }

      // Create new user with default role
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: "user",
        status: "Active"
      });

      alert("Registration successful! Please login.");

      navigate("/login");
    } catch (error) {
      console.error(error);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <h1>Create Account</h1>
          <p>Join Jobify and find your next opportunity.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
