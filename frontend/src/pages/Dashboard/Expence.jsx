import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Trash2, Search, CreditCard, TrendingDown, X, Calendar } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { deleteIncomeExpense, fetchDashboardData, handleDownloadExcel } from "../../features/dashboardSlice";

const BRAND  = "#2b52f3";
const COLORS = ["#f43f5e", "#fb923c", "#a855f7", BRAND, "#14b8a6", "#f59e0b"];

export default function Expenses() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDate, setFilterDate] = useState("30days");
  const [selectedChartCat, setSelectedChartCat] = useState(null);

  if (!dashboard) return null;

  const expenses = dashboard.expense || [];

  const chartData = useMemo(() => {
    const cats = [...new Set(expenses.map((t) => t.category || "Other"))];
    return cats
      .map((cat, i) => ({
        name: cat,
        value: expenses
          .filter((t) => (t.category || "Other") === cat)
          .reduce((acc, curr) => acc + Number(curr.amount), 0),
        fill: COLORS[i % COLORS.length],
      }))
      .filter((c) => c.value > 0);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((t) => filterCategory === "All" || (t.category || "Other") === filterCategory)
      .filter((t) => !selectedChartCat || (t.category || "Other") === selectedChartCat)
      .filter((t) => (t.category || "").toLowerCase().includes(search.toLowerCase()))
      .filter((t) => {
        if (!t.createdAt || filterDate === "all") return true;
        const diff = (new Date() - new Date(t.createdAt)) / (1000 * 60 * 60 * 24);
        if (filterDate === "7days") return diff <= 7;
        if (filterDate === "30days") return diff <= 30;
        return true;
      });
  }, [expenses, search, filterCategory, filterDate, selectedChartCat]);

  const totalFilteredExpense = filteredExpenses.reduce((sum, t) => sum + Number(t.amount), 0);

  const handleDelete = (id) => {
    if (window.confirm("Delete this expense entry?")) {
      dispatch(deleteIncomeExpense({ id, show: "expense" }))
        .unwrap()
        .then(() => dispatch(fetchDashboardData()))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-[#e8ecff]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-50">
            <CreditCard className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Expenses</h1>
            <p className="text-xs text-slate-400 mt-0.5">Analyze and control your spending</p>
          </div>
        </div>
        <button
          onClick={() => handleDownloadExcel(filteredExpenses, "expense")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e8ecff] bg-white text-sm font-semibold text-slate-600 hover:border-red-400 hover:text-red-500 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Total expense card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-[#e8ecff] shadow-sm p-5 border-t-4 border-t-red-400">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Total Spending</p>
          <p className="text-3xl font-bold text-red-500 tracking-tight">
            ${totalFilteredExpense.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
              <TrendingDown className="w-3 h-3" /> Outflow
            </span>
            <span className="text-xs text-slate-400">{filteredExpenses.length} transactions in this view</span>
          </div>
        </div>

        {/* Category count card */}
        <div className="bg-white rounded-2xl border border-[#e8ecff] shadow-sm p-5 flex flex-col justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Expense Categories</p>
          <p className="text-3xl font-bold text-slate-800">{chartData.length}</p>
          <div className="mt-4 h-1.5 bg-[#f4f6ff] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-red-400"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">Categories tracked</p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col lg:flex-row gap-3 items-center bg-white border border-[#e8ecff] rounded-2xl p-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by category name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8ecff] bg-[#f4f6ff] text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/10 transition-all"
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 lg:w-44 border border-[#e8ecff] bg-[#f4f6ff] rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none cursor-pointer focus:border-red-400 transition"
          >
            <option value="All">All Categories</option>
            {chartData.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 lg:w-44 border border-[#e8ecff] bg-[#f4f6ff] rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none cursor-pointer focus:border-red-400 transition"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-10">

        {/* Chart Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-[#e8ecff] shadow-sm p-5 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-700">Spending Split</h4>
              </div>
              {selectedChartCat && (
                <button
                  onClick={() => setSelectedChartCat(null)}
                  className="p-1.5 rounded-lg bg-[#f4f6ff] hover:bg-[#e8ecff] transition text-slate-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={68}
                    outerRadius={90}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                    onClick={(data) => setSelectedChartCat(data.name === selectedChartCat ? null : data.name)}
                  >
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.fill}
                        className="cursor-pointer outline-none"
                        opacity={selectedChartCat ? (entry.name === selectedChartCat ? 1 : 0.25) : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #e8ecff", borderRadius: "10px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Focus</p>
                <p className="text-sm font-bold text-slate-700 max-w-20 truncate">{selectedChartCat || "Total"}</p>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {chartData.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedChartCat(c.name === selectedChartCat ? null : c.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all border
                    ${selectedChartCat === c.name
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-[#f4f6ff] border-transparent text-slate-600 hover:border-[#e8ecff]"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.fill }} />
                    {c.name}
                  </div>
                  <span className="font-bold text-slate-800">₹{c.value.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Expense Cards */}
        <div className="lg:col-span-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
            {filteredExpenses.length} Records
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[80vh] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredExpenses.map((t, index) => (
                <motion.div
                  key={t._id || index}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="group bg-white border border-[#e8ecff] hover:border-red-300 hover:shadow-md rounded-2xl p-4 flex flex-col justify-between transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl border border-red-100">
                        {t.icon || "💸"}
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-800 text-sm group-hover:text-red-500 transition-colors">
                          {t.category}
                        </h5>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          {t.createdAt
                            ? new Date(t.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short" })
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="p-1.5 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f4f6ff] flex items-end justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest mb-0.5">Amount Spent</p>
                      <p className="text-lg font-bold text-red-500">-₹{Number(t.amount).toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-[#f4f6ff] rounded-lg group-hover:bg-red-50 transition">
                      <TrendingDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredExpenses.length === 0 && (
              <div className="md:col-span-2 py-16 text-center bg-white border-2 border-dashed border-[#e8ecff] rounded-2xl">
                <Search className="w-6 h-6 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">No expense records found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}