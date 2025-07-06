import { Navigate } from "react-router";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { URLS } from "../navigation/CONTANTS";

type AdminRouteProps = {
  children: React.ReactNode;
};

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const isAdmin = useIsAdmin();

  if (!isAdmin) {
    return <Navigate to={URLS.HOME} replace />;
  }

  return children;
};