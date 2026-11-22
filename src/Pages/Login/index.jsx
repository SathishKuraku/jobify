
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserByEmail } from "../../Services/jobApi";
import { useAuth } from "../../Context/AuthContext";
import "./index.scss";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
    setLoading(true);

    try {
      const response = await getUserByEmail(
        form.email.trim().toLowerCase()
      );

      const user = response.data.find(
        (item) => item.password === form.password
      );

      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      if (user.status === "Inactive") {
        setError("Your account is inactive. Please contact the administrator.");
        return;
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        status: user.status || "Active",
      };

      login(userData);

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-heading">
          <h1>Welcome Back</h1>
          <p>Login to continue your job search</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label htmlFor="email">Email Address</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-group">
            <label htmlFor="password">Password</label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
