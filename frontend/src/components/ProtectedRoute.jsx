import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="text-center mt-20 text-white">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />; // nested routes ke liye Outlet
};

export default ProtectedRoute;