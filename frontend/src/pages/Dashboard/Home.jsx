import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRupeeSign } from "react-icons/fa6";
import { Plus, Wallet, TrendingUp, TrendingDown, PieChart as PieIcon } from "lucide-react";
import {
  ResponsiveContainer, RadialBarChart, RadialBar,
  PieChart, Pie, Cell, PolarAngleAxis,
  AreaChart, Area, XAxis, CartesianGrid, Tooltip,
} from "recharts";
import AddIncome from "../../components/AddIncome";
import AddExpense from "../../components/AddExpence";
import { openModal } from "../../features/modalSlice";

const BRAND  = "#2b52f3";
const COLORS = [BRAND, "#f43f5e", "#22c55e", "#a855f7", "#facc15"];
const formatDateKey = (d) => new Date(d).toISOString().slice(0, 10);

export default function Home() {
  const dispatch  = useDispatch();
  const dashboard = useSelector((s) => s.dashboard);
  const modal     = useSelector((s) => s.modal);

  const { totalIncome = 0, totalExpense = 0, balance = 0 } = dashboard || {};
  const incomeArr  = dashboard?.income  || [];
  const expenseArr = dashboard?.expense || [];

  const chartData = useMemo(() => {
    const today = new Date();
    return [...Array(30)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      const key = formatDateKey(d);
      return {
        shortDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        income:  incomeArr.filter((t)  => formatDateKey(t.createdAt || t.date) === key).reduce((s, t) => s + Number(t.amount || 0), 0),
        expense: expenseArr.filter((t) => formatDateKey(t.createdAt || t.date) === key).reduce((s, t) => s + Number(t.amount || 0), 0),
      };
    });
  }, [incomeArr, expenseArr]);

  const categoryData = useMemo(() => {
    const map = {};
    expenseArr.forEach((e) => { map[e.category] = (map[e.category] || 0) + Number(e.amount || 0); });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [expenseArr]);

  const max = Math.max(totalIncome, totalExpense, 1);
  const radialData = [
    { name: "Income",  value: totalIncome,  fill: "#22c55e" },
    { name: "Expense", value: totalExpense, fill: "#f43f5e" },
  ];

  const kpiCards = [
    {
      label: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      bg: "bg-green-50",
      iconColor: "text-green-500",
      valueColor: "text-green-600",
      border: "border-t-4 border-t-green-400",
    },
    {
      label: "Total Expenses",
      value: totalExpense,
      icon: TrendingDown,
      bg: "bg-red-50",
      iconColor: "text-red-400",
      valueColor: "text-red-500",
      border: "border-t-4 border-t-red-400",
    },
    {
      label: "Net Balance",
      value: balance,
      icon: Wallet,
      bg: "bg-[#eef1ff]",
      iconColor: "text-[#2b52f3]",
      valueColor: "text-[#2b52f3]",
      border: "border-t-4 border-t-[#2b52f3]",
    },
  ];

  return (
    <>
      <div className="space-y-6 text-slate-800">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Overview</h1>
            <p className="text-sm text-slate-400 mt-0.5">Your financial summary at a glance</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => dispatch(openModal("income"))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition-all active:scale-95 shadow-sm shadow-green-200"
            >
              <Plus className="w-4 h-4" /> Add Income
            </button>
            <button
              onClick={() => dispatch(openModal("expense"))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95 shadow-sm shadow-red-200"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpiCards.map((k) => (
            <div
              key={k.label}
              className={`bg-white rounded-2xl p-5 shadow-sm border border-[#e8ecff] ${k.border}`}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{k.label}</p>
                <div className={`p-2 rounded-xl ${k.bg}`}>
                  <k.icon className={`w-4 h-4 ${k.iconColor}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold flex items-center gap-1 ${k.valueColor}`}>
                <FaRupeeSign className="text-base opacity-50" />
                {k.value?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-3 gap-5">

          <div className="xl:col-span-2 bg-white rounded-2xl border border-[#e8ecff] shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-700">30-Day Cashflow</h3>
                <p className="text-xs text-slate-400 mt-0.5">Income vs Expenses trend</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Income
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Expense
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="shortDate" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} interval={4} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e8ecff", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 20px rgba(43,82,243,0.08)" }}
                  cursor={{ stroke: "#e8ecff" }}
                />
                <Area type="monotone" dataKey="income"  stroke="#22c55e" strokeWidth={2} fill="url(#incG)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} fill="url(#expG)" strokeDasharray="5 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Radial */}
          <div className="bg-white rounded-2xl border border-[#e8ecff] shadow-sm p-5 flex flex-col items-center justify-center">
            <div className="self-start mb-1">
              <h3 className="text-sm font-bold text-slate-700">Budget Ratio</h3>
              <p className="text-xs text-slate-400 mt-0.5">Income vs Expense</p>
            </div>
            <ResponsiveContainer width="100%" height={175}>
              <RadialBarChart data={radialData} innerRadius="58%" outerRadius="95%" startAngle={180} endAngle={0}>
                <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400 -mt-2">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" /> Income</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> Expense</span>
            </div>
            <div className="mt-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Net Balance</p>
              <p className="text-2xl font-bold text-[#2b52f3] flex items-center justify-center gap-1 mt-1">
                <FaRupeeSign className="text-sm opacity-60" /> {balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {categoryData.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#e8ecff] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 rounded-lg bg-[#eef1ff]">
                <PieIcon className="w-4 h-4 text-[#2b52f3]" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Top Expense Categories</h3>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-48 h-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} innerRadius={52} outerRadius={80} dataKey="value" paddingAngle={4}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#fff", border: "1px solid #e8ecff", borderRadius: "10px", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 space-y-3 w-full">
                {categoryData.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-medium text-slate-600">{c.name}</span>
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                          <FaRupeeSign className="text-[10px] opacity-50" />{c.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#f4f6ff] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.round((c.value / (categoryData[0]?.value || 1)) * 100)}%`,
                            background: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className=" rounded-2xl w-full max-w-xl mx-4 shadow-2xl shadow-[#2b52f3]/10 ">
            {modal.type === "income" ? <AddIncome /> : <AddExpense />}
          </div>
        </div>
      )}
    </>
  );
}