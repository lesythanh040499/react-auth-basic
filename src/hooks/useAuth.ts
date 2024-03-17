import { useContext } from "react";
import { AuthContext } from "../contexts/auth/authContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth context must be inside Auth Provider");
  }
  return context;
}
