
import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import {
  getSavedJobByJobId,
  saveJob,
  removeSavedJob
} from "../../Services/jobApi";

import { useAuth } from "../../Context/AuthContext";
import "./index.scss";

const JobCard = (props) => {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // Check if job is already saved
  useEffect(() => {
    const checkSavedJob = async () => {
      if (!user) {
        setSaved(false);
        setSavedId(null);
        return;
      }

      try {
        const result = await getSavedJobByJobId(props.id, user.id);

        if (result) {
          setSaved(true);
          setSavedId(result.id);
        } else {
          setSaved(false);
          setSavedId(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkSavedJob();
  }, [props.id, user]);

  // Open job details
  const openJob = () => {
    navigate(`/jobs/${props.id}`);
  };

  // Save or remove saved job
  const handleSave = async (e) => {
    e.stopPropagation();

    if (loading) return;

    if (!user) {
      alert("Please login to save jobs.");
      return;
    }

    setLoading(true);

    try {
      if (saved) {
        await removeSavedJob(savedId);
        setSaved(false);
        setSavedId(null);
      } else {
        const response = await saveJob(props.id, user.id);
        setSaved(true);
        setSavedId(response.data.id);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="job-card"
      onClick={openJob}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") openJob();
      }}
    >
      <div className="job-top">
        <div className="company-logo">
          {props.company?.charAt(0)}
        </div>

        <button
          type="button"
          className={`save-btn ${saved ? "saved" : ""}`}
          onClick={handleSave}
          disabled={loading}
          aria-label={saved ? "Remove saved job" : "Save job"}
          title={saved ? "Remove from Saved Jobs" : "Save Job"}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      <h3>{props.title}</h3>

      <p className="company-name">{props.company}</p>

      <div className="job-info">
        <span>
          <FaMapMarkerAlt /> {props.location}
        </span>

        <span>
          <FaBriefcase /> {props.type}
        </span>

        <span>
          <FaClock /> {props.experience}
        </span>
      </div>

      <div className="job-bottom">
        <h4>{props.salary}</h4>

        <Link
          to={`/jobs/${props.id}`}
          className="view-details"
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
