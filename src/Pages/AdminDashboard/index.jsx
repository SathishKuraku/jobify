
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBriefcase,
  FaUsers,
  FaClipboardList,
  FaCheckCircle,
  FaPlus,
  FaArrowRight,
  FaChartBar
} from "react-icons/fa";

import {
  getJobs,
  getApplications,
  getUsers
} from "../../Services/jobApi";

import "./index.scss";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, applicationsRes, usersRes] = await Promise.all([
          getJobs(),
          getApplications(),
          getUsers()
        ]);

        setJobs(jobsRes.data);
        setApplications(applicationsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeJobs = jobs.filter(
    (job) => job.status === "Active"
  );

  const pendingApplications = applications.filter(
    (application) => application.status === "Pending"
  );

  const acceptedApplications = applications.filter(
    (application) => application.status === "Accepted"
  );

  const recentJobs = [...jobs].slice(-5).reverse();

  const stats = [
    {
      title: "Total Jobs",
      value: jobs.length,
      icon: <FaBriefcase />,
      color: "purple",
      link: "/admin/jobs"
    },
    {
      title: "Active Jobs",
      value: activeJobs.length,
      icon: <FaCheckCircle />,
      color: "green",
      link: "/admin/jobs"
    },
    {
      title: "Applications",
      value: applications.length,
      icon: <FaClipboardList />,
      color: "blue",
      link: "/admin/applications"
    },
    {
      title: "Total Users",
      value: users.length,
      icon: <FaUsers />,
      color: "orange",
      link: "/admin/users"
    }
  ];

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <span className="dashboard-label">
              <FaChartBar /> ADMIN OVERVIEW
            </span>

            <h1>Dashboard</h1>

            <p>
              Welcome to Jobify Admin Panel. Here's what's happening today.
            </p>
          </div>

          <Link to="/admin/jobs" className="dashboard-add-job-btn">
            <FaPlus />
            Add New Job
          </Link>
        </div>

        {/* STATISTICS */}
        <div className="dashboard-stats">
          {stats.map((stat, index) => (
            <Link
              to={stat.link}
              className="dashboard-stat-card"
              key={index}
            >
              <div className={`dashboard-stat-icon ${stat.color}`}>
                {stat.icon}
              </div>

              <div className="dashboard-stat-info">
                <span>{stat.title}</span>
                <h2>{stat.value}</h2>
              </div>

              <FaArrowRight className="dashboard-stat-arrow" />
            </Link>
          ))}
        </div>

        {/* APPLICATION SUMMARY */}
        <div className="dashboard-summary-grid">
          <div className="dashboard-summary-card">
            <div className="summary-card-header">
              <div>
                <h3>Application Overview</h3>
                <p>Current application status</p>
              </div>
              <FaClipboardList />
            </div>

            <div className="summary-item">
              <span>Pending Applications</span>
              <strong>{pendingApplications.length}</strong>
            </div>

            <div className="summary-item">
              <span>Accepted Applications</span>
              <strong>{acceptedApplications.length}</strong>
            </div>

            <div className="summary-item">
              <span>All Applications</span>
              <strong>{applications.length}</strong>
            </div>

            <Link to="/admin/applications" className="summary-link">
              View Applications <FaArrowRight />
            </Link>
          </div>

          {/* QUICK ACTIONS */}
          <div className="dashboard-summary-card">
            <div className="summary-card-header">
              <div>
                <h3>Quick Actions</h3>
                <p>Manage your Jobify portal</p>
              </div>
              <FaBriefcase />
            </div>

            <div className="quick-actions">
              <Link to="/admin/jobs">
                <FaBriefcase />
                <span>Manage Jobs</span>
                <FaArrowRight />
              </Link>

              <Link to="/admin/applications">
                <FaClipboardList />
                <span>Manage Applications</span>
                <FaArrowRight />
              </Link>

              <Link to="/admin/users">
                <FaUsers />
                <span>Manage Users</span>
                <FaArrowRight />
              </Link>

              <Link to="/admin/analytics">
                <FaChartBar />
                <span>View Analytics</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* RECENT JOBS */}
        <div className="dashboard-recent-jobs">
          <div className="recent-jobs-header">
            <div>
              <h3>Recent Job Listings</h3>
              <p>Latest jobs in your portal</p>
            </div>

            <Link to="/admin/jobs">
              View All <FaArrowRight />
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="dashboard-no-jobs">
              <FaBriefcase />
              <p>No jobs available yet.</p>

              <Link to="/admin/jobs">
                Add your first job
              </Link>
            </div>
          ) : (
            <div className="recent-jobs-list">
              {recentJobs.map((job) => (
                <div className="recent-job-item" key={job.id}>
                  <div className="recent-job-icon">
                    <FaBriefcase />
                  </div>

                  <div className="recent-job-info">
                    <h4>{job.title}</h4>
                    <p>{job.company}</p>
                  </div>

                  <span className="recent-job-location">
                    {job.location}
                  </span>

                  <span
                    className={`recent-job-status ${
                      job.status === "Active" ? "active" : "closed"
                    }`}
                  >
                    {job.status || "Active"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
