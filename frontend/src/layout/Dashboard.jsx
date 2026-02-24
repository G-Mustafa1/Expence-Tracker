import { Outlet, Link, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/dashboard" },
    { name: "Income", path: "/dashboard/income" },
    { name: "Expenses", path: "/dashboard/expenses" },
    { name: "Profile", path: "/dashboard/profile" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col justify-between shadow-lg">

        <div>
          <h2 className="text-2xl font-bold mb-8 tracking-wide">
            💸 ExpensePro
          </h2>

          <nav className="space-y-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg transition-all duration-200 
                    ${
                      isActive
                        ? "bg-blue-600 shadow-md"
                        : "hover:bg-gray-700"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">
            Dashboard
          </h1>

          <div className="text-sm text-gray-500">
            Welcome 👋
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;