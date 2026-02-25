// // components/AddExpense.js
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { add } from "../features/dashboardSlice";
// import { closeModal } from "../features/modalSlice";

// const AddExpense = () => {
//   const dispatch = useDispatch();
//   const [category, setCategory] = useState("");
//   const [amount, setAmount] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!category || !amount) return;
//     await dispatch(add({ show: "expense", payload: { category, amount: +amount } }));
//     dispatch(closeModal());
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <input
//         type="text"
//         placeholder="Category"
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         className="w-full p-2 rounded bg-slate-700 text-white"
//       />
//       <input
//         type="number"
//         placeholder="Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         className="w-full p-2 rounded bg-slate-700 text-white"
//       />
//       <button
//         type="submit"
//         className="w-full bg-rose-600 hover:bg-rose-700 p-2 rounded text-white"
//       >
//         Add Expense
//       </button>
//     </form>
//   );
// };

// export default AddExpense;




import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addIncomeExpense } from "../features/dashboardSlice";

const Addexpense = ({ closeModal }) => {
  const [icon, setIcon] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addIncomeExpense({ show: "expense", payload: { icon, category, amount: Number(amount), date } }));
    closeModal();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="modal-content">
        <h2>Add Expense</h2>
        <input placeholder="Icon" value={icon} onChange={e => setIcon(e.target.value)} required />
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
        <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
        <input placeholder="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <button type="submit">Add</button>
        <button type="button" onClick={closeModal}>Cancel</button>
      </form>
    </div>
  );
};

export default Addexpense;