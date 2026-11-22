import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but not an admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin access allowed
  return children;
};

export default AdminRoute;