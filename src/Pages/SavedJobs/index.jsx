
import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  getSavedJobs,
  getJobs,
  removeSavedJob,
} from "../../Services/jobApi"
import { useAuth } from "../../Context/AuthContext";

import "./index.scss";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const { user } = useAuth();
  // Fetch saved jobs and all jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [savedRes, jobsRes] = await Promise.all([
          getSavedJobs(),
          getJobs(),
        ]);

        const userSavedJobs = savedRes.data.filter(
          (saved) => String(saved.userId) === String(user.id)
        );

        setSavedJobs(userSavedJobs);
        setJobs(jobsRes.data);

      } catch (error) {
        console.error(error);
        setError("Failed to load saved jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Find original job using jobId
  const getJobDetails = (jobId) => {
    return jobs.find(
      (job) => String(job.id) === String(jobId)
    );
  };

  // Remove saved job
  const handleRemove = async (savedId) => {
    try {
      setRemovingId(savedId);

      await removeSavedJob(savedId);

      setSavedJobs((prev) =>
        prev.filter((saved) => saved.id !== savedId)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to remove saved job.");
    } finally {
      setRemovingId(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="saved-jobs-page">
        <div className="saved-message">Loading saved jobs...</div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="saved-jobs-page">
        <div className="saved-message error">{error}</div>
      </div>
    );
  }

  return (
    <div className="saved-jobs-page">
      <div className="saved-jobs-container">

        {/* Header */}
        <div className="saved-header">
          <span className="saved-label">YOUR CAREER LIST</span>
          <h1>Saved Jobs</h1>
          <p>Keep track of opportunities you want to apply for.</p>
        </div>

        {/* Summary */}
        <div className="saved-summary">
          <FaHeart />
          <div>
            <h2>{savedJobs.length}</h2>
            <p>Saved Opportunities</p>
          </div>
        </div>

        {/* Empty State */}
        {savedJobs.length === 0 ? (
          <div className="saved-empty">
            <FaHeart />
            <h2>No Saved Jobs Yet</h2>
            <p>
              Click the heart icon on any job you like
              to save it here.
            </p>

            <Link to="/" className="browse-btn">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="saved-list">
            {savedJobs.map((saved) => {
              const job = getJobDetails(saved.jobId);

              // Job no longer exists
              if (!job) {
                return (
                  <div className="saved-card" key={saved.id}>
                    <div className="saved-job-info">
                      <h3>Job no longer available</h3>
                      <p>This job may have been deleted.</p>
                    </div>

                    <button
                      className="remove-saved-btn"
                      onClick={() => handleRemove(saved.id)}
                      disabled={removingId === saved.id}
                    >
                      {removingId === saved.id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                );
              }

              return (
                <div className="saved-card" key={saved.id}>
                  <div className="saved-job-main">
                    <div className="saved-company-logo">
                      {job.company?.charAt(0) || "J"}
                    </div>

                    <div className="saved-job-info">
                      <h3>{job.title}</h3>
                      <p className="saved-company">{job.company}</p>

                      <div className="saved-job-meta">
                        <span>
                          <FaMapMarkerAlt /> {job.location}
                        </span>

                        <span>
                          <FaBriefcase /> {job.type}
                        </span>

                        <span>
                          <FaClock /> {job.experience}
                        </span>
                      </div>

                      <h4 className="saved-salary">{job.salary}</h4>
                    </div>
                  </div>

                  <div className="saved-actions">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="saved-view-btn"
                    >
                      View Details
                    </Link>

                    <button
                      className="remove-saved-btn"
                      onClick={() => handleRemove(saved.id)}
                      disabled={removingId === saved.id}
                    >
                      {removingId === saved.id
                        ? "Removing..."
                        : "Remove ♥"}
                    </button>
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

export default SavedJobs;
