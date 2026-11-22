import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaBookmark,
  FaShareAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaBuilding,
  FaGraduationCap,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

import {
  getJobById,
  getJobs,
  getSavedJobByJobId,
  saveJob,
  removeSavedJob,
} from "../../Services/jobApi";

import { useAuth } from "../../Context/AuthContext";
import "./index.scss";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [saved, setSaved] = useState(false);
  const [savedJobId, setSavedJobId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);

      try {
        const response = await getJobById(id);
        const currentJob = response.data;

        setJob(currentJob);

        // Fetch similar jobs
        const jobsResponse = await getJobs();

        const related = jobsResponse.data
          .filter(
            (item) =>
              String(item.id) !== String(id) &&
              item.status?.toLowerCase() === "active" &&
              (
                item.category === currentJob.category ||
                item.company === currentJob.company
              )
          )
          .slice(0, 3);

        setSimilarJobs(related);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  // Check whether the job is saved
  useEffect(() => {
    const checkSavedJob = async () => {
      if (!user?.id) {
        setSaved(false);
        setSavedJobId(null);
        return;
      }

      try {
        const existing = await getSavedJobByJobId(id, user.id);

        if (existing) {
          setSaved(true);
          setSavedJobId(existing.id);
        } else {
          setSaved(false);
          setSavedJobId(null);
        }
      } catch (error) {
        console.error("Error checking saved job:", error);
      }
    };

    checkSavedJob();
  }, [id, user?.id]);

  // Save / Remove saved job
  const handleSaveJob = async () => {
    if (!user) {
      alert("Please login to save this job.");
      navigate("/login");
      return;
    }

    if (saving) return;

    setSaving(true);

    try {
      if (saved && savedJobId) {
        await removeSavedJob(savedJobId);
        setSaved(false);
        setSavedJobId(null);
      } else {
        const response = await saveJob(job.id, user.id);
        setSaved(true);
        setSavedJobId(response.data.id);
      }
    } catch (error) {
      console.error("Save job error:", error);
      alert("Unable to update saved job. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Share job
  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: `Check out this ${job.title} job at ${job.company}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Job link copied to clipboard!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share error:", error);
      }
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="job-details-loading">
        <div className="job-details-spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  // Job not found
  if (!job) {
    return (
      <div className="job-not-found">
        <FaBriefcase />
        <h2>Job Not Found</h2>
        <p>This job may have been removed or is no longer available.</p>

        <Link to="/jobs">
          <FaArrowLeft />
          Back to Jobs
        </Link>
      </div>
    );
  }

  // Default data when optional fields are missing from db.json
  const responsibilities = job.responsibilities || [
    "Work with the team to develop and maintain software applications.",
    "Write clean, readable, and maintainable code.",
    "Collaborate with team members to complete assigned tasks.",
    "Debug issues and improve application performance.",
  ];

  const skills = job.skills
    ? Array.isArray(job.skills)
      ? job.skills
      : job.skills.split(",").map((skill) => skill.trim())
    : ["Communication", "Problem Solving", "Teamwork"];

  const qualifications = job.qualifications || [
    "Relevant degree or equivalent knowledge.",
    "Good communication and problem-solving skills.",
    "Ability to learn new technologies.",
  ];

  return (
    <div className="job-details-page">

      {/* TOP BREADCRUMB */}
      <div className="job-details-top">
        <div className="job-details-container">
          <Link to="/jobs" className="back-to-jobs">
            <FaArrowLeft />
            Back to Jobs
          </Link>
        </div>
      </div>

      <div className="job-details-container job-details-layout">

        {/* MAIN CONTENT */}
        <main className="job-details-main">

          {/* JOB HEADER */}
          <div className="job-details-header">
            <div className="job-company-logo">
              <FaBriefcase />
            </div>

            <div className="job-header-content">
              <span className="job-open-badge">
                <FaCheckCircle />
                {job.status || "Active"}
              </span>

              <h1>{job.title}</h1>

              <Link
                to={`/companies/${encodeURIComponent(job.company)}`}
                className="job-company-name"
              >
                <FaBuilding />
                {job.company}
              </Link>

              <div className="job-header-meta">
                <span>
                  <FaMapMarkerAlt />
                  {job.location || "Location not specified"}
                </span>

                <span>
                  <FaBriefcase />
                  {job.type || "Full Time"}
                </span>

                <span>
                  <FaClock />
                  {job.experience || "Experience not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="job-details-actions">
            <button
              className={`save-job-btn ${saved ? "saved" : ""}`}
              onClick={handleSaveJob}
              disabled={saving}
            >
              <FaBookmark />
              {saving ? "Saving..." : saved ? "Saved" : "Save Job"}
            </button>

            <button className="share-job-btn" onClick={handleShare}>
              <FaShareAlt />
              Share
            </button>
          </div>

          {/* OVERVIEW */}
          <div className="job-overview">
            <div className="overview-item">
              <div className="overview-icon salary">
                <FaMoneyBillWave />
              </div>

              <div>
                <span>Salary</span>
                <h3>{job.salary || "Not disclosed"}</h3>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon experience">
                <FaClock />
              </div>

              <div>
                <span>Experience</span>
                <h3>{job.experience || "Not specified"}</h3>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon jobtype">
                <FaBriefcase />
              </div>

              <div>
                <span>Employment Type</span>
                <h3>{job.type || "Full Time"}</h3>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon location">
                <FaMapMarkerAlt />
              </div>

              <div>
                <span>Location</span>
                <h3>{job.location || "Not specified"}</h3>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <section className="job-details-section">
            <h2>About This Job</h2>

            <p>
              {job.description ||
                "We are looking for a talented candidate to join our team. Apply today to explore this exciting career opportunity."}
            </p>
          </section>

          {/* RESPONSIBILITIES */}
          <section className="job-details-section">
            <h2>Responsibilities</h2>

            <ul className="job-detail-list">
              {responsibilities.map((item, index) => (
                <li key={index}>
                  <FaCheckCircle />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SKILLS */}
          <section className="job-details-section">
            <h2>Required Skills</h2>

            <div className="job-skills">
              {skills.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
            </div>
          </section>

          {/* QUALIFICATIONS */}
          <section className="job-details-section">
            <h2>Qualifications</h2>

            <ul className="job-detail-list">
              {qualifications.map((item, index) => (
                <li key={index}>
                  <FaCheckCircle />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* APPLY CTA */}
          <div className="job-apply-card">
            <div>
              <h2>Interested in this opportunity?</h2>
              <p>Submit your application and take the next step in your career.</p>
            </div>

            <Link
              to={user ? `/apply/${job.id}` : "/login"}
              className="apply-now-btn"
            >
              Apply Now
              <FaArrowRight />
            </Link>
          </div>
        </main>

        {/* SIDEBAR */}
        <aside className="job-details-sidebar">

          {/* QUICK INFO */}
          <div className="sidebar-card">
            <h3>Job Summary</h3>

            <div className="summary-item">
              <span>Company</span>
              <strong>{job.company}</strong>
            </div>

            <div className="summary-item">
              <span>Category</span>
              <strong>{job.category || "General"}</strong>
            </div>

            <div className="summary-item">
              <span>Job Type</span>
              <strong>{job.type || "Full Time"}</strong>
            </div>

            <div className="summary-item">
              <span>Experience</span>
              <strong>{job.experience || "Not specified"}</strong>
            </div>

            <div className="summary-item">
              <span>Salary</span>
              <strong>{job.salary || "Not disclosed"}</strong>
            </div>

            <Link
              to={user ? `/apply/${job.id}` : "/login"}
              className="sidebar-apply-btn"
            >
              Apply for Job
            </Link>
          </div>

          {/* SIMILAR JOBS */}
          <div className="sidebar-card similar-jobs-card">
            <h3>Similar Jobs</h3>

            {similarJobs.length === 0 ? (
              <p className="no-similar-jobs">
                No similar jobs available right now.
              </p>
            ) : (
              similarJobs.map((similar) => (
                <div className="similar-job-item" key={similar.id}>
                  <div className="similar-job-icon">
                    <FaBriefcase />
                  </div>

                  <div className="similar-job-content">
                    <Link to={`/jobs/${similar.id}`}>
                      {similar.title}
                    </Link>

                    <span>{similar.company}</span>
                    <span>{similar.location}</span>
                    <strong>{similar.salary}</strong>
                  </div>
                </div>
              ))
            )}

            <Link to="/jobs" className="view-more-jobs">
              Browse All Jobs
              <FaArrowRight />
            </Link>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default JobDetails;