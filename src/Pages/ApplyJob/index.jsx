import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUpload, FaPaperPlane } from "react-icons/fa";

import {
  submitApplication,
  getUsers,
  addNotification
} from "../../Services/jobApi";

import { useAuth } from "../../Context/AuthContext";

import "./index.scss";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    skills: "",
    coverLetter: "",
  });

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    if (!user) {
      setError("Please login before applying.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Application data
      const applicationData = {
        jobId: id,
        userId: user.id,
        ...form,
        resume: resume.name,
        status: "Pending",
        appliedAt: new Date().toISOString(),
      };

      // 1. Save application
      await submitApplication(applicationData);

      // 2. Get users
      const usersResponse = await getUsers();

      // 3. Find admins
      const admins = usersResponse.data.filter(
        (admin) => admin.role === "admin"
      );

      // 4. Notify admins
      await Promise.all(
        admins.map((admin) =>
          addNotification({
            userId: admin.id,
            type: "application",
            title: "New Job Application",
            message: `${user.name || form.name} applied for Job ID ${id}`,
            read: false,
            link: "/admin/applications",
            createdAt: new Date().toISOString(),
          })
        )
      );

      alert("Application submitted successfully!");

      navigate("/");
    } catch (error) {
      console.error("Application error:", error);
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-page">
      <div className="apply-container">
        <div className="apply-heading">
          <span>JOB APPLICATION</span>
          <h1>Apply for this Position</h1>
          <p>Complete the form below to submit your application.</p>
        </div>

        <form className="application-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Education</label>
              <input
                type="text"
                name="education"
                placeholder="Your qualification"
                value={form.education}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="React, JavaScript, HTML, CSS..."
              value={form.skills}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Resume</label>

            <label className="resume-upload">
              <FaUpload />
              <span>
                {resume ? resume.name : "Choose Resume (PDF)"}
              </span>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  setResume(e.target.files[0] || null);
                  setError("");
                }}
                required
              />
            </label>

            <small>Upload your resume in PDF format.</small>
          </div>

          <div className="form-group">
            <label>Cover Letter</label>
            <textarea
              name="coverLetter"
              rows="5"
              placeholder="Write a short cover letter..."
              value={form.coverLetter}
              onChange={handleChange}
            />
          </div>

          {error && <p className="application-error">{error}</p>}

          <button
            className="submit-application"
            type="submit"
            disabled={loading}
          >
            <FaPaperPlane />
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;