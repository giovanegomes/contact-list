import { createContext, useContext } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Não foi possível inicializar AuthProvider");
  }

  return context;
};
