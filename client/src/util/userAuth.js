import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const UserAuth = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("accessToken");

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default UserAuth;