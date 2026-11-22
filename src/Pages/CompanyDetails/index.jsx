import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaBriefcase,
  FaArrowRight,
  FaSearch,
  FaUsers,
} from "react-icons/fa";

import { getJobs } from "../../Services/jobApi";
import "./index.scss";

const CompanyDetails = () => {
  const { companyName } = useParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs();
        setJobs(response.data);
      } catch (error) {
        console.error("Company jobs error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Decode company name from URL
  const company = decodeURIComponent(companyName || "").replace(/-/g, " ");

  // Find company jobs
  const companyJobs = jobs.filter(
    (job) =>
      job.company?.toLowerCase() === company.toLowerCase() &&
      (!job.status || job.status.toLowerCase() === "active")
  );

  // Search company jobs
  const filteredJobs = companyJobs.filter((job) => {
    const keyword = search.toLowerCase();

    return (
      job.title?.toLowerCase().includes(keyword) ||
      job.location?.toLowerCase().includes(keyword) ||
      job.type?.toLowerCase().includes(keyword)
    );
  });

  // Company not found
  const companyExists = jobs.some(
    (job) => job.company?.toLowerCase() === company.toLowerCase()
  );

  if (loading) {
    return (
      <div className="company-loading">
        <div className="company-spinner"></div>
        <p>Loading company...</p>
      </div>
    );
  }

  if (!companyExists) {
    return (
      <div className="company-not-found">
        <FaBuilding />
        <h2>Company Not Found</h2>
        <p>We couldn't find this company in our job listings.</p>

        <Link to="/jobs">Browse Jobs</Link>
      </div>
    );
  }

  return (
    <div className="company-details-page">
      {/* COMPANY HERO */}
      <section className="company-hero">
        <div className="company-container">
          <div className="company-profile">
            <div className="company-logo">
              <FaBuilding />
            </div>

            <div className="company-profile-info">
              <span className="company-label">COMPANY PROFILE</span>
              <h1>{company}</h1>

              <div className="company-meta">
                <span>
                  <FaMapMarkerAlt />
                  {companyJobs[0]?.location || "Location not specified"}
                </span>

                <span>
                  <FaBriefcase />
                  {companyJobs.length} Open Jobs
                </span>
              </div>
            </div>
          </div>

          <div className="company-hero-stats">
            <div className="company-stat">
              <FaBriefcase />
              <div>
                <strong>{companyJobs.length}</strong>
                <span>Open Positions</span>
              </div>
            </div>

            <div className="company-stat">
              <FaUsers />
              <div>
                <strong>Hiring</strong>
                <span>Currently Recruiting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANY CONTENT */}
      <section className="company-content">
        <div className="company-container company-layout">
          {/* ABOUT */}
          <main className="company-main">
            <div className="company-about-card">
              <h2>About {company}</h2>

              <p>
                {companyJobs[0]?.companyDescription ||
                  `${company} is an organization offering career opportunities to talented professionals. Explore the available positions and find a role that matches your skills and career goals.`}
              </p>

              <div className="company-information">
                <div className="company-info-item">
                  <FaBuilding />
                  <div>
                    <span>Industry</span>
                    <strong>
                      {companyJobs[0]?.category || "Technology"}
                    </strong>
                  </div>
                </div>

                <div className="company-info-item">
                  <FaMapMarkerAlt />
                  <div>
                    <span>Location</span>
                    <strong>
                      {companyJobs[0]?.location || "Not specified"}
                    </strong>
                  </div>
                </div>

                <div className="company-info-item">
                  <FaBriefcase />
                  <div>
                    <span>Job Openings</span>
                    <strong>{companyJobs.length} Positions</strong>
                  </div>
                </div>

                <div className="company-info-item">
                  <FaGlobe />
                  <div>
                    <span>Website</span>
                    <strong>
                      {companyJobs[0]?.website || "Not provided"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* JOBS */}
            <div className="company-jobs-section">
              <div className="company-jobs-heading">
                <div>
                  <h2>Open Positions</h2>
                  <p>Explore opportunities at {company}</p>
                </div>

                <span className="company-job-count">
                  {filteredJobs.length} Jobs
                </span>
              </div>

              {/* SEARCH */}
              <div className="company-job-search">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search job title or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* JOB LIST */}
              {filteredJobs.length === 0 ? (
                <div className="company-no-jobs">
                  <FaBriefcase />
                  <h3>No jobs found</h3>
                  <p>Try searching with another keyword.</p>
                </div>
              ) : (
                <div className="company-job-list">
                  {filteredJobs.map((job) => (
                    <article className="company-job-card" key={job.id}>
                      <div className="company-job-top">
                        <div className="company-job-icon">
                          <FaBuilding />
                        </div>

                        <div className="company-job-title">
                          <h3>{job.title}</h3>
                          <p>{job.company}</p>
                        </div>
                      </div>

                      <div className="company-job-meta">
                        <span>
                          <FaMapMarkerAlt />
                          {job.location}
                        </span>

                        <span>
                          <FaBriefcase />
                          {job.type}
                        </span>

                        <span>{job.experience}</span>
                      </div>

                      <div className="company-job-bottom">
                        <strong>{job.salary || "Salary not disclosed"}</strong>

                        <Link to={`/jobs/${job.id}`}>
                          View Job
                          <FaArrowRight />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* SIDEBAR */}
          <aside className="company-sidebar">
            <div className="company-sidebar-card">
              <h3>Company Overview</h3>

              <div className="company-sidebar-item">
                <span>Company Name</span>
                <strong>{company}</strong>
              </div>

              <div className="company-sidebar-item">
                <span>Industry</span>
                <strong>{companyJobs[0]?.category || "Technology"}</strong>
              </div>

              <div className="company-sidebar-item">
                <span>Location</span>
                <strong>{companyJobs[0]?.location || "Not specified"}</strong>
              </div>

              <div className="company-sidebar-item">
                <span>Open Positions</span>
                <strong>{companyJobs.length}</strong>
              </div>

              <Link to="/jobs" className="company-browse-btn">
                Browse All Jobs
                <FaArrowRight />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default CompanyDetails;