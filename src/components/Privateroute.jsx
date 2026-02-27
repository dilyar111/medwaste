import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem("mw_logged_in") === "true";

  if (!isLoggedIn) {
    // Kick back to the HTML login page
    return <Navigate to="/login.html" replace />;
  }

  return children;
}

export default PrivateRoute;