
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { getSettings, updateSettings, updateUser } from "../../Services/jobApi";
import {
    FaUser,
    FaLock,
    FaCog,
    FaBell,
    FaSave
} from "react-icons/fa";
import "./index.scss";

const AdminSettings = () => {
    const { user, login } = useAuth();

    const [settingsId, setSettingsId] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [adminRecord, setAdminRecord] = useState(null);
    const [profile, setProfile] = useState({
        name: "",
        email: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [portal, setPortal] = useState({
        portalName: "Jobify",
        portalEmail: "",
        allowRegistration: true,
        maintenanceMode: false
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        applicationNotifications: true,
        jobNotifications: false
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Load settings and admin profile
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [settingsResponse, adminResponse] = await Promise.all([
                    getSettings(),
                    user?.id ? import("../../Services/jobApi").then(api => api.getUserById(user.id)) : Promise.resolve(null)
                ]);

                const settingsData = settingsResponse.data[0];

                if (settingsData) {
                    setSettingsId(settingsData.id);

                    setPortal({
                        portalName: settingsData.portalName || "Jobify",
                        portalEmail: settingsData.portalEmail || "",
                        allowRegistration: settingsData.allowRegistration ?? true,
                        maintenanceMode: settingsData.maintenanceMode ?? false
                    });

                    setNotifications({
                        emailNotifications: settingsData.emailNotifications ?? true,
                        applicationNotifications: settingsData.applicationNotifications ?? true,
                        jobNotifications: settingsData.jobNotifications ?? false
                    });
                }

                if (adminResponse?.data) {
                    setAdminRecord(adminResponse.data);

                    setProfile({
                        name: adminResponse.data.name || "",
                        email: adminResponse.data.email || ""
                    });
                }

            } catch (err) {
                console.error(err);
                setError("Failed to load settings.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [user]);

    const handleProfileChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };

    const handlePortalChange = (e) => {
        const { name, value, type, checked } = e.target;

        setPortal({
            ...portal,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;

        setNotifications({
            ...notifications,
            [name]: checked
        });
    };

    // Save profile
    const saveProfile = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!profile.name.trim() || !profile.email.trim()) {
            setError("Name and email are required.");
            return;
        }

        setSaving(true);

        try {
            await updateUser(user.id, {
                name: profile.name.trim(),
                email: profile.email.trim()
            });

            // Update local login session
            login({
                ...user,
                name: profile.name.trim(),
                email: profile.email.trim()
            });

            setMessage("Profile updated successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    // Change password
    const savePassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setError("Please fill all password fields.");
            return;
        }

        if (passwordForm.currentPassword !== adminRecord?.password) {
            setError("Current password is incorrect.");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setError("New password must contain at least 6 characters.");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setSaving(true);

        try {
            await updateUser(user.id, {
                password: passwordForm.newPassword
            });

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            setMessage("Password changed successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to change password.");
        } finally {
            setSaving(false);
        }
    };

    // Save portal and notification settings
    const savePortalSettings = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        setSaving(true);

        try {
            const data = {
                ...portal,
                ...notifications
            };

            if (settingsId) {
                await updateSettings(settingsId, data);
            } else {
                setError("Settings record not found in db.json.");
                return;
            }

            setMessage("Settings saved successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-settings-loading">
                Loading settings...
            </div>
        );
    }

    const tabs = [
        { id: "profile", label: "Profile", icon: <FaUser /> },
        { id: "password", label: "Password", icon: <FaLock /> },
        { id: "portal", label: "Portal Settings", icon: <FaCog /> },
        { id: "notifications", label: "Notifications", icon: <FaBell /> }
    ];

    return (
        <div className="admin-settings">

            {/* Header */}
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your profile and Jobify portal preferences.</p>
            </div>

            <div className="settings-layout">

                {/* Sidebar */}
                <div className="settings-sidebar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={activeTab === tab.id ? "active" : ""}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setMessage("");
                                setError("");
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="settings-content">

                    {message && (
                        <div className="settings-message success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="settings-message error">
                            {error}
                        </div>
                    )}

                    {/* Profile */}
                    {activeTab === "profile" && (
                        <form onSubmit={saveProfile}>
                            <div className="settings-section-header">
                                <h2>Admin Profile</h2>
                                <p>Update your personal account information.</p>
                            </div>

                            <div className="settings-form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="settings-form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your email"
                                />
                            </div>

                            <button className="settings-save-btn" disabled={saving}>
                                <FaSave />
                                {saving ? "Saving..." : "Save Profile"}
                            </button>
                        </form>
                    )}

                    {/* Password */}
                    {activeTab === "password" && (
                        <form onSubmit={savePassword}>
                            <div className="settings-section-header">
                                <h2>Change Password</h2>
                                <p>Update your account password.</p>
                            </div>

                            <div className="settings-form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="settings-form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="settings-form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <button className="settings-save-btn" disabled={saving}>
                                <FaSave />
                                {saving ? "Saving..." : "Change Password"}
                            </button>
                        </form>
                    )}

                    {/* Portal */}
                    {activeTab === "portal" && (
                        <form onSubmit={savePortalSettings}>
                            <div className="settings-section-header">
                                <h2>Portal Settings</h2>
                                <p>Configure your Jobify portal.</p>
                            </div>

                            <div className="settings-form-group">
                                <label>Portal Name</label>
                                <input
                                    type="text"
                                    name="portalName"
                                    value={portal.portalName}
                                    onChange={handlePortalChange}
                                />
                            </div>

                            <div className="settings-form-group">
                                <label>Portal Contact Email</label>
                                <input
                                    type="email"
                                    name="portalEmail"
                                    value={portal.portalEmail}
                                    onChange={handlePortalChange}
                                />
                            </div>

                            <div className="settings-toggle-row">
                                <div>
                                    <strong>Allow Registration</strong>
                                    <p>Allow new users to register accounts.</p>
                                </div>

                                <input
                                    type="checkbox"
                                    name="allowRegistration"
                                    checked={portal.allowRegistration}
                                    onChange={handlePortalChange}
                                />
                            </div>

                            <div className="settings-toggle-row">
                                <div>
                                    <strong>Maintenance Mode</strong>
                                    <p>Mark the portal as under maintenance.</p>
                                </div>

                                <input
                                    type="checkbox"
                                    name="maintenanceMode"
                                    checked={portal.maintenanceMode}
                                    onChange={handlePortalChange}
                                />
                            </div>

                            <button className="settings-save-btn" disabled={saving}>
                                <FaSave />
                                {saving ? "Saving..." : "Save Portal Settings"}
                            </button>
                        </form>
                    )}

                    {/* Notifications */}
                    {activeTab === "notifications" && (
                        <form onSubmit={savePortalSettings}>
                            <div className="settings-section-header">
                                <h2>Notification Preferences</h2>
                                <p>Choose which notifications you want to receive.</p>
                            </div>

                            <div className="settings-toggle-row">
                                <div>
                                    <strong>Email Notifications</strong>
                                    <p>Enable general email notifications.</p>
                                </div>

                                <input
                                    type="checkbox"
                                    name="emailNotifications"
                                    checked={notifications.emailNotifications}
                                    onChange={handleNotificationChange}
                                />
                            </div>

                            <div className="settings-toggle-row">
                                <div>
                                    <strong>Application Notifications</strong>
                                    <p>Notify when new applications are submitted.</p>
                                </div>

                                <input
                                    type="checkbox"
                                    name="applicationNotifications"
                                    checked={notifications.applicationNotifications}
                                    onChange={handleNotificationChange}
                                />
                            </div>

                            <div className="settings-toggle-row">
                                <div>
                                    <strong>Job Notifications</strong>
                                    <p>Notify about job posting updates.</p>
                                </div>

                                <input
                                    type="checkbox"
                                    name="jobNotifications"
                                    checked={notifications.jobNotifications}
                                    onChange={handleNotificationChange}
                                />
                            </div>

                            <button className="settings-save-btn" disabled={saving}>
                                <FaSave />
                                {saving ? "Saving..." : "Save Notification Preferences"}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
