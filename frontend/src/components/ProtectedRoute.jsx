import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/" />  :  <Outlet />;
};

export default ProtectedRoute;