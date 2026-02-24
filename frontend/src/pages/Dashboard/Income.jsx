import React from "react";

const Income = () => {
  return (
    <div className="space-y-6">

      {/* Heading */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Income 💰</h1>
          <p className="text-gray-500">Track all your earnings here</p>
        </div>

        <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition">
          + Add Income
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg">
          <h2 className="text-gray-500">Total Income</h2>
          <p className="text-2xl font-bold text-green-600 mt-2">$5200</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg">
          <h2 className="text-gray-500">This Month</h2>
          <p className="text-2xl font-bold text-green-500 mt-2">$1200</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg">
          <h2 className="text-gray-500">Last Month</h2>
          <p className="text-2xl font-bold text-green-400 mt-2">$980</p>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Income History
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2">Source</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody className="space-y-2">
            <tr className="border-b">
              <td className="py-2">Salary</td>
              <td className="text-green-600 font-semibold">$3000</td>
              <td>10 Feb 2026</td>
            </tr>

            <tr className="border-b">
              <td className="py-2">Freelance</td>
              <td className="text-green-600 font-semibold">$500</td>
              <td>15 Feb 2026</td>
            </tr>

            <tr>
              <td className="py-2">Bonus</td>
              <td className="text-green-600 font-semibold">$700</td>
              <td>18 Feb 2026</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Income;