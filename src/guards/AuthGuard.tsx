import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isInitialzed } = useAuth();

  if (!isInitialzed) return <div>Loading....</div>;

  if (!isAuthenticated) return <Navigate to="/auth/sign-in" />;

  return <>{children}</>;
};

export default AuthGuard;
