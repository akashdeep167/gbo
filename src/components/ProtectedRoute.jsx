// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("auth");

  return isAuth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
