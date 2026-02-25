// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useSelector((state) => state.auth);

//   if (loading) return <p>Checking authentication...</p>;

//   if (!user) return <Navigate to="/" replace />;

//   // return children ;

//   return <Outlet />; // ✅ ye lagana zaroori hai
// };

// export default ProtectedRoute;











import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);

  // ⏳ Wait until auth check completes
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Checking authentication...
      </div>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in
  return <Outlet />;
};

export default ProtectedRoute;