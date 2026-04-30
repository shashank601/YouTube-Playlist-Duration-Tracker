// if user is logged in we will not render login page even if manipulates or use old login url

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function GuestRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default GuestRoute;