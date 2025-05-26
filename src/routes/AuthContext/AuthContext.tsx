import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./useAuth";
import useStorage from "../../hooks/useStorage";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedUserId] = useStorage("loggedUserId");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(!!loggedUserId);

    setLoading(false);
  }, [loggedUserId]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
