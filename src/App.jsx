
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";

import Home from "./Pages/Home";
import Jobs from "./Pages/Jobs";
import JobDetails from "./Pages/JobDetails";
import ApplyJob from "./Pages/ApplyJob";
import MyApplications from "./Pages/MyApplications";
import SavedJobs from "./Pages/SavedJobs";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import CompanyDetails from "./Pages/CompanyDetails";
import Companies from "./Pages/Companies";
import Notifications from "./Pages/Notifications";

// Route Protection
import ProtectedRoute from "./Components/ProtectRoute";
import AdminRoute from "./Components/AdminRoute";

// Admin Pages
import AdminDashboard from "./Pages/AdminDashboard";
import AdminJobs from "./Pages/AdminJobs";
import AdminApplications from "./Pages/AdminApplications";
import AdminAnalytics from "./Pages/AdminAnalytics";
import AdminUsers from "./Pages/AdminUsers";
import AdminSettings from "./Pages/AdminSettings";

function App() {
  return (
    <>
      {/* Role-Based Navbar */}
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="/companies" element={<Companies />} />

        <Route
          path="/companies/:companyName"
          element={<CompanyDetails />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ================= USER ROUTES ================= */}

        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute>
              <ApplyJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute>
              <SavedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Manage Jobs */}
        <Route
          path="/admin/jobs"
          element={
            <AdminRoute>
              <AdminJobs />
            </AdminRoute>
          }
        />

        {/* Manage Applications */}
        <Route
          path="/admin/applications"
          element={
            <AdminRoute>
              <AdminApplications />
            </AdminRoute>
          }
        />

        {/* Analytics */}
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          }
        />

        {/* Users */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
