import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Wallet, CreditCard, User, X, Menu, LogOut } from "lucide-react";
import { logout } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import toast from "react-hot-toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, loading } = useSelector((state) => state.auth);

  console.log("user", user);


  const navLinks = [
    { name: "Home", path: "/dashboard", icon: LayoutDashboard },
    { name: "Income", path: "/dashboard/income", icon: Wallet },
    { name: "Expenses", path: "/dashboard/expenses", icon: CreditCard },
    // { name: "Profile", path: "/dashboard/profile", icon: User },
  ];

  const handleLogout = () => {
    toast.success("Logout successful!", { id: "logout-toast" });
    dispatch(logout());
    navigate("/");
  };

  const UserProfile = () => {
    if (loading) {
      return <Loader />;
    }
    if (!user) return null;
    return (
      <div className="flex items-center gap-3 mb-6">
        <img
          src={user.profileImg || "/default-avatar.png"}
          alt={user.fullName}
          className="w-10 h-10 rounded-full object-cover border border-gray-500"
        />
        <div>
          <p className="text-sm font-semibold">{user.fullName}</p>
          <p className="text-xs text-gray-300">{user.emailAddress}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-8 tracking-wide">💸 ExpensePro</h2>
          <UserProfile />
          <nav className="space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 shadow-md scale-[1.02]" : "hover:bg-gray-700 hover:scale-[1.01]"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 text-left bg-red-500 hover:bg-red-600 py-2 rounded-lg font-medium transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 z-50 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">💸 ExpensePro</h1>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <nav className="md:hidden fixed top-16 left-0 w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 space-y-2 z-40">
          {/* User profile on mobile */}
          <UserProfile />
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/dashboard"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 shadow-md" : "hover:bg-gray-700"
                  }`
                }
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-medium transition mt-2"
          >
            Logout
          </button>
        </nav>
      )}
    </>
  );
};

export default Sidebar;