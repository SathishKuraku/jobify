
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  FaUserShield,
  FaChartBar,
  FaBriefcase,
  FaClipboardList,
  FaUsers,
  FaCog,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaHome
} from "react-icons/fa";

import { useAuth } from "../../Context/AuthContext";
import NotificationBell from "../NotificationBell";

import "./index.scss";

const AdminNavbar = () => {
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  const activeClass = ({ isActive }) =>
    isActive ? "admin-nav-link active" : "admin-nav-link";

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">

        {/* LOGO */}
        <Link to="/admin" className="admin-nav-logo" onClick={closeMenu}>
          <div className="admin-logo-icon">
            <FaUserShield />
          </div>

          <div className="admin-logo-text">
            <span>Jobify</span>
            <small>ADMIN PANEL</small>
          </div>
        </Link>

        {/* MOBILE BUTTON */}
        <button
          className="admin-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle admin navigation"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* NAV CONTENT */}
        <div className={`admin-nav-content ${menuOpen ? "open" : ""}`}>

          {/* NAV LINKS */}
          <div className="admin-nav-links">

            <NavLink
              to="/admin"
              end
              className={activeClass}
              onClick={closeMenu}
            >
              <FaHome />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/jobs"
              className={activeClass}
              onClick={closeMenu}
            >
              <FaBriefcase />
              <span>Manage Jobs</span>
            </NavLink>

            <NavLink
              to="/admin/applications"
              className={activeClass}
              onClick={closeMenu}
            >
              <FaClipboardList />
              <span>Applications</span>
            </NavLink>

            <NavLink
              to="/admin/analytics"
              className={activeClass}
              onClick={closeMenu}
            >
              <FaChartBar />
              <span>Analytics</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={activeClass}
              onClick={closeMenu}
            >
              <FaUsers />
              <span>Users</span>
            </NavLink>

            <NavLink
              to="/admin/settings"
              className={activeClass}
              onClick={closeMenu}
            >
              <FaCog />
              <span>Settings</span>
            </NavLink>

          </div>

          {/* RIGHT ACTIONS */}
          <div className="admin-nav-actions">

            {/* NOTIFICATIONS */}
            {user && <NotificationBell />}

            {/* ADMIN PROFILE */}
            <div className="admin-profile-dropdown">

              <button
                className={`admin-profile-btn ${
                  profileOpen ? "profile-active" : ""
                }`}
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="admin-avatar">
                  <FaUserCircle />
                </div>

                <div className="admin-profile-info">
                  <span className="admin-profile-name">
                    {user?.name || "Admin"}
                  </span>

                  <span className="admin-profile-role">
                    Administrator
                  </span>
                </div>

                <FaChevronDown className="admin-profile-arrow" />
              </button>

              {/* PROFILE DROPDOWN */}
              {profileOpen && (
                <div className="admin-profile-menu">

                  <div className="admin-menu-header">
                    <FaUserCircle />

                    <div>
                      <strong>{user?.name || "Admin"}</strong>
                      <span>{user?.email}</span>
                    </div>
                  </div>

                  <div className="admin-menu-divider"></div>

                  <Link to="/admin/settings" onClick={closeMenu}>
                    <FaCog />
                    Admin Settings
                  </Link>

                  <button onClick={handleLogout}>
                    <FaSignOutAlt />
                    Logout
                  </button>

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
