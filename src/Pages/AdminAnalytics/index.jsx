
import React, { useEffect, useState } from "react";

import {
  getApplications,
  getJobs
} from "../../Services/jobApi";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

import "./index.scss";

const COLORS = [
  "#8b5cf6",
  "#38bdf8",
  "#f59e0b",
  "#f87171",
  "#34d399"
];

const AdminAnalytics = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs and applications
  const fetchAnalytics = async () => {
    try {
      const [applicationRes, jobRes] = await Promise.all([
        getApplications(),
        getJobs()
      ]);

      setApplications(applicationRes.data);
      setJobs(jobRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Statistics
  const totalApplications = applications.length;

  const totalJobs = jobs.length;

  const hired = applications.filter(
    (app) => app.status === "Hired"
  ).length;

  const pending = applications.filter(
    (app) => (app.status || "Pending") === "Pending"
  ).length;

  const interviews = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const shortlisted = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const hiringRate =
    totalApplications > 0
      ? ((hired / totalApplications) * 100).toFixed(1)
      : 0;

  // Last 6 months application trend
  const monthlyData = (() => {
    const months = [];

    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
      );

      months.push({
        month: date.toLocaleString("en-US", {
          month: "short"
        }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
        applications: 0
      });
    }

    applications.forEach((application) => {
      const rawDate = application.createdAt || application.date;

      if (!rawDate) return;

      const appliedDate = new Date(rawDate);

      if (isNaN(appliedDate.getTime())) return;

      const matchingMonth = months.find(
        (month) =>
          month.monthIndex === appliedDate.getMonth() &&
          month.year === appliedDate.getFullYear()
      );

      if (matchingMonth) {
        matchingMonth.applications++;
      }
    });

    return months;
  })();

  // Status chart
  const statusData = [
    { name: "Pending", value: pending },
    { name: "Shortlisted", value: shortlisted },
    { name: "Interview", value: interviews },
    { name: "Rejected", value: rejected },
    { name: "Hired", value: hired }
  ].filter((item) => item.value > 0);

  // Applications per job
  const jobPerformance = jobs.map((job) => {
    const count = applications.filter(
      (application) =>
        String(application.jobId) === String(job.id)
    ).length;

    return {
      name: job.title.length > 16
        ? job.title.substring(0, 16) + "..."
        : job.title,
      applications: count
    };
  })
  .sort((a, b) => b.applications - a.applications)
  .slice(0, 6);

  if (loading) {
    return (
      <div className="analytics-loading">
        Loading analytics dashboard...
      </div>
    );
  }

  return (
    <div className="admin-analytics">

      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Monitor your recruitment performance and statistics.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="analytics-stats">

        <div className="analytics-card purple">
          <div className="analytics-card-top">
            <span>Total Applications</span>
            <div className="analytics-icon">👥</div>
          </div>
          <h2>{totalApplications}</h2>
          <p>All candidate applications</p>
        </div>

        <div className="analytics-card blue">
          <div className="analytics-card-top">
            <span>Total Jobs</span>
            <div className="analytics-icon">💼</div>
          </div>
          <h2>{totalJobs}</h2>
          <p>Jobs in the portal</p>
        </div>

        <div className="analytics-card green">
          <div className="analytics-card-top">
            <span>Hired Candidates</span>
            <div className="analytics-icon">✅</div>
          </div>
          <h2>{hired}</h2>
          <p>Successful hires</p>
        </div>

        <div className="analytics-card orange">
          <div className="analytics-card-top">
            <span>Hiring Rate</span>
            <div className="analytics-icon">📈</div>
          </div>
          <h2>{hiringRate}%</h2>
          <p>Application to hire conversion</p>
        </div>

      </div>

      {/* Charts */}
      <div className="analytics-charts">

        {/* Monthly Applications */}
        <div className="analytics-panel monthly-panel">
          <div className="panel-header">
            <h3>Monthly Applications</h3>
            <p>Applications received over the last 6 months</p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid stroke="#302d38" strokeDasharray="3 3" />

              <XAxis
                dataKey="month"
                stroke="#999"
              />

              <YAxis
                allowDecimals={false}
                stroke="#999"
              />

              <Tooltip
                contentStyle={{
                  background: "#25222d",
                  border: "1px solid #444",
                  borderRadius: "8px",
                  color: "#fff"
                }}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="applications"
                name="Applications"
                stroke="#a78bfa"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Application Status */}
        <div className="analytics-panel status-panel">
          <div className="panel-header">
            <h3>Application Status</h3>
            <p>Candidate hiring pipeline</p>
          </div>

          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  paddingAngle={3}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#25222d",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              No application data available.
            </div>
          )}
        </div>

        {/* Job Performance */}
        <div className="analytics-panel job-performance-panel">
          <div className="panel-header">
            <h3>Job Performance</h3>
            <p>Top jobs by number of applications</p>
          </div>

          {jobPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={jobPerformance}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 50
                }}
              >
                <CartesianGrid
                  stroke="#302d38"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  height={70}
                  stroke="#999"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#999"
                />

                <Tooltip
                  contentStyle={{
                    background: "#25222d",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />

                <Bar
                  dataKey="applications"
                  name="Applications"
                  fill="#8b5cf6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              No jobs available.
            </div>
          )}
        </div>

        {/* Hiring Overview */}
        <div className="analytics-panel hiring-panel">
          <div className="panel-header">
            <h3>Hiring Overview</h3>
            <p>Current recruitment progress</p>
          </div>

          <div className="hiring-list">

            <div className="hiring-row">
              <span>Pending</span>
              <strong>{pending}</strong>
            </div>

            <div className="hiring-row">
              <span>Shortlisted</span>
              <strong>{shortlisted}</strong>
            </div>

            <div className="hiring-row">
              <span>Interview</span>
              <strong>{interviews}</strong>
            </div>

            <div className="hiring-row">
              <span>Rejected</span>
              <strong>{rejected}</strong>
            </div>

            <div className="hiring-row hired-row">
              <span>Hired</span>
              <strong>{hired}</strong>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminAnalytics;
