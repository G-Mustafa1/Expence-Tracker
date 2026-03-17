import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Wallet, CreditCard, X, Menu, LogOut, ChevronRight } from "lucide-react";
import { logout } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import toast from "react-hot-toast";

const BRAND = "#2b52f3";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);

  const navLinks = [
    { name: "Home",     path: "/dashboard",          icon: LayoutDashboard },
    { name: "Income",   path: "/dashboard/income",   icon: Wallet          },
    { name: "Expenses", path: "/dashboard/expenses", icon: CreditCard      },
  ];

  const handleLogout = () => {
    toast.success("Logout successful!", { id: "logout-toast" });
    dispatch(logout());
    navigate("/");
  };

  const UserProfile = () => {
    if (loading) return <Loader />;
    if (!user) return null;
    return (
      <div className="flex items-center gap-3 mb-5 px-3 py-3 rounded-xl bg-[#f4f6ff] border border-[#e8ecff]">
        <img
          src={user.profileImg || "/default-avatar.png"}
          alt={user.fullName}
          className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{user.fullName}</p>
          <p className="text-[11px] text-slate-400 truncate">{user.emailAddress}</p>
        </div>
      </div>
    );
  };

  const NavItem = ({ link, onClick }) => {
    const Icon = link.icon;
    return (
      <NavLink
        to={link.path}
        end={link.path === "/dashboard"}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
          ${isActive
            ? "text-white shadow-md shadow-[#2b52f3]/25"
            : "text-slate-500 hover:text-[#2b52f3] hover:bg-[#f4f6ff]"
          }`
        }
        style={({ isActive }) => isActive ? { background: BRAND } : {}}
      >
        {({ isActive }) => (
          <>
            <Icon size={17} className={isActive ? "text-white" : "text-slate-400 group-hover:text-[#2b52f3]"} />
            <span className="flex-1">{link.name}</span>
            {isActive && <ChevronRight size={13} className="text-white/60" />}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <div className="hidden md:flex w-60 shrink-0 bg-white border-r border-[#e8ecff] flex-col h-screen sticky top-0">

        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-[#e8ecff]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-base shadow-md shadow-[#2b52f3]/30"
              style={{ background: `linear-gradient(135deg, #2b52f3, #5b7fff)` }}
            >
              💸
            </div>
            <span className="text-slate-800 font-bold text-[16px] tracking-tight">Expensia</span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 mb-3">
            Main Menu
          </p>

          <UserProfile />

          {navLinks.map((link) => (
            <NavItem key={link.path} link={link} />
          ))}
        </div>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-[#e8ecff]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-150 group"
          >
            <LogOut size={16} className="text-slate-400 group-hover:text-red-400" />
            Sign out
          </button>
        </div>
      </div>

      {/* ── Mobile Navbar ── */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white border-b border-[#e8ecff] px-5 py-3.5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm shadow-sm"
            style={{ background: BRAND }}
          >
            💸
          </div>
          <span className="text-slate-800 font-bold text-[15px] tracking-tight">Expensia</span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-[#f4f6ff] transition"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* ── Mobile Dropdown ── */}
      {menuOpen && (
        <>
          <div className="md:hidden fixed inset-0 z-40 bg-black/20" onClick={() => setMenuOpen(false)} />
          <div className="md:hidden fixed top-14.25 left-0 w-full bg-white border-b border-[#e8ecff] z-40 px-4 py-4 shadow-lg space-y-1">
            <UserProfile />
            {navLinks.map((link) => (
              <NavItem key={link.path} link={link} onClick={() => setMenuOpen(false)} />
            ))}
            <div className="pt-2 border-t border-[#e8ecff] mt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;