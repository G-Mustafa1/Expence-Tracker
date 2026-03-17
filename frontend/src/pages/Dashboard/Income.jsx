import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Trash2, Search, Wallet, ArrowUpRight, X } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { deleteIncomeExpense, fetchDashboardData, handleDownloadExcel } from "../../features/dashboardSlice";

const BRAND = "#2b52f3";
const COLORS = [BRAND, "#22c55e", "#a855f7", "#f59e0b", "#14b8a6", "#ec4899"];

export default function Income() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDate, setFilterDate] = useState("30days");
  const [selectedChartCat, setSelectedChartCat] = useState(null);

  if (!dashboard) return null;

  const incomes = dashboard.income || [];

  const chartData = useMemo(() => {
    const categoryTotals = incomes.reduce((acc, curr) => {
      const catName = curr.category || curr.source || "Uncategorized";
      acc[catName] = (acc[catName] || 0) + Number(curr.amount);
      return acc;
    }, {});
    return Object.keys(categoryTotals)
      .map((cat, i) => ({ name: cat, value: categoryTotals[cat], fill: COLORS[i % COLORS.length] }))
      .sort((a, b) => b.value - a.value);
  }, [incomes]);

  const dropdownCategories = ["All", ...chartData.map((c) => c.name)];

  const filteredIncomes = useMemo(() => {
    return incomes.filter((t) => {
      const catName = t.category || t.source || "Uncategorized";
      const matchesCategory = filterCategory === "All" || catName === filterCategory;
      const matchesChart = !selectedChartCat || catName === selectedChartCat;
      const matchesSearch = (catName + (t.source || "")).toLowerCase().includes(search.toLowerCase());
      let matchesDate = true;
      if (t.createdAt && filterDate !== "all") {
        const diff = (new Date() - new Date(t.createdAt)) / (1000 * 60 * 60 * 24);
        if (filterDate === "7days") matchesDate = diff <= 7;
        else if (filterDate === "30days") matchesDate = diff <= 30;
      }
      return matchesCategory && matchesChart && matchesSearch && matchesDate;
    });
  }, [incomes, search, filterCategory, filterDate, selectedChartCat]);

  const totalFilteredIncome = filteredIncomes.reduce((sum, t) => sum + Number(t.amount), 0);

  const handleDelete = (id) => {
    if (window.confirm("Delete this income entry?")) {
      dispatch(deleteIncomeExpense({ id, show: "income" }))
        .unwrap()
        .then(() => dispatch(fetchDashboardData()))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-[#e8ecff]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#eef1ff]">
            <Wallet className="w-5 h-5 text-[#2b52f3]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Income</h1>
            <p className="text-xs text-slate-400 mt-0.5">Track your earnings & revenue</p>
          </div>
        </div>
        <button
          onClick={() => handleDownloadExcel(filteredIncomes, "income")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e8ecff] bg-white text-sm font-semibold text-slate-600 hover:border-[#2b52f3] hover:text-[#2b52f3] transition-all shadow-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Total income card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-[#e8ecff] shadow-sm p-5 border-t-4 border-t-[#2b52f3]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-[#2b52f3] tracking-tight">
            ${totalFilteredIncome.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
              <ArrowUpRight className="w-3 h-3" /> Active
            </span>
            <span className="text-xs text-slate-400">{filteredIncomes.length} transactions found</span>
          </div>
        </div>

        {/* Category count card */}
        <div className="bg-white rounded-2xl border border-[#e8ecff] shadow-sm p-5 flex flex-col justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Income Sources</p>
          <p className="text-3xl font-bold text-slate-800">{chartData.length}</p>
          <div className="mt-4 h-1.5 bg-[#f4f6ff] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-[#2b52f3]"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">Categories active</p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col lg:flex-row gap-3 items-center bg-white border border-[#e8ecff] rounded-2xl p-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8ecff] bg-[#f4f6ff] text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-[#2b52f3] focus:ring-2 focus:ring-[#2b52f3]/10 transition-all"
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 lg:w-44 border border-[#e8ecff] bg-[#f4f6ff] rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none cursor-pointer focus:border-[#2b52f3] transition"
          >
            {dropdownCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 lg:w-44 border border-[#e8ecff] bg-[#f4f6ff] rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none cursor-pointer focus:border-[#2b52f3] transition"
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
              <h4 className="text-sm font-bold text-slate-700">Source Breakdown</h4>
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
                      ? "bg-[#eef1ff] border-[#2b52f3]/30 text-[#2b52f3]"
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

        {/* Transaction Cards */}
        <div className="lg:col-span-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
            {filteredIncomes.length} Records
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[80vh] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredIncomes.map((t, index) => (
                <motion.div
                  key={t._id || index}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="group bg-white border border-[#e8ecff] hover:border-[#2b52f3]/40 hover:shadow-md rounded-2xl p-4 flex flex-col justify-between transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f4f6ff] flex items-center justify-center text-xl border border-[#e8ecff]">
                        {t.icon || "💰"}
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-800 text-sm group-hover:text-[#2b52f3] transition-colors">
                          {t.source || t.category}
                        </h5>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-0.5">
                          {t.category || "General"}
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
                    <p className="text-lg font-bold text-green-600">
                      +₹{Number(t.amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredIncomes.length === 0 && (
              <div className="md:col-span-2 py-16 text-center bg-white border-2 border-dashed border-[#e8ecff] rounded-2xl">
                <Search className="w-6 h-6 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">No income records found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}