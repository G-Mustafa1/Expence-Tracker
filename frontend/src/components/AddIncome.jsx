// // components/AddIncome.js
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { add } from "../features/dashboardSlice";
// import { closeModal } from "../features/modalSlice";

// const AddIncome = () => {
//   const dispatch = useDispatch();
//   const [source, setSource] = useState("");
//   const [amount, setAmount] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!source || !amount) return;
//     await dispatch(add({ show: "income", payload: { source, amount: +amount } }));
//     dispatch(closeModal());
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <input
//         type="text"
//         placeholder="Source"
//         value={source}
//         onChange={(e) => setSource(e.target.value)}
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
//         className="w-full bg-green-600 hover:bg-green-700 p-2 rounded text-white"
//       >
//         Add Income
//       </button>
//     </form>
//   );
// };

// export default AddIncome;






import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addIncomeExpense } from "../features/dashboardSlice";

const Addincome = ({ closeModal }) => {
  const [icon, setIcon] = useState("");
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addIncomeExpense({ show: "income", payload: { icon, source, amount: Number(amount), date } }));
    closeModal();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="modal-content">
        <h2>Add Income</h2>
        <input placeholder="Icon" value={icon} onChange={e => setIcon(e.target.value)} required />
        <input placeholder="Source" value={source} onChange={e => setSource(e.target.value)} required />
        <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
        <input placeholder="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <button type="submit">Add</button>
        <button type="button" onClick={closeModal}>Cancel</button>
      </form>
    </div>
  );
};

export default Addincome;