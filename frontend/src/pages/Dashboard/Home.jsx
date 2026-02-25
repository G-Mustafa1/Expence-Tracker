import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRupeeSign } from "react-icons/fa6";
import { Plus, Wallet, TrendingUp, TrendingDown, LayoutDashboard, PieChart as PieIcon } from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell, PolarAngleAxis, AreaChart, Area, XAxis, CartesianGrid, Tooltip } from "recharts";
import { Toaster } from "react-hot-toast";
import AddIncome from "../../components/AddIncome";
import AddExpense from "../../components/AddExpence";
import { openModal } from "../../features/modalSlice";
import Loader from "../../components/Loader";

const COLORS = ["#22c55e", "#f43f5e", "#3b82f6", "#a855f7", "#facc15"];
const formatDateKey = (d) => new Date(d).toISOString().slice(0, 10);

export default function Home() {
  const dispatch = useDispatch();
  const dashboard = useSelector((s) => s.dashboard);
  const modal = useSelector((s) => s.modal);

  const { totalIncome = 0, totalExpense = 0, balance = 0 } = dashboard || {};
  const incomeArr = dashboard?.income || [];
  const expenseArr = dashboard?.expense || [];

  const chartData = useMemo(() => {
    const today = new Date();
    return [...Array(30)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      const key = formatDateKey(d);
      return {
        shortDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        income: incomeArr.filter((t) => formatDateKey(t.createdAt || t.date) === key).reduce((s, t) => s + Number(t.amount || 0), 0),
        expense: expenseArr.filter((t) => formatDateKey(t.createdAt || t.date) === key).reduce((s, t) => s + Number(t.amount || 0), 0),
      };
    });
  }, [incomeArr, expenseArr]);

  const categoryData = useMemo(() => {
    const map = {};
    expenseArr.forEach((e) => { map[e.category] = (map[e.category] || 0) + Number(e.amount || 0); });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [expenseArr]);

  const max = Math.max(totalIncome, totalExpense, 1);
  const radialData = [
    { name: "Income", value: totalIncome, fill: "#22c55e" },
    { name: "Expense", value: totalExpense, fill: "#f43f5e" },
  ];

  return (
    <>
    <div className="p-6 space-y-10 text-slate-900 min-h-screen">
      <Toaster position="top-right" toastOptions={{ style: { zIndex: 99999 } }} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-indigo-400 w-8 h-8" /> Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => dispatch(openModal("income"))} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold flex items-center gap-2 text-white">
            <Plus className="w-4 h-4" /> Add Income
          </button>
          <button onClick={() => dispatch(openModal("expense"))} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 rounded-xl font-semibold flex items-center gap-2 text-white">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Revenue", value: totalIncome, color: "text-emerald-400", icon: TrendingUp, bg: "bg-emerald-700/30" },
          { label: "Total Spending", value: totalExpense, color: "text-rose-400", icon: TrendingDown, bg: "bg-rose-700/30" },
          { label: "Net Balance", value: balance, color: "text-indigo-400", icon: Wallet, bg: "bg-indigo-700/30" },
        ].map((k) => (
          <div key={k.label} className="relative overflow-hidden rounded-2xl p-6 bg-white/[0.05] border border-white/10 shadow-md">
            <div className={`absolute -right-3 -top-3 w-20 h-20 blur-2xl rounded-full ${k.bg}`} />
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl ${k.bg} ${k.color}`}><k.icon className="w-5 h-5" /></div>
              <p className="text-slate-400 text-xs uppercase tracking-widest">{k.label}</p>
            </div>
            <p className={`text-2xl md:text-3xl font-bold flex items-center gap-1 ${k.color}`}>
              <FaRupeeSign className="text-base opacity-60" /> {k.value?.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-white/10 shadow-md">
          <div className="flex justify-between">
            <h3 className="text-slate-900 font-bold text-sm mb-4 uppercase">30-Day Cashflow</h3>
          <div className="flex gap-2">
            <span className="text-sm">Income</span>
            <span className="text-sm">Expense</span>
          </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
              <XAxis dataKey="shortDate" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #ffffff20", borderRadius: "12px" }} />
              <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeG)" />
              <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center shadow-md">
          <h3 className="text-slate-900 font-bold text-sm mb-3 uppercase">Budget Ratio</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart data={radialData} innerRadius="65%" outerRadius="100%" startAngle={180} endAngle={0}>
              <PolarAngleAxis type="number" domain={[0,max]} tick={false}/>
              <RadialBar dataKey="value" cornerRadius={20}/>
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm text-slate-400 uppercase tracking-wider">Available Balance</p>
          <p className="text-2xl font-bold text-slate-900">Rs.{balance.toLocaleString()}</p>
        </div>
      </div>

      {/* Top Expenses */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-white/10 shadow-md">
          <div className="flex items-center gap-2 mb-4 text-slate-900">
            <PieIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm uppercase tracking-widest">Top Expenses</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryData} innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={5}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1">
            {categoryData.slice(0,3).map((c,i)=>(
              <div key={i} className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{background: COLORS[i % COLORS.length]}}></span>
                  {c.name}
                </span>
                <span className="text-slate-900">Rs.{c.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-slate-900 rounded-2xl w-full max-w-2xl p-4">
            {modal.type === "income" ? <AddIncome /> : <AddExpense />}
          </div>
        </div>
      )}
    </div>
    </>
  );
}