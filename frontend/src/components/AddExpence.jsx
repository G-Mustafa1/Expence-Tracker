import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addIncomeExpense, fetchDashboardData } from "../features/dashboardSlice";
import { closeModal } from "../features/modalSlice";
import toast from "react-hot-toast";
import { X, Calendar, Tag, Plus, ArrowDownRight } from "lucide-react";

const ICONS = ["🍔","🍕","☕","🍿","🥗","🛒","🎮","💡","🏡","🚗","📚","🎁"];

export default function AddExpense() {
  const dispatch = useDispatch();
  const [icon, setIcon] = useState("🍔");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || amount <= 0) return toast.error("Fill all fields properly!");
    const loading = toast.loading("Processing...");
    dispatch(addIncomeExpense({ show:"expense", payload:{ icon, category, amount:Number(amount), date }}))
      .unwrap()
      .then(()=>{
        toast.success("Expense added!", {id:loading});
        dispatch(fetchDashboardData());
        dispatch(closeModal());
      })
      .catch(()=>toast.error("Failed to add expense",{id:loading}));
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="relative bg-white/95 border border-gray-200 rounded-2xl p-6 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <ArrowDownRight className="w-6 h-6"/>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Expense Entry</h2>
              <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">Financial Outflow</p>
            </div>
          </div>
          <button type="button" onClick={()=>dispatch(closeModal())} className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-rose-100 hover:text-rose-500">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Expense Amount</label>
          <div className="flex items-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 mt-1">
            <span className="text-rose-500 font-bold mr-2">Rs.</span>
            <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="0.00"
              className="w-full bg-transparent text-gray-800 font-bold outline-none placeholder:text-gray-400" required />
          </div>
        </div>

        {/* Icon & Category & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Icon */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Icon</label>
            <div className="flex flex-wrap gap-2 mt-2 p-2 rounded-xl bg-gray-50 border border-gray-200">
              {ICONS.map(e=>(
                <button key={e} type="button" onClick={()=>setIcon(e)}
                  className={`w-8 h-8 rounded-xl text-lg flex items-center justify-center ${icon===e?"bg-rose-500 text-white":"hover:bg-gray-100"}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Date */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
              <div className="relative mt-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                <input type="text" value={category} onChange={(e)=>setCategory(e.target.value)}
                  placeholder="Food, Bills, etc."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-2 py-2 text-gray-800 font-bold outline-none focus:border-rose-500" required/>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Date</label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-2 py-2 text-gray-800 font-bold outline-none focus:border-rose-500" required/>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full py-3 mt-4 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all flex items-center justify-center gap-2">
          Log Transaction <Plus className="w-4 h-4"/>
        </button>
      </form>
    </div>
  );
}