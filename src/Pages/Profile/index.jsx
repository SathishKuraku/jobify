import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { getUserById, updateUser } from "../../Services/jobApi";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaTools,
  FaFileAlt,
  FaSave,
  FaEdit
} from "react-icons/fa";

import "./index.scss";

const Profile = () => {
  const { user, login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    education: "",
    skills: "",
    resume: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load user details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserById(user.id);
        const userData = response.data;

        setForm({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          location: userData.location || "",
          education: userData.education || "",
          skills: Array.isArray(userData.skills)
            ? userData.skills.join(", ")
            : userData.skills || "",
          resume: userData.resume || ""
        });
      } catch (error) {
        console.log("Profile loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Resume file selection
  const handleResume = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm((prev) => ({
        ...prev,
        resume: file.name
      }));
    }
  };

  // Profile completion calculation
  const profileFields = [
    form.name,
    form.email,
    form.phone,
    form.location,
    form.education,
    form.skills,
    form.resume
  ];

  const completedFields = profileFields.filter(
    (field) => field && field.trim() !== ""
  ).length;

  const percentage = Math.round(
    (completedFields / profileFields.length) * 100
  );

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const updatedData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        education: form.education,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        resume: form.resume
      };

      await updateUser(user.id, updatedData);

      // Update logged-in user data
      login({
        ...user,
        ...updatedData
      });

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.log("Profile update error:", error);
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Header */}
        <div className="profile-header">
          <div>
            <span className="profile-tag">MY ACCOUNT</span>
            <h1>My Profile</h1>
            <p>Manage your personal information and career details.</p>
          </div>

          <div className="profile-avatar">
            <FaUser />
          </div>
        </div>

        {/* Profile Completion */}
        <div className="profile-progress-card">
          <div className="progress-info">
            <div>
              <h3>Profile Completion</h3>
              <p>Complete your profile to improve your job opportunities.</p>
            </div>

            <span className="progress-percent">{percentage}%</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="progress-footer">
            <span>{completedFields} of 7 sections completed</span>
          </div>
        </div>

        {/* Profile Form */}
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-section-heading">
            <FaEdit />
            <h2>Personal Information</h2>
          </div>

          <div className="profile-grid">

            {/* Name */}
            <div className="profile-field">
              <label>Full Name</label>
              <div className="input-box">
                <FaUser />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="profile-field">
              <label>Email Address</label>
              <div className="input-box">
                <FaEnvelope />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="profile-field">
              <label>Phone Number</label>
              <div className="input-box">
                <FaPhone />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Location */}
            <div className="profile-field">
              <label>Location</label>
              <div className="input-box">
                <FaMapMarkerAlt />
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, State"
                />
              </div>
            </div>

            {/* Education */}
            <div className="profile-field full-width">
              <label>Education</label>
              <div className="input-box">
                <FaGraduationCap />
                <input
                  type="text"
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  placeholder="Degree, College, Graduation year"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="profile-field full-width">
              <label>Skills</label>
              <div className="input-box">
                <FaTools />
                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, JavaScript, Python, SQL"
                />
              </div>
              <small>Separate your skills using commas.</small>
            </div>

            {/* Resume */}
            <div className="profile-field full-width">
              <label>Resume</label>

              <div className="resume-box">
                <div className="resume-icon">
                  <FaFileAlt />
                </div>

                <div className="resume-info">
                  <strong>
                    {form.resume || "No resume selected"}
                  </strong>
                  <span>Choose your resume file</span>
                </div>

                <label className="resume-upload-btn">
                  Upload Resume
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResume}
                  />
                </label>
              </div>
            </div>

          </div>

          {/* Message */}
          {message && (
            <div className={`profile-message ${saving ? "saving" : ""}`}>
              {message}
            </div>
          )}

          {/* Save Button */}
          <div className="profile-form-footer">
            <button
              type="submit"
              className="save-profile-btn"
              disabled={saving}
            >
              <FaSave />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;