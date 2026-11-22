import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("jobifyUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login
  const login = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "jobifyUser",
      JSON.stringify(userData)
    );
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("jobifyUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);