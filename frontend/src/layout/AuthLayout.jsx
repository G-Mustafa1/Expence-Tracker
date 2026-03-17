import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50">

      <div className="relative flex flex-col w-full md:w-1/2 min-h-screen bg-white">

        {/* Logo */}
        <div className="px-10 pt-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-lg shadow-md shadow-blue-200">
              💸
            </div>
            <span className="text-slate-800 font-bold text-[18px] tracking-tight">Expensia</span>
          </div>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-10 py-10">
          <div className="w-full max-w-105">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <p className="pb-6 text-center text-[12px] text-slate-400 tracking-wide">
          © 2025 Expensia · All rights reserved
        </p>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center w-1/2 relative overflow-hidden bg-linear-to-br from-blue-600 to-indigo-700">

        {/* Decorative circles */}
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/20" />

        {/* Content */}
        <div className="relative z-10 text-center px-12 w-full max-w-md">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-[11px] font-semibold tracking-widest text-white/90 uppercase">
              Smart Finance
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white">
            Manage Your Money{" "}
            <span className="text-blue-200">Smartly</span>
          </h1>

          <p className="mb-10 text-base leading-relaxed text-blue-100">
            Track income, control expenses, and stay on top of your finances — all in one place.
          </p>

          {/* Stats row */}
          <div className="mb-8 grid grid-cols-3 gap-3">
            {[
              { label: "Users", value: "50K+" },
              { label: "Tracked", value: "$2M+" },
              { label: "Rating", value: "4.9 ★" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/15 py-4 px-2 backdrop-blur-sm border border-white/20">
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="mt-0.5 text-[11px] text-blue-200">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Balance card */}
          <div className="rounded-2xl bg-white/15 border border-white/20 p-5 text-left backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-widest text-blue-200">Total Balance</p>
                <p className="text-3xl font-bold text-white">$24,531.00</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 text-xl">
                💳
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-blue-200">Income</p>
                <p className="text-base font-semibold text-green-300">+$5,240</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-blue-200">Expense</p>
                <p className="text-base font-semibold text-red-300">-$1,890</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;