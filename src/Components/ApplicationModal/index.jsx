
import React from "react";
import { FaTimes, FaEnvelope, FaPhone, FaFilePdf, FaDownload } from "react-icons/fa";
import "./index.scss";

const ApplicationModal = ({ application, jobTitle, onClose }) => {
  if (!application) return null;

  const skills = Array.isArray(application.skills)
    ? application.skills
    : [];

  return (
    <div className="application-modal-overlay" onClick={onClose}>

      <div
        className="application-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Applicant Details</h2>
            <p>Review candidate information and resume</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Applicant Profile */}
        <div className="applicant-profile">

          <div className="applicant-avatar">
            {(application.name || application.fullName || "A")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="applicant-info">
            <h3>{application.name || application.fullName || "Applicant"}</h3>
            <p>{jobTitle}</p>
          </div>

        </div>

        {/* Contact Information */}
        <div className="applicant-contact">

          <div className="contact-item">
            <FaEnvelope />
            <div>
              <small>Email</small>
              <p>{application.email || "Not provided"}</p>
            </div>
          </div>

          <div className="contact-item">
            <FaPhone />
            <div>
              <small>Phone</small>
              <p>{application.phone || "Not provided"}</p>
            </div>
          </div>

        </div>

        {/* Skills */}
        <div className="modal-section">
          <h3>Skills</h3>

          <div className="skills-list">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))
            ) : (
              <p className="empty-text">No skills added.</p>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        <div className="modal-section">
          <h3>Cover Letter</h3>

          <div className="cover-letter">
            {application.coverLetter || "No cover letter provided."}
          </div>
        </div>

        {/* Resume */}
        <div className="modal-section">
          <h3>Resume</h3>

          {application.resume ? (
            <div className="resume-card">

              <div className="resume-file">
                <FaFilePdf />

                <div>
                  <strong>Applicant Resume</strong>
                  <p>PDF Document</p>
                </div>
              </div>

              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-view-btn"
              >
                View Resume
              </a>

              <a
                href={application.resume}
                download
                className="resume-download-btn"
              >
                <FaDownload />
                Download
              </a>

            </div>
          ) : (
            <p className="empty-text">Resume not uploaded.</p>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
    );
};

export default ApplicationModal;
