
import React, { useEffect, useState } from "react";
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getApplications, getJobs } from "../../Services/jobApi";
import "./index.scss";
import { useAuth } from "../../Context/AuthContext";
const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Fetch applications and jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationRes, jobRes] = await Promise.all([
          getApplications(),
          getJobs(),
        ]);

        const userApplications = applicationRes.data.filter(
          (application) =>
            String(application.userId) === String(user.id)
        );

        setApplications(userApplications);
        setJobs(jobRes.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Find job details using jobId
  const getJobDetails = (jobId) => {
    return jobs.find((job) => String(job.id) === String(jobId));
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Loading
  if (loading) {
    return (
      <div className="my-applications">
        <div className="applications-message">
          Loading applications...
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="my-applications">
        <div className="applications-message error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="my-applications">
      <div className="applications-container">

        {/* Page Heading */}
        <div className="applications-header">
          <span className="section-label">CAREER DASHBOARD</span>
          <h1>My Applications</h1>
          <p>Track and manage the jobs you have applied for.</p>
        </div>

        {/* Total Applications */}
        <div className="applications-summary">
          <div className="summary-card">
            <h2>{applications.length}</h2>
            <p>Total Applications</p>
          </div>
        </div>

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="applications-empty">
            <FaBriefcase />
            <h2>No Applications Yet</h2>
            <p>
              You haven't applied for any jobs yet.
              Start exploring and find your next opportunity.
            </p>
            <Link to="/" className="browse-jobs-btn">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => {
              const job = getJobDetails(application.jobId);

              return (
                <div className="application-card" key={application.id}>

                  {/* Job Details */}
                  <div className="application-main">
                    <div className="application-logo">
                      {job?.company?.charAt(0) || "J"}
                    </div>

                    <div className="application-info">
                      <h2>
                        {job?.title || "Job information unavailable"}
                      </h2>

                      <h4>{job?.company || "Company unavailable"}</h4>

                      <div className="application-meta">
                        <span>
                          <FaMapMarkerAlt />
                          {job?.location || "Location unavailable"}
                        </span>

                        <span>
                          <FaBriefcase />
                          {job?.type || "Job type unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Application Status */}
                  <div className="application-status">
                    <span className={`status-badge ${(
                      application.status || "Pending"
                    ).toLowerCase()}`}>
                      {application.status || "Pending"}
                    </span>
                  </div>

                  {/* Applied Date */}
                  <div className="application-date">
                    <FaCalendarAlt />
                    <div>
                      <small>Applied on</small>
                      <p>{formatDate(application.appliedAt)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="application-actions">
                    {job && (
                      <Link
                        to={`/jobs/${job.id}`}
                        className="application-view-btn"
                      >
                        View Job
                      </Link>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyApplications;
