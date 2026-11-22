import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaFilter,
  FaArrowRight,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { getJobs } from "../../Services/jobApi";
import "./index.scss";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [sort, setSort] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Fetch jobs from JSON Server
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs();
        setJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Convert salary text to approximate LPA number
  const getSalaryValue = (salaryText) => {
    if (!salaryText) return 0;

    const text = String(salaryText).toLowerCase();

    // Example: 3-5 LPA
    const range = text.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);

    if (range) {
      return (Number(range[1]) + Number(range[2])) / 2;
    }

    // Example: 5 LPA
    const number = text.match(/(\d+(?:\.\d+)?)/);

    return number ? Number(number[1]) : 0;
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const keyword = search.toLowerCase();

    const searchMatch =
      !keyword ||
      job.title?.toLowerCase().includes(keyword) ||
      job.company?.toLowerCase().includes(keyword) ||
      job.description?.toLowerCase().includes(keyword) ||
      job.category?.toLowerCase().includes(keyword);

    const locationMatch =
      !location ||
      job.location?.toLowerCase().includes(location.toLowerCase());

    const categoryMatch =
      !category ||
      job.category?.toLowerCase().includes(category.toLowerCase());

    const typeMatch =
      !jobType ||
      job.type?.toLowerCase().includes(jobType.toLowerCase());

    const experienceMatch =
      !experience ||
      job.experience?.toLowerCase().includes(experience.toLowerCase());

    const salaryValue = getSalaryValue(job.salary);

    let salaryMatch = true;

    if (salary === "0-3") salaryMatch = salaryValue > 0 && salaryValue <= 3;
    if (salary === "3-6") salaryMatch = salaryValue > 3 && salaryValue <= 6;
    if (salary === "6-10") salaryMatch = salaryValue > 6 && salaryValue <= 10;
    if (salary === "10+") salaryMatch = salaryValue > 10;

    const activeMatch =
      !job.status || job.status.toLowerCase() === "active";

    return (
      searchMatch &&
      locationMatch &&
      categoryMatch &&
      typeMatch &&
      experienceMatch &&
      salaryMatch &&
      activeMatch
    );
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sort === "salary-high") {
      return getSalaryValue(b.salary) - getSalaryValue(a.salary);
    }

    if (sort === "salary-low") {
      return getSalaryValue(a.salary) - getSalaryValue(b.salary);
    }

    if (sort === "company") {
      return (a.company || "").localeCompare(b.company || "");
    }

    return new Date(b.appliedAt || b.createdAt || 0) -
      new Date(a.appliedAt || a.createdAt || 0);
  });

  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);

  const startIndex = (currentPage - 1) * jobsPerPage;

  const paginatedJobs = sortedJobs.slice(
    startIndex,
    startIndex + jobsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, category, jobType, experience, salary, sort]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("");
    setJobType("");
    setExperience("");
    setSalary("");
    setSort("newest");
    setCurrentPage(1);
  };

  const hasFilters =
    search || location || category || jobType || experience || salary;

  return (
    <div className="jobs-page">

      {/* HEADER */}
      <section className="jobs-header">
        <div className="jobs-header-container">
          <span className="jobs-header-badge">
            <FaBriefcase />
            CAREER OPPORTUNITIES
          </span>

          <h1>Find Your Next <span>Opportunity</span></h1>

          <p>
            Explore jobs that match your skills, experience, and career goals.
          </p>

          <div className="jobs-search-bar">
            <div className="jobs-search-input">
              <FaSearch />
              <input
                type="text"
                placeholder="Job title, company or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="jobs-location-input">
              <FaMapMarkerAlt />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button
              onClick={() =>
                document
                  .getElementById("jobs-results")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Search Jobs
              <FaSearch />
            </button>
          </div>
        </div>
      </section>

      {/* JOB CONTENT */}
      <section className="jobs-content" id="jobs-results">
        <div className="jobs-layout">

          {/* FILTER SIDEBAR */}
          <aside className="jobs-filter-sidebar">

            <div className="filter-header">
              <div>
                <FaFilter />
                <h3>Filters</h3>
              </div>

              <button onClick={clearFilters}>Reset</button>
            </div>

            {/* CATEGORY */}
            <div className="filter-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="IT">IT & Software</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Finance">Finance</option>
                <option value="HR">Human Resources</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            {/* JOB TYPE */}
            <div className="filter-group">
              <label>Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            {/* EXPERIENCE */}
            <div className="filter-group">
              <label>Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">All Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="0-1">0-1 Years</option>
                <option value="1-2">1-2 Years</option>
                <option value="2-3">2-3 Years</option>
                <option value="3">3+ Years</option>
              </select>
            </div>

            {/* SALARY */}
            <div className="filter-group">
              <label>Salary (Average LPA)</label>
              <select
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              >
                <option value="">Any Salary</option>
                <option value="0-3">0 – 3 LPA</option>
                <option value="3-6">3 – 6 LPA</option>
                <option value="6-10">6 – 10 LPA</option>
                <option value="10+">10+ LPA</option>
              </select>
            </div>

            {hasFilters && (
              <button className="clear-all-filters" onClick={clearFilters}>
                <FaTimes />
                Clear All Filters
              </button>
            )}
          </aside>

          {/* JOB LIST */}
          <div className="jobs-list-section">

            <div className="jobs-list-heading">
              <div>
                <h2>Available Jobs</h2>
                <p>
                  Showing <strong>{filteredJobs.length}</strong> opportunities
                </p>
              </div>

              <div className="jobs-sort">
                <label>Sort by:</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                  <option value="company">Company Name</option>
                </select>
              </div>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="jobs-loading">
                <div className="jobs-spinner"></div>
                <p>Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              /* EMPTY */
              <div className="jobs-empty">
                <FaBriefcase />
                <h3>No jobs found</h3>
                <p>Try changing your search or filters.</p>
                <button onClick={clearFilters}>Reset Filters</button>
              </div>
            ) : (
              /* JOB CARDS */
              <div className="jobs-list">
                {paginatedJobs.map((job) => (
                  <article className="job-list-card" key={job.id}>

                    <div className="job-list-top">
                      <div className="job-list-company-icon">
                        <FaBriefcase />
                      </div>

                      <div className="job-list-title">
                        <h3>{job.title}</h3>
                        <p>{job.company}</p>
                      </div>

                      <span className="job-list-status">
                        {job.status || "Active"}
                      </span>
                    </div>

                    <div className="job-list-meta">
                      <span>
                        <FaMapMarkerAlt />
                        {job.location || "Location not specified"}
                      </span>

                      <span>
                        <FaBriefcase />
                        {job.type || "Full Time"}
                      </span>

                      <span className="job-experience">
                        {job.experience || "Experience not specified"}
                      </span>
                    </div>

                    <p className="job-list-description">
                      {job.description
                        ? job.description.length > 160
                          ? job.description.slice(0, 160) + "..."
                          : job.description
                        : "Explore this opportunity and apply today."}
                    </p>

                    <div className="job-list-bottom">
                      <div className="job-list-salary">
                        {job.salary || "Salary not disclosed"}
                      </div>

                      <Link to={`/jobs/${job.id}`} className="job-list-view">
                        View Details
                        <FaArrowRight />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {!loading && totalPages > 1 && (
              <div className="jobs-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <FaChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default Jobs;