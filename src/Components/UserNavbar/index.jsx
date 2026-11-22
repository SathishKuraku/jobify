
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  FaBriefcase,
  FaUserCircle,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from "react-icons/fa";

import { useAuth } from "../../Context/AuthContext";
import NotificationBell from "../NotificationBell";

import "./index.scss";

const UserNavbar = () => {
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
    isActive ? "user-nav-link active" : "user-nav-link";

  return (
    <nav className="user-navbar">
      <div className="user-nav-container">

        {/* LOGO */}
        <Link to="/" className="user-nav-logo" onClick={closeMenu}>
          <div className="user-logo-icon">
            <FaBriefcase />
          </div>
          <span>Jobify</span>
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="user-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* NAVIGATION */}
        <div className={`user-nav-content ${menuOpen ? "open" : ""}`}>

          {/* LINKS */}
          <div className="user-nav-links">

            <NavLink to="/" end className={activeClass} onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink to="/jobs" className={activeClass} onClick={closeMenu}>
              Find Jobs
            </NavLink>

            <NavLink to="/companies" className={activeClass} onClick={closeMenu}>
              Companies
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/saved-jobs"
                  className={activeClass}
                  onClick={closeMenu}
                >
                  Saved Jobs
                </NavLink>

                <NavLink
                  to="/my-applications"
                  className={activeClass}
                  onClick={closeMenu}
                >
                  My Applications
                </NavLink>
              </>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="user-nav-actions">

            {/* NOTIFICATIONS */}
            {user && <NotificationBell />}

            {/* PROFILE */}
            {user ? (
              <div className="user-profile-dropdown">

                <button
                  className={`user-profile-btn ${
                    profileOpen ? "profile-active" : ""
                  }`}
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <FaUserCircle className="user-avatar" />

                  <div className="user-profile-info">
                    <span className="user-profile-name">
                      {user.name || "User"}
                    </span>

                    <span className="user-profile-role">
                      Job Seeker
                    </span>
                  </div>

                  <FaChevronDown className="user-profile-arrow" />
                </button>

                {profileOpen && (
                  <div className="user-profile-menu">

                    <div className="user-menu-header">
                      <FaUserCircle />

                      <div>
                        <strong>{user.name || "User"}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>

                    <div className="user-menu-divider"></div>

                    <Link to="/profile" onClick={closeMenu}>
                      <FaUserCircle />
                      My Profile
                    </Link>

                    <button onClick={handleLogout}>
                      <FaSignOutAlt />
                      Logout
                    </button>

                  </div>
                )}
              </div>
            ) : (
              /* LOGIN / REGISTER */
              <div className="user-auth-buttons">
                <Link to="/login" className="user-login-btn" onClick={closeMenu}>
                  Login
                </Link>

                <Link
                  to="/register"
                  className="user-register-btn"
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
