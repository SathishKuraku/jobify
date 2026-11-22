
import React, { useEffect, useState } from "react";
import { getUsers, updateUser } from "../../Services/jobApi";
import { useAuth } from "../../Context/AuthContext";
import {
  FaUsers,
  FaUserShield,
  FaUser,
  FaSearch,
  FaEye
} from "react-icons/fa";
import "./index.scss";

const AdminUsers = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch users from JSON Server
  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Statistics
  const totalUsers = users.length;

  const adminCount = users.filter(
    (item) => item.role === "admin"
  ).length;

  const normalUsers = users.filter(
    (item) => item.role !== "admin"
  ).length;

  const activeUsers = users.filter(
    (item) => (item.status || "Active") === "Active"
  ).length;

  // Search and filters
  const filteredUsers = users.filter((item) => {
    const name = (item.name || "").toLowerCase();
    const email = (item.email || "").toLowerCase();
    const searchText = search.toLowerCase();

    const searchMatch =
      name.includes(searchText) || email.includes(searchText);

    const roleMatch =
      roleFilter === "All" || item.role === roleFilter;

    const statusMatch =
      statusFilter === "All" ||
      (item.status || "Active") === statusFilter;

    return searchMatch && roleMatch && statusMatch;
  });

  // Change user role
  const handleRoleChange = async (id, newRole) => {
    const targetUser = users.find(
      (item) => String(item.id) === String(id)
    );

    // Prevent changing your own admin role
    if (String(id) === String(user?.id)) {
      alert("You cannot change your own role.");
      return;
    }

    try {
      await updateUser(id, { role: newRole });

      setUsers((prev) =>
        prev.map((item) =>
          String(item.id) === String(id)
            ? { ...item, role: newRole }
            : item
        )
      );

      // Keep selected profile updated
      if (selectedUser && String(selectedUser.id) === String(id)) {
        setSelectedUser({ ...targetUser, role: newRole });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update user role");
    }
  };

  // Activate or deactivate user
  const handleStatusChange = async (id) => {
    // Prevent deactivating yourself
    if (String(id) === String(user?.id)) {
      alert("You cannot deactivate your own account.");
      return;
    }

    const targetUser = users.find(
      (item) => String(item.id) === String(id)
    );

    if (!targetUser) return;

    const newStatus =
      (targetUser.status || "Active") === "Active"
        ? "Inactive"
        : "Active";

    try {
      await updateUser(id, { status: newStatus });

      setUsers((prev) =>
        prev.map((item) =>
          String(item.id) === String(id)
            ? { ...item, status: newStatus }
            : item
        )
      );

      if (selectedUser && String(selectedUser.id) === String(id)) {
        setSelectedUser({ ...targetUser, status: newStatus });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update account status");
    }
  };

  if (loading) {
    return (
      <div className="admin-users-loading">
        Loading users...
      </div>
    );
  }

  return (
    <div className="admin-users">

      {/* Header */}
      <div className="users-header">
        <div>
          <h1>User Management</h1>
          <p>Manage registered users, roles and account access.</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="users-stats">

        <div className="users-stat-card">
          <div className="users-stat-icon purple">
            <FaUsers />
          </div>
          <div>
            <p>Total Users</p>
            <h2>{totalUsers}</h2>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon blue">
            <FaUser />
          </div>
          <div>
            <p>Normal Users</p>
            <h2>{normalUsers}</h2>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon orange">
            <FaUserShield />
          </div>
          <div>
            <p>Administrators</p>
            <h2>{adminCount}</h2>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon green">
            <FaUsers />
          </div>
          <div>
            <p>Active Users</p>
            <h2>{activeUsers}</h2>
          </div>
        </div>

      </div>

      {/* Search and filters */}
      <div className="users-toolbar">

        <div className="users-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

      </div>

      {/* Users Table */}
      <div className="users-table-wrapper">

        <table className="users-table">

          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Change Role</th>
              <th>Account</th>
              <th>Profile</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.length > 0 ? (
              filteredUsers.map((item) => (
                <tr key={item.id}>

                  <td>
                    <div className="user-table-profile">
                      <div className="user-avatar">
                        {(item.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <strong>{item.name || "Unnamed User"}</strong>
                    </div>
                  </td>

                  <td>{item.email}</td>

                  <td>
                    <span className={`user-role ${item.role}`}>
                      {item.role || "user"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`user-status ${
                        (item.status || "Active").toLowerCase()
                      }`}
                    >
                      {item.status || "Active"}
                    </span>
                  </td>

                  <td>
                    <select
                      className="user-role-select"
                      value={item.role || "user"}
                      disabled={String(item.id) === String(user?.id)}
                      onChange={(e) =>
                        handleRoleChange(item.id, e.target.value)
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className={`user-toggle-btn ${
                        (item.status || "Active") === "Active"
                          ? "deactivate"
                          : "activate"
                      }`}
                      disabled={String(item.id) === String(user?.id)}
                      onClick={() => handleStatusChange(item.id)}
                    >
                      {(item.status || "Active") === "Active"
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>

                  <td>
                    <button
                      className="user-view-btn"
                      onClick={() => setSelectedUser(item)}
                    >
                      <FaEye /> View
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-users">
                  No users found.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <div
          className="user-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="user-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="user-modal-header">
              <h2>User Profile</h2>

              <button
                className="user-modal-close"
                onClick={() => setSelectedUser(null)}
              >
                &times;
              </button>
            </div>

            <div className="user-modal-profile">
              <div className="user-modal-avatar">
                {(selectedUser.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h3>{selectedUser.name || "Unnamed User"}</h3>
              <p>{selectedUser.email}</p>
            </div>

            <div className="user-modal-details">

              <div className="user-detail">
                <span>User ID</span>
                <strong>{selectedUser.id}</strong>
              </div>

              <div className="user-detail">
                <span>Email Address</span>
                <strong>{selectedUser.email || "Not available"}</strong>
              </div>

              <div className="user-detail">
                <span>Account Role</span>
                <strong>{selectedUser.role || "user"}</strong>
              </div>

              <div className="user-detail">
                <span>Account Status</span>
                <strong>{selectedUser.status || "Active"}</strong>
              </div>

            </div>

            <button
              className="user-modal-done"
              onClick={() => setSelectedUser(null)}
            >
              Close Profile
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
