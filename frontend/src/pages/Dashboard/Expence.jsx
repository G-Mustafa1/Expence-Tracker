import React from "react";

const Expence = () => {
  return (
    <div className="space-y-6">

      {/* Heading */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Expenses 💸</h1>
          <p className="text-gray-500">Manage your spending smartly</p>
        </div>

        <button className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition">
          + Add Expense
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg">
          <h2 className="text-gray-500">Total Expenses</h2>
          <p className="text-2xl font-bold text-red-500 mt-2">$2800</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg">
          <h2 className="text-gray-500">This Month</h2>
          <p className="text-2xl font-bold text-red-400 mt-2">$900</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg">
          <h2 className="text-gray-500">Last Month</h2>
          <p className="text-2xl font-bold text-red-300 mt-2">$1100</p>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Expense History
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2">Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-2">Groceries</td>
              <td className="text-red-500 font-semibold">$150</td>
              <td>12 Feb 2026</td>
            </tr>

            <tr className="border-b">
              <td className="py-2">Electric Bill</td>
              <td className="text-red-500 font-semibold">$100</td>
              <td>14 Feb 2026</td>
            </tr>

            <tr>
              <td className="py-2">Transport</td>
              <td className="text-red-500 font-semibold">$80</td>
              <td>18 Feb 2026</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Expence;