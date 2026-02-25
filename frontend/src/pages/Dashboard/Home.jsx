// import React from "react";

// const Home = () => {
//   return (
//     <div className="space-y-6">

//       {/* Heading */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-800">
//           Welcome Back 👋
//         </h1>
//         <p className="text-gray-500">
//           Here’s what’s happening with your finances today.
//         </p>
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         {/* Income Card */}
//         <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition">
//           <h2 className="text-lg font-semibold text-gray-600">
//             Total Income
//           </h2>
//           <p className="text-2xl font-bold text-green-600 mt-2">
//             $5,200
//           </p>
//         </div>

//         {/* Expense Card */}
//         <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition">
//           <h2 className="text-lg font-semibold text-gray-600">
//             Total Expenses
//           </h2>
//           <p className="text-2xl font-bold text-red-500 mt-2">
//             $2,800
//           </p>
//         </div>

//         {/* Balance Card */}
//         <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition">
//           <h2 className="text-lg font-semibold text-gray-600">
//             Balance
//           </h2>
//           <p className="text-2xl font-bold text-blue-600 mt-2">
//             $2,400
//           </p>
//         </div>

//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white shadow-md rounded-2xl p-6">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">
//           Recent Transactions
//         </h2>

//         <ul className="space-y-3">

//           <li className="flex justify-between border-b pb-2">
//             <span>Salary</span>
//             <span className="text-green-600 font-semibold">+$3000</span>
//           </li>

//           <li className="flex justify-between border-b pb-2">
//             <span>Groceries</span>
//             <span className="text-red-500 font-semibold">-$150</span>
//           </li>

//           <li className="flex justify-between border-b pb-2">
//             <span>Electric Bill</span>
//             <span className="text-red-500 font-semibold">-$100</span>
//           </li>

//           <li className="flex justify-between">
//             <span>Freelance</span>
//             <span className="text-green-600 font-semibold">+$500</span>
//           </li>

//         </ul>
//       </div>

//     </div>
//   );
// };

// export default Home;




// // pages/Home.js
// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";

// // import { fetchDashboardData, fetchRecentMonthsTrend } from "../features/dashboardSlice";
// import AddIncome from "../../components/AddIncome";
// import AddExpense from "../../components/AddExpence";
// import { fetchDashboardData } from "../../features/dashboardSlice";
// import { openModal } from "../../features/modalSlice";

// const Home = () => {
//   const dispatch = useDispatch();
//   const { income, expense, totalIncome, totalExpense, balance, recentMonthsTrend, loading } =
//     useSelector((s) => s.dashboard);
//   const modal = useSelector((s) => s.modal);

//   useEffect(() => {
//     dispatch(fetchDashboardData());
//     // dispatch(fetchRecentMonthsTrend());
//   }, [dispatch]);

//   const monthName = new Date().toLocaleDateString("en-US", {
//     month: "long",
//     year: "numeric",
//   });

//   const recentExpenses = [...expense].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
//   const recentIncome = [...income].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

//   return (
//     <div className="p-4 space-y-6 text-white bg-slate-900 min-h-screen">
//       {/* Modal */}
//       {modal.isOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md relative">
//             <button
//               className="absolute top-2 right-2"
//               onClick={() => dispatch(closeModal())}
//             >
//               ✕
//             </button>
//             {modal.type === "income" ? <AddIncome /> : <AddExpense />}
//           </div>
//         </div>
//       )}

//       {/* Header & Buttons */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Financial Dashboard</h1>
//         <div className="space-x-2">
//           <button
//             className="bg-green-600 px-4 py-2 rounded"
//             onClick={() => dispatch(openModal("income"))}
//           >
//             + Income
//           </button>
//           <button
//             className="bg-rose-600 px-4 py-2 rounded"
//             onClick={() => dispatch(openModal("expense"))}
//           >
//             + Expense
//           </button>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-3 gap-4">
//         <div className="bg-slate-700 p-4 rounded">
//           <h3>Total Income</h3>
//           <p>${totalIncome}</p>
//         </div>
//         <div className="bg-slate-700 p-4 rounded">
//           <h3>Total Expense</h3>
//           <p>${totalExpense}</p>
//         </div>
//         <div className="bg-slate-700 p-4 rounded">
//           <h3>Balance</h3>
//           <p>${balance}</p>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="grid grid-cols-2 gap-4">
//         <div className="bg-slate-700 p-4 rounded">
//           <h3>Recent Expenses</h3>
//           {recentExpenses.map((exp, i) => (
//             <div key={i} className="flex justify-between">
//               <span>{exp.category}</span>
//               <span>-${exp.amount}</span>
//             </div>
//           ))}
//         </div>
//         <div className="bg-slate-700 p-4 rounded">
//           <h3>Recent Income</h3>
//           {recentIncome.map((inc, i) => (
//             <div key={i} className="flex justify-between">
//               <span>{inc.source}</span>
//               <span>+${inc.amount}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;




import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteIncomeExpense, fetchDashboardData } from "../../features/dashboardSlice";
import AddIncome from "../../components/AddIncome";
import AddExpense from "../../components/AddExpence";
// import { fetchDashboardData, deleteIncomeExpense, handleDownloadExcel } from "../redux/dashboardSlice";
// import Addincome from "./Addincome";
// import Addexpense from "./Addexpense";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { income, expense, totalIncome, totalExpense, balance, loading } = useSelector(state => state.dashboard);
  
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleDelete = (id, type) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteIncomeExpense({ id, show: type }));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4">
        <button onClick={() => setShowIncomeModal(true)} className="btn">Add Income</button>
        <button onClick={() => setShowExpenseModal(true)} className="btn ml-2">Add Expense</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">Total Income: {totalIncome}</div>
        <div className="card">Total Expense: {totalExpense}</div>
        <div className="card">Balance: {balance}</div>
      </div>

      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Income</h2>
        <button  className="btn btn-sm">Download</button>
        {/* onClick={() => handleDownloadExcel(income, "Income")} */}
      </div>
      <ul>
        {income.map(i => (
          <li key={i._id} className="flex justify-between">
            <span>{i.icon} {i.source} - {i.amount} ({new Date(i.date).toLocaleDateString()})</span>
            <button onClick={() => handleDelete(i._id, "income")} className="btn btn-sm btn-red">Delete</button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-6 mb-4">
        <h2 className="text-xl font-bold">Expenses</h2>
        <button className="btn btn-sm">Download</button>
        {/* onClick={() => handleDownloadExcel(expense, "Expense") */}
      </div>
      <ul>
        {expense.map(e => (
          <li key={e._id} className="flex justify-between">
            <span>{e.icon} {e.category} - {e.amount} ({new Date(e.date).toLocaleDateString()})</span>
            <button onClick={() => handleDelete(e._id, "expense")} className="btn btn-sm btn-red">Delete</button>
          </li>
        ))}
      </ul>

      {showIncomeModal && <AddIncome closeModal={() => setShowIncomeModal(false)} />}
      {showExpenseModal && <AddExpense closeModal={() => setShowExpenseModal(false)} />}
    </div>
  );
};

export default Dashboard;