
import React, { useEffect, useState } from "react";

import {
  getApplications,
  getJobs,
  updateApplication
} from "../../Services/jobApi";
import ApplicationModal from "../../Components/ApplicationModal";
import { addNotification } from "../../Services/jobApi";
import "./index.scss";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobFilter, setJobFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch applications and jobs
  const fetchData = async () => {
    try {
      const [applicationRes, jobRes] = await Promise.all([
        getApplications(),
        getJobs()
      ]);

      setApplications(applicationRes.data);
      setJobs(jobRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get job title using job ID
  const getJobTitle = (jobId) => {
    const job = jobs.find(
      (job) => String(job.id) === String(jobId)
    );

    return job ? job.title : "Job not found";
  };

  const handleStatusChange = async (application, newStatus) => {
    try {
      await updateApplication(application.id, {
        status: newStatus
      });

      // Notify applicant
      if (application.userId) {
        await addNotification({
          userId: application.userId,
          type: "status",
          title: "Application Status Updated",
          message: `Your application for ${application.jobTitle || "a job"} is now ${newStatus}.`,
          read: false,
          link: "/my-applications",
          createdAt: new Date().toISOString()
        });
      }

      // Refresh application list
      const response = await getApplications();
      setApplications(response.data);

    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  // Search and filter applications
  const filteredApplications = applications.filter((application) => {
    const applicantName = (
      application.name || application.fullName || ""
    ).toLowerCase();

    const applicantEmail = (
      application.email || ""
    ).toLowerCase();

    const jobTitle = getJobTitle(application.jobId).toLowerCase();

    const searchText = search.toLowerCase();

    const searchMatch =
      applicantName.includes(searchText) ||
      applicantEmail.includes(searchText) ||
      jobTitle.includes(searchText);

    const statusMatch =
      statusFilter === "All" ||
      (application.status || "Pending") === statusFilter;

    const jobMatch =
      jobFilter === "All" ||
      String(application.jobId) === String(jobFilter);

    return searchMatch && statusMatch && jobMatch;
  });

  // Statistics
  const totalApplications = applications.length;

  const pendingCount = applications.filter(
    (application) => (application.status || "Pending") === "Pending"
  ).length;

  const shortlistedCount = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  const hiredCount = applications.filter(
    (application) => application.status === "Hired"
  ).length;

  if (loading) {
    return (
      <div className="admin-applications-loading">
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="admin-applications">

      {/* Header */}
      <div className="applications-header">
        <div>
          <span className="admin-label">ADMIN PANEL</span>
          <h1>Applications Management</h1>
          <p>Manage candidates and track their hiring progress.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="application-stats">

        <div className="stat-card">
          <div className="stat-top">
            <span>Total Applications</span>
            <div className="stat-icon purple">A</div>
          </div>
          <h2>{totalApplications}</h2>
          <p>All received applications</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Pending</span>
            <div className="stat-icon yellow">P</div>
          </div>
          <h2>{pendingCount}</h2>
          <p>Waiting for review</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Shortlisted</span>
            <div className="stat-icon blue">S</div>
          </div>
          <h2>{shortlistedCount}</h2>
          <p>Selected candidates</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Hired</span>
            <div className="stat-icon green">H</div>
          </div>
          <h2>{hiredCount}</h2>
          <p>Successfully hired</p>
        </div>

      </div>

      {/* Search and Filters */}
      <div className="applications-toolbar">

        <div className="applications-search">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search applicant, email or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Hired">Hired</option>
        </select>

        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
        >
          <option value="All">All Jobs</option>

          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

      </div>

      {/* Table Heading */}
      <div className="applications-table-heading">
        <div>
          <h2>All Applications</h2>
          <p>Review and manage job applicants</p>
        </div>

        <span className="application-count">
          {filteredApplications.length} Applications
        </span>
      </div>

      {/* Applications Table */}
      <div className="applications-table-wrapper">

        <table className="applications-table">

          <thead>
            <tr>
              <th>Applicant</th>
              <th>Email</th>
              <th>Applied For</th>
              <th>Date</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <tr key={application.id}>

                  {/* Applicant */}
                  <td>
                    <div className="applicant-cell">
                      <div className="applicant-avatar">
                        {(application.name || application.fullName || "A")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <strong>
                        {application.name || application.fullName || "Applicant"}
                      </strong>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="email-cell">
                    {application.email || "N/A"}
                  </td>

                  {/* Job */}
                  <td className="job-cell">
                    {getJobTitle(application.jobId)}
                  </td>

                  {/* Date */}
                  <td>
                    {application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : application.date || "N/A"}
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span
                      className={`application-status ${(application.status || "Pending")
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {application.status || "Pending"}
                    </span>
                  </td>

                  {/* Update Status */}
                  <td>
                    <select
                      className="status-select"
                      value={application.status || "Pending"}
                      onChange={(e) =>
                        handleStatusChange(application.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hired">Hired</option>
                    </select>
                  </td>

                  {/* View Details */}
                  <td>
                    <button
                      className="view-details-btn"
                      onClick={() => setSelectedApplication(application)}
                    >
                      View Details
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-applications">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          jobTitle={getJobTitle(selectedApplication.jobId)}
          onClose={() => setSelectedApplication(null)}
        />
      )}

    </div>
  );
}

export default AdminApplications;
