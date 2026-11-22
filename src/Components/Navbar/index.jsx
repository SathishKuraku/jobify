
import React from "react";
import { useAuth } from "../../Context/AuthContext";

import UserNavbar from "../UserNavbar";
import AdminNavbar from "../AdminNavbar";

const Navbar = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminNavbar />;
  }

  return <UserNavbar />;
};

export default Navbar;
