import Layout from "./Layout.tsx";
import {Navigate} from "react-router";
import React from "react";
import {useAuth} from "../context/auth.ts";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return user ? <Layout>{children}</Layout> : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;