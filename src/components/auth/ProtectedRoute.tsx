import { JSX } from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return <Navigate to="/signin" replace />;
  }

  try {
    const userData = JSON.parse(user);
    if (userData.role !== "admin" && userData.role !== "super_admin") {
      return <Navigate to="/signin" replace />;
    }
  } catch {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

