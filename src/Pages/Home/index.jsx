import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaLaptopCode,
  FaChartLine,
  FaPalette,
  FaBullhorn,
  FaArrowRight,
  FaArrowUp,
  FaUsers,
  FaBuilding,
  FaUserTie
} from "react-icons/fa";

import { getJobs } from "../../Services/jobApi";

import "./index.scss";

const categories = [
  { name: "IT & Software", icon: <FaLaptopCode />, value: "IT" },
  { name: "Marketing", icon: <FaBullhorn />, value: "Marketing" },
  { name: "Design", icon: <FaPalette />, value: "Design" },
  { name: "Business", icon: <FaChartLine />, value: "Business" },
];

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs();

        const activeJobs = response.data.filter(
          (job) => job.status === "Active"
        );

        setJobs(activeJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Search jobs
  const filteredJobs = jobs.filter((job) => {
    const searchMatch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.category?.toLowerCase().includes(search.toLowerCase());

    const locationMatch = job.location
      ?.toLowerCase()
      .includes(location.toLowerCase());

    const categoryMatch = selectedCategory
      ? job.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return searchMatch && locationMatch && categoryMatch;
  });

  // Popular search
  const handlePopularSearch = (keyword) => {
    setSearch(keyword);
    setSelectedCategory("");
  };

  // Category selection
  const handleCategory = (category) => {
    setSelectedCategory(category);
    setSearch("");
    setLocation("");
  };

  // Reset filters
  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setSelectedCategory("");
  };

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}
      <section className="hero-section">
        <div className="hero-container">

          <div className="hero-content">
            <span className="hero-badge">
              YOUR CAREER STARTS HERE
            </span>

            <h1>
              Find Your <span>Dream Job</span>
            </h1>

            <p className="hero-description">
              Discover exciting opportunities and find the perfect career
              that matches your skills, passion, and ambition.
            </p>

            {/* SEARCH BOX */}
            <div className="job-search-box">
              <div className="search-field">
                <FaSearch />

                <input
                  type="text"
                  placeholder="Job title, company or keyword"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedCategory("");
                  }}
                />
              </div>

              <div className="search-divider"></div>

              <div className="location-field">
                <FaMapMarkerAlt />

                <input
                  type="text"
                  placeholder="City or location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <button
                className="search-button"
                onClick={() => {
                  document
                    .getElementById("featured-jobs")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Search Jobs
                <FaSearch />
              </button>
            </div>

            {/* POPULAR SEARCHES */}
            <div className="popular-searches">
              <strong>Popular:</strong>

              <button onClick={() => handlePopularSearch("React")}>
                React Developer
              </button>

              <button onClick={() => handlePopularSearch("Python")}>
                Python Developer
              </button>

              <button onClick={() => handlePopularSearch("Frontend")}>
                Frontend Developer
              </button>
            </div>
          </div>

          {/* HERO SIDE CARD */}
          <div className="hero-side">
            <div className="hero-visual-card">
              <div className="hero-card-top">
                <div className="hero-icon">
                  <FaBriefcase />
                </div>

                <div>
                  <span>Career Opportunities</span>
                  <h3>Find your future</h3>
                </div>
              </div>

              <div className="hero-card-stat">
                <div className="hero-stat-icon">
                  <FaUsers />
                </div>

                <div>
                  <h2>{jobs.length}+</h2>
                  <p>Available Jobs</p>
                </div>
              </div>

              <div className="hero-card-stat">
                <div className="hero-stat-icon green">
                  <FaBuilding />
                </div>

                <div>
                  <h2>Top Companies</h2>
                  <p>Explore career opportunities</p>
                </div>
              </div>

              <div className="hero-card-stat">
                <div className="hero-stat-icon orange">
                  <FaUserTie />
                </div>

                <div>
                  <h2>Build Your Career</h2>
                  <p>Your next opportunity awaits</p>
                </div>
              </div>

              <div className="hero-card-footer">
                <span className="success-dot"></span>
                New opportunities available
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="categories-section">
        <div className="section-container">

          <div className="section-heading">
            <div>
              <span className="section-label">EXPLORE CATEGORIES</span>
              <h2>Browse by Category</h2>
              <p>Find opportunities in your favorite field.</p>
            </div>

            <button className="clear-category" onClick={clearFilters}>
              View all categories
              <FaArrowRight />
            </button>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`category-card ${
                  selectedCategory === category.value ? "selected" : ""
                }`}
                onClick={() => handleCategory(category.value)}
              >
                <div className="category-icon">
                  {category.icon}
                </div>

                <h3>{category.name}</h3>

                <span>
                  Explore jobs
                  <FaArrowRight />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED JOBS ================= */}
      <section className="featured-section" id="featured-jobs">
        <div className="section-container">

          <div className="section-heading">
            <div>
              <span className="section-label">CAREER OPPORTUNITIES</span>
              <h2>Featured Jobs</h2>
              <p>Explore the latest openings and take your next step.</p>
            </div>

            {(search || location || selectedCategory) && (
              <button
                className="clear-category"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* RESULTS INFO */}
          <div className="job-results-info">
            <span>
              {selectedCategory
                ? `Category: ${selectedCategory}`
                : search
                ? `Search: ${search}`
                : "Latest opportunities"}
            </span>

            <span>{filteredJobs.length} jobs found</span>
          </div>

          {/* JOB LIST */}
          {loading ? (
            <div className="jobs-loading">
              <div className="loader"></div>
              <p>Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="no-jobs">
              <FaBriefcase />
              <h3>No jobs found</h3>
              <p>Try another search keyword or location.</p>

              <button onClick={clearFilters}>
                Clear Search
              </button>
            </div>
          ) : (
            <div className="featured-jobs-grid">
              {filteredJobs.slice(0, 6).map((job) => (
                <div className="featured-job-card" key={job.id}>
                  <div className="job-card-header">
                    <div className="company-icon">
                      <FaBriefcase />
                    </div>

                    <span className="job-status">
                      {job.status || "Active"}
                    </span>
                  </div>

                  <h3>{job.title}</h3>

                  <p className="company-name">
                    {job.company}
                  </p>

                  <div className="job-card-details">
                    <span>
                      <FaMapMarkerAlt />
                      {job.location || "Location not specified"}
                    </span>

                    <span>
                      <FaBriefcase />
                      {job.type || "Full Time"}
                    </span>
                  </div>

                  <div className="job-card-bottom">
                    <div className="job-salary">
                      {job.salary || "Salary not disclosed"}
                    </div>

                    <Link
                      to={`/jobs/${job.id}`}
                      className="job-view-btn"
                    >
                      View Job
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW ALL */}
          <div className="view-all-jobs">
            <Link to="/jobs">
              Explore All Jobs
              <FaArrowRight />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">

            <div className="stat-item">
              <FaBriefcase />
              <h2>{jobs.length}+</h2>
              <p>Active Jobs</p>
            </div>

            <div className="stat-item">
              <FaBuilding />
              <h2>{new Set(jobs.map((job) => job.company)).size}+</h2>
              <p>Companies</p>
            </div>

            <div className="stat-item">
              <FaUsers />
              <h2>100+</h2>
              <p>Job Seekers</p>
            </div>

            <div className="stat-item">
              <FaChartLine />
              <h2>Career</h2>
              <p>Growth Opportunities</p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card">
            <div className="cta-content">
              <span>YOUR NEXT CHAPTER STARTS TODAY</span>
              <h2>Ready to find your dream job?</h2>
              <p>
                Explore new opportunities and take the next step in your career.
              </p>

              <Link to="/jobs" className="cta-button">
                Explore Jobs
                <FaArrowRight />
              </Link>
            </div>

            <div className="cta-decoration">
              <FaBriefcase />
              <FaArrowUp />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;