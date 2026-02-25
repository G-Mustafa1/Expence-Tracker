import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Trash2, Search, Filter, Calendar, CreditCard, TrendingDown, X, ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { deleteIncomeExpense, fetchDashboardData } from "../../features/dashboardSlice";

export default function Expenses() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDate, setFilterDate] = useState("30days");
  const [selectedChartCat, setSelectedChartCat] = useState(null);

  if (!dashboard) return null;

  const expenses = dashboard.expense || [];
  const colors = ["#f43f5e", "#fb7185", "#e11d48", "#fda4af", "#9f1239"];

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((t) => filterCategory === "All" || (t.category || "Other") === filterCategory)
      .filter((t) => !selectedChartCat || (t.category || "Other") === selectedChartCat)
      .filter((t) =>
        (t.category || "").toLowerCase().includes(search.toLowerCase())
      )
      .filter((t) => {
        if (!t.createdAt || filterDate === "all") return true;
        const date = new Date(t.createdAt);
        const now = new Date();
        const diff = (now - date) / (1000 * 60 * 60 * 24);
        if (filterDate === "7days") return diff <= 7;
        if (filterDate === "30days") return diff <= 30;
        return true;
      });
  }, [expenses, search, filterCategory, filterDate, selectedChartCat]);

  const totalFilteredExpense = filteredExpenses.reduce((sum, t) => sum + Number(t.amount), 0);

  const chartData = useMemo(() => {
    const cats = [...new Set(expenses.map(t => t.category || "Other"))];
    return cats.map((cat, i) => {
      const value = expenses
        .filter((t) => (t.category || "Other") === cat)
        .reduce((acc, curr) => acc + Number(curr.amount), 0);
      return { name: cat, value, fill: colors[i % colors.length] };
    }).filter(c => c.value > 0);
  }, [expenses]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this expense entry?")) {
      dispatch(deleteIncomeExpense({ id, show: "expense" }))
        .unwrap()
        .then(() => dispatch(fetchDashboardData()))
        .catch((err) => console.error(err));
    }
  };

  return (
      
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-black flex items-center gap-3">
              <span className="p-2 bg-rose-500/20 rounded-xl">
                <CreditCard className="w-8 h-8 text-rose-400" />
              </span>
              Expense Tracker
            </h1>
            <p className="text-slate-400 mt-2 font-medium tracking-wide italic">Analyze and optimize your spending habits</p>
          </div>
          
          <button
            // onClick={() => handleDownloadExcel(filteredExpenses, "expense")}
            className="px-5 py-2.5 rounded-xl border border-black bg-white/5 hover:bg-black/10 transition-all flex items-center gap-2 font-bold text-sm"
          >
            <Download className="w-4 h-4 text-rose-400" /> Export CSV
          </button>
        </header>

        {/* --- KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-rose-600/20 to-pink-600/5 border border-rose-500/20 p-8 rounded-[2.5rem] shadow-2xl shadow-rose-500/5"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-rose-400 font-black text-xs uppercase tracking-[0.3em] mb-1">Total Spending</p>
                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                  {/* <CountUp end={totalFilteredExpense} duration={2} separator="," prefix="$" /> */}
                </h2>
              </div>
              <div className="mt-8 flex items-center gap-2 text-slate-400 text-sm font-medium">
                <span className="flex items-center gap-1 text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-md">
                  <TrendingDown className="w-4 h-4" /> Outflow
                </span>
                {filteredExpenses.length} transactions in this view
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-rose-500/20 blur-[100px] rounded-full" />
          </motion.div>

          <div className="bg-black/[0.03] shadow-md border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Impact Categories</p>
            <h3 className="text-5xl font-black text-black">{chartData.length}</h3>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-6 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-rose-500" />
            </div>
          </div>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="flex flex-col lg:flex-row gap-4 items-center bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-md">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500  group-focus-within:text-rose-400 transition-colors" />
            <input
              type="text"
              placeholder="Filter by category name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border border-black/10 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 ring-rose-500/20 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 lg:w-48 shadow-md border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold cursor-pointer outline-none hover:bg-slate-100 transition-colors appearance-none"
            >
              <option value="All">All Categories</option>
              {chartData.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="flex-1 lg:w-48 shadow-md border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold cursor-pointer outline-none hover:bg-slate-100 transition-colors appearance-none"
            >
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
              <option value="all">Lifetime</option>
            </select>
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
          
          {/* Chart Section */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 sticky top-10 shadow-2xl">
               <div className="flex justify-between items-center mb-10">
                  <h4 className="font-black text-black flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    Spending Split
                  </h4>
                  {selectedChartCat && (
                    <button onClick={() => setSelectedChartCat(null)} className="p-1 bg-white/10 rounded-md hover:bg-white/20 transition-colors">
                      <X className="w-4 h-4 text-rose-400" />
                    </button>
                  )}
               </div>

               <div className="h-72 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={85}
                      outerRadius={110}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                      onClick={(data) => setSelectedChartCat(data.name === selectedChartCat ? null : data.name)}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={index} 
                          fill={entry.fill} 
                          className="outline-none transition-all duration-500 cursor-pointer"
                          opacity={selectedChartCat ? (entry.name === selectedChartCat ? 1 : 0.2) : 1}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-black border border-white/10 p-3 rounded-xl shadow-2xl">
                            <p className="text-white font-black">{payload[0].name}</p>
                            <p className="text-rose-400 font-bold">${payload[0].value.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-full">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Focused</p>
                  <p className="text-xl font-black text-black leading-none mt-1 px-4 truncate">
                    {selectedChartCat ? selectedChartCat : "Total"}
                  </p>
                </div>
               </div>

               <div className="mt-10 space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  {chartData.map((c) => (
                    <button 
                      key={c.name}
                      onClick={() => setSelectedChartCat(c.name === selectedChartCat ? null : c.name)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedChartCat === c.name ? 'bg-rose-500/10 border-rose-500/30 shadow-lg shadow-rose-500/5' : 'bg-white/5 border-transparent hover:border-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.fill }} />
                        <span className="text-sm font-bold text-slate-900">{c.name}</span>
                      </div>
                      <span className="text-sm font-black text-black">${c.value.toLocaleString()}</span>
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Transactions Cards Section */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4 ">
            <h4 className="text-xs font-black text-slate-500 uppercase  tracking-[0.2em] ml-2">Expense Records</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[100vh] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredExpenses.map((t, index) => (
                  <motion.div
                    key={t._id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group bg-white/[0.03] border border-black hover:border-rose-500/40 p-6 shadow-2xl rounded-[2rem] flex flex-col justify-between transition-all hover:bg-white/[0.06] hover:shadow-2xl shadow-rose-500/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4 ">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900/80 flex items-center justify-center text-3xl shadow-xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                          {t.icon || "💸"}
                        </div>
                        <div>
                          <h5 className="font-black text-slate-900 group-hover:text-rose-400 transition-colors">{t.category}</h5>
                          <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 uppercase mt-1">
                            <Calendar className="w-3 h-3 text-rose-500" />
                            {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : "Recently"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="p-2 rounded-xl bg-red-500/5 text-red-500/40 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-end justify-between">
                      <div>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Amount Spent</p>
                         <p className="text-2xl font-black text-rose-400 mt-1">-${t.amount.toLocaleString()}</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg">
                         <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-rose-400 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredExpenses.length === 0 && (
              <div className="py-20 text-center bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5">
                <Search className="w-8 h-8 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">No expense records found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}