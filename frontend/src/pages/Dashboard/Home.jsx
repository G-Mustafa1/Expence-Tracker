import React from "react";

const Home = () => {
  return (
    <div className="space-y-6">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500">
          Here’s what’s happening with your finances today.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Income Card */}
        <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Income
          </h2>
          <p className="text-2xl font-bold text-green-600 mt-2">
            $5,200
          </p>
        </div>

        {/* Expense Card */}
        <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Expenses
          </h2>
          <p className="text-2xl font-bold text-red-500 mt-2">
            $2,800
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition">
          <h2 className="text-lg font-semibold text-gray-600">
            Balance
          </h2>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            $2,400
          </p>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Recent Transactions
        </h2>

        <ul className="space-y-3">

          <li className="flex justify-between border-b pb-2">
            <span>Salary</span>
            <span className="text-green-600 font-semibold">+$3000</span>
          </li>

          <li className="flex justify-between border-b pb-2">
            <span>Groceries</span>
            <span className="text-red-500 font-semibold">-$150</span>
          </li>

          <li className="flex justify-between border-b pb-2">
            <span>Electric Bill</span>
            <span className="text-red-500 font-semibold">-$100</span>
          </li>

          <li className="flex justify-between">
            <span>Freelance</span>
            <span className="text-green-600 font-semibold">+$500</span>
          </li>

        </ul>
      </div>

    </div>
  );
};

export default Home;