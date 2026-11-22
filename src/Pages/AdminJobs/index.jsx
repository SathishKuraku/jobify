
import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaBriefcase,
  FaMapMarkerAlt
} from "react-icons/fa";

import {
  getJobs,
  addJob,
  updateJob,
  deleteJob
} from "../../Services/jobApi";

import "./index.scss";

const initialForm = {
  title: "",
  company: "",
  location: "",
  type: "Full Time",
  experience: "Fresher",
  salary: "",
  category: "IT",
  description: "",
  status: "Active"
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobs();
      setJobs(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load jobs. Please start JSON Server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Search filter
  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.company} ${job.location} ${job.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Open Add Job modal
  const handleAdd = () => {
    setEditingJob(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  // Open Edit modal
  const handleEdit = (job) => {
    setEditingJob(job);

    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      type: job.type || "Full Time",
      experience: job.experience || "Fresher",
      salary: job.salary || "",
      category: job.category || "IT",
      description: job.description || "",
      status: job.status || "Active"
    });

    setModalOpen(true);
  };

  // Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Add or Update job
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingJob) {
        await updateJob(editingJob.id, form);
      } else {
        await addJob(form);
      }

      setModalOpen(false);
      setForm(initialForm);
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      setError("Unable to save job. Please try again.");
    }
  };

  // Delete job
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await deleteJob(id);
      setJobs((prev) =>
        prev.filter((job) => String(job.id) !== String(id))
      );
    } catch (err) {
      setError("Failed to delete job.");
    }
  };

  // Toggle job status
  const handleToggleStatus = async (job) => {
    const updatedJob = {
      ...job,
      status: job.status === "Active" ? "Closed" : "Active"
    };

    try {
      await updateJob(job.id, updatedJob);

      setJobs((prev) =>
        prev.map((item) =>
          String(item.id) === String(job.id) ? updatedJob : item
        )
      );
    } catch (err) {
      setError("Failed to update job status.");
    }
  };

  return (
    <div className="admin-jobs-page">
      <div className="admin-jobs-container">

        {/* PAGE HEADER */}
        <div className="admin-jobs-header">
          <div>
            <span className="admin-jobs-label">
              <FaBriefcase /> JOB MANAGEMENT
            </span>

            <h1>Manage Jobs</h1>

            <p>Create, update and manage job listings.</p>
          </div>

          <button className="add-job-btn" onClick={handleAdd}>
            <FaPlus />
            Add New Job
          </button>
        </div>

        {/* STATS */}
        <div className="admin-jobs-stats">
          <div className="job-stat-card">
            <div className="job-stat-icon total">
              <FaBriefcase />
            </div>
            <div>
              <span>Total Jobs</span>
              <h3>{jobs.length}</h3>
            </div>
          </div>

          <div className="job-stat-card">
            <div className="job-stat-icon active">
              <FaBriefcase />
            </div>
            <div>
              <span>Active Jobs</span>
              <h3>
                {jobs.filter((job) => job.status === "Active").length}
              </h3>
            </div>
          </div>

          <div className="job-stat-card">
            <div className="job-stat-icon closed">
              <FaBriefcase />
            </div>
            <div>
              <span>Closed Jobs</span>
              <h3>
                {jobs.filter((job) => job.status === "Closed").length}
              </h3>
            </div>
          </div>
        </div>

        {/* JOBS TABLE */}
        <div className="admin-jobs-card">
          <div className="admin-jobs-toolbar">
            <div>
              <h2>All Job Listings</h2>
              <p>{filteredJobs.length} jobs found</p>
            </div>

            <div className="admin-jobs-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search jobs, companies, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="admin-jobs-error">{error}</div>}

          {loading ? (
            <div className="admin-jobs-loading">Loading jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="admin-jobs-empty">
              <FaBriefcase />
              <h3>No jobs found</h3>
              <p>Add a new job or change your search.</p>
            </div>
          ) : (
            <div className="admin-jobs-table-wrapper">
              <table className="admin-jobs-table">
                <thead>
                  <tr>
                    <th>Job Details</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <div className="admin-job-title">{job.title}</div>
                        <div className="admin-job-company">{job.company}</div>
                      </td>

                      <td>
                        <span className="admin-job-location">
                          <FaMapMarkerAlt />
                          {job.location}
                        </span>
                      </td>

                      <td>
                        <span className="admin-job-type">{job.type}</span>
                      </td>

                      <td>{job.salary || "Not specified"}</td>

                      <td>
                        <button
                          className={`admin-job-status ${
                            job.status === "Active" ? "status-active" : "status-closed"
                          }`}
                          onClick={() => handleToggleStatus(job)}
                          title="Click to change status"
                        >
                          {job.status || "Active"}
                        </button>
                      </td>

                      <td>
                        <div className="admin-job-actions">
                          <button
                            className="edit-job-btn"
                            onClick={() => handleEdit(job)}
                            title="Edit job"
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="delete-job-btn"
                            onClick={() => handleDelete(job.id)}
                            title="Delete job"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="admin-job-modal-overlay">
          <div className="admin-job-modal">
            <div className="admin-job-modal-header">
              <div>
                <h2>{editingJob ? "Edit Job" : "Add New Job"}</h2>
                <p>Enter job details below</p>
              </div>

              <button
                className="close-job-modal"
                onClick={() => setModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-job-form-grid">
                <div className="admin-job-form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Python Developer"
                    required
                  />
                </div>

                <div className="admin-job-form-group">
                  <label>Company *</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    required
                  />
                </div>

                <div className="admin-job-form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore"
                    required
                  />
                </div>

                <div className="admin-job-form-group">
                  <label>Job Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>

                <div className="admin-job-form-group">
                  <label>Experience</label>
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                  >
                    <option>Fresher</option>
                    <option>0-1 Years</option>
                    <option>1-3 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years</option>
                  </select>
                </div>

                <div className="admin-job-form-group">
                  <label>Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="e.g. 3-5 LPA"
                  />
                </div>

                <div className="admin-job-form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option>IT</option>
                    <option>Software</option>
                    <option>Frontend</option>
                    <option>Backend</option>
                    <option>Full Stack</option>
                    <option>Data</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>HR</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="admin-job-form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Active</option>
                    <option>Closed</option>
                  </select>
                </div>

                <div className="admin-job-form-group full">
                  <label>Job Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter job description..."
                    rows="5"
                    required
                  />
                </div>
              </div>

              <div className="admin-job-modal-actions">
                <button
                  type="button"
                  className="cancel-job-btn"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-job-btn">
                  {editingJob ? "Update Job" : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
