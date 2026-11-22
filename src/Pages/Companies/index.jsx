import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaArrowRight,
} from "react-icons/fa";

import { getJobs } from "../../Services/jobApi";
import "./index.scss";

const Companies = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs();
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Get active jobs
  const activeJobs = jobs.filter(
    (job) => !job.status || job.status.toLowerCase() === "active"
  );

  // Create unique companies from job data
  const companies = Object.values(
    activeJobs.reduce((acc, job) => {
      const name = job.company?.trim();

      if (!name) return acc;

        if (!acc[name]) {
        acc[name] = {
          name,
          location: job.location || "Not specified",
          category: job.category || "General",
          jobs: [],
          website: job.website || "",
          description: job.companyDescription || "",
        };
      }

      acc[name].jobs.push(job);

      return acc;
    }, {})
  );

  // Get industries
  const industries = [...new Set(companies.map((company) => company.category))];

  // Filter companies
  const filteredCompanies = companies.filter((company) => {
    const searchMatch =
      !search ||
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.category.toLowerCase().includes(search.toLowerCase());

    const locationMatch =
      !location ||
      company.location.toLowerCase().includes(location.toLowerCase());

    const industryMatch =
      !industry ||
      company.category.toLowerCase().includes(industry.toLowerCase());

    return searchMatch && locationMatch && industryMatch;
  });

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setIndustry("");
  };

  return (
    <div className="companies-page">

      {/* HERO */}
      <section className="companies-hero">
        <div className="companies-container">
          <span className="companies-badge">
            <FaBuilding />
            COMPANY DIRECTORY
          </span>

          <h1>Discover <span>Companies</span></h1>

          <p>
            Explore companies, discover opportunities, and find your next career destination.
          </p>

          <div className="companies-search">
            <div className="companies-search-input">
              <FaSearch />
              <input
                type="text"
                placeholder="Search company or industry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="companies-location-input">
              <FaMapMarkerAlt />
              <input
                type="text"
                placeholder="Search location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button onClick={() => document.getElementById("companies-results")?.scrollIntoView({ behavior: "smooth" })}>
              Search Companies
              <FaSearch />
            </button>
          </div>
        </div>
      </section>

      {/* DIRECTORY */}
      <section className="companies-content" id="companies-results">
        <div className="companies-container">

          {/* HEADER */}
          <div className="companies-heading">
            <div>
              <h2>Explore Companies</h2>
              <p>Find organizations hiring for your next opportunity.</p>
            </div>

            <span className="companies-count">
              {filteredCompanies.length} Companies
            </span>
          </div>

          {/* FILTERS */}
          <div className="companies-filters">
            <div className="company-filter">
              <label>Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">All Industries</option>

                {industries.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button className="companies-reset" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="companies-loading">
              <div className="companies-spinner"></div>
              <p>Loading companies...</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="companies-empty">
              <FaBuilding />
              <h3>No companies found</h3>
              <p>Try a different search or location.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="companies-grid">
              {filteredCompanies.map((company) => (
                <article className="company-card" key={company.name}>
                  <div className="company-card-top">
                    <div className="company-card-logo">
                      <FaBuilding />
                    </div>

                    <span className="company-card-industry">
                      {company.category}
                    </span>
                  </div>

                  <h3>{company.name}</h3>

                  <div className="company-card-location">
                    <FaMapMarkerAlt />
                    {company.location}
                  </div>

                  <p className="company-card-description">
                    {company.description ||
                      `${company.name} is looking for talented candidates to join its team.`}
                  </p>

                  <div className="company-card-footer">
                    <span className="company-open-jobs">
                      <FaBriefcase />
                      {company.jobs.length} Open Jobs
                    </span>

                    <Link
                      to={`/companies/${encodeURIComponent(company.name)}`}
                      className="company-view-btn"
                    >
                      View Company
                      <FaArrowRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Companies;