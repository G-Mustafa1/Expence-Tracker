import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Trash2, Search, Filter, Calendar, Wallet, ArrowUpRight, X } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { deleteIncomeExpense, fetchDashboardData } from "../../features/dashboardSlice";

export default function Income() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDate, setFilterDate] = useState("30days");
  const [selectedChartCat, setSelectedChartCat] = useState(null);

  if (!dashboard) return null;

  const incomes = dashboard.income || [];
  const colors = ["#10b981", "#34d399", "#059669", "#6ee7b7", "#064e3b", "#14b8a6"];

  const chartData = useMemo(() => {
    const categoryTotals = incomes.reduce((acc, curr) => {
      const catName = curr.category || curr.source || "Uncategorized";
      acc[catName] = (acc[catName] || 0) + Number(curr.amount);
      return acc;
    }, {});

    return Object.keys(categoryTotals).map((cat, i) => ({
      name: cat,
      value: categoryTotals[cat],
      fill: colors[i % colors.length],
    })).sort((a, b) => b.value - a.value);
  }, [incomes]);

  // Unique categories list for the dropdown filter
  const dropdownCategories = ["All", ...chartData.map(c => c.name)];

  const filteredIncomes = useMemo(() => {
    return incomes
      .filter((t) => {
        const catName = t.category || t.source || "Uncategorized";
        const matchesCategory = filterCategory === "All" || catName === filterCategory;
        const matchesChart = !selectedChartCat || catName === selectedChartCat;
        const matchesSearch = (catName + (t.source || "")).toLowerCase().includes(search.toLowerCase());
        
        let matchesDate = true;
        if (t.createdAt && filterDate !== "all") {
          const date = new Date(t.createdAt);
          const now = new Date();
          const diff = (now - date) / (1000 * 60 * 60 * 24);
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
    // <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="p-2 bg-emerald-500/20 rounded-xl">
                <Wallet className="w-8 h-8 text-emerald-400" />
              </span>
              Income Analytics
            </h1>
            <p className="text-slate-400 mt-2 font-medium italic tracking-wide">Track your wealth generation</p>
          </div>
          <button
            // onClick={() => handleDownloadExcel(filteredIncomes, "income")}
            className="px-5 py-2.5 rounded-xl border border-slate-700 bg-white/5 hover:bg-slate-900/10 transition-all flex items-center gap-2 font-bold text-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>
        </header>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-emerald-600/20 to-cyan-600/5 border border-emerald-500/20 p-8 rounded-[2.5rem] shadow-2xl"
          >
            <div className="relative z-10">
              <p className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em] mb-1">Total Revenue</p>
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                {/* <CountUp end={totalFilteredIncome} duration={2} separator="," prefix="$" /> */}
              </h2>
              <div className="mt-8 flex items-center gap-2 text-slate-400 text-sm">
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md font-bold">
                  <ArrowUpRight className="w-4 h-4" /> Live
                </span>
                {filteredIncomes.length} Transactions found
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full" />
          </motion.div>

          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
            <p className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-2">Impact Categories</p>
            <h3 className="text-5xl font-black text-black">{chartData.length}</h3>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-6 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} className="h-full bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col lg:flex-row gap-4 items-center bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-md">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400" />
            <input
              type="text"
              placeholder="Search source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border border-black rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 ring-emerald-500/20 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 lg:w-48 bg-white border border-b rounded-2xl px-4 py-3 text-sm font-bold cursor-pointer outline-none appearance-none"
            >
              {dropdownCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="flex-1 lg:w-48 bg-white border border-black rounded-2xl px-4 py-3 text-sm font-bold cursor-pointer outline-none appearance-none"
            >
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
              <option value="all">Lifetime</option>
            </select>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
          
          {/* Chart Section */}
          <div className="lg:col-span-4">
            <div className="bg-white shadow-md border border-white/10 rounded-[2.5rem] p-8 sticky top-10">
               <div className="flex justify-between items-center mb-10">
                  <h4 className="font-black text-black flex items-center gap-2 text-sm uppercase tracking-widest">Allocation</h4>
                  {selectedChartCat && (
                    <button onClick={() => setSelectedChartCat(null)} className="p-1 bg-white/10 rounded-md">
                      <X className="w-4 h-4" />
                    </button>
                  )}
               </div>

               <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={75}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                      onClick={(data) => setSelectedChartCat(data.name === selectedChartCat ? null : data.name)}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={index} 
                          fill={entry.fill} 
                          className="outline-none cursor-pointer"
                          opacity={selectedChartCat ? (entry.name === selectedChartCat ? 1 : 0.2) : 1}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'white', border: 'none', borderRadius: '12px', color: 'white'}} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-full">
                  <p className="text-[10px] font-black text-slate-000 uppercase">Focus</p>
                  <p className="text-lg font-black text-black truncate px-4">{selectedChartCat || "Total"}</p>
                </div>
               </div>

               <div className="mt-8 space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  {chartData.map((c) => (
                    <button 
                      key={c.name}
                      onClick={() => setSelectedChartCat(c.name === selectedChartCat ? null : c.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all border ${selectedChartCat === c.name ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-transparent'}`}
                    >
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-900">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.fill }} />
                        {c.name}
                      </div>
                      <span className="text-xs font-black text-slate-900">${c.value.toLocaleString()}</span>
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Transaction Cards */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[100vh] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredIncomes.map((t, index) => (
                  <motion.div
                    key={t._id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white border border-white/5 shadow-md hover:border-emerald-500/40 p-6 rounded-[2rem] flex flex-col justify-between transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xl border border-white/5">
                          {t.icon || "💰"}
                        </div>
                        <div>
                          <h5 className="font-black text-black text-sm group-hover:text-emerald-400 transition-colors">
                            {t.source || t.category}
                          </h5>
                          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                             {t.category || "General"}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(t._id)} className="p-2 text-red-500/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-end justify-between">
                      <p className="text-xl font-black text-emerald-400">+${t.amount.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-600 font-bold uppercase italic">
                         {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "No Date"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
  );
}