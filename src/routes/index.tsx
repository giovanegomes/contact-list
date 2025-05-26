import { Navigate, Routes as ReactRouterRoutes, Route } from "react-router";
import Home from "../features/home";
import Contact from "../features/contatos";
import Register from "../features/register";
import { useAuth } from "./AuthContext/useAuth";
import { ProtectedRoute } from "./ProtectedRoutes";
import Login from "../features/login";

export default function Routes() {
  const { isAuthenticated } = useAuth();

  return (
    <ReactRouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact/:id" element={<Contact />} />
      </Route>
    </ReactRouterRoutes>
  );
}
