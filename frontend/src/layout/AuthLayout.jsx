import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen grid md:grid-cols-2 ">

      {/* LEFT SIDE (FORM AREA) */}
      <div className="flex flex-col justify-center px-6 md:px-16 bg-white relative">

        {/* Logo / Title */}
          <h2 className="text-4xl font-bold text-blue-600 mb-20">
            Expense Tracker 💸
          </h2>

          <Outlet />

        {/* </div> */}
      </div>

      {/* RIGHT SIDE (ILLUSTRATION AREA) */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden rounded-l-4xl">

        {/* Background Blur Circles */}
        <div className="absolute w-72 h-72 bg-white/10 rounded-full top-10 left-10 blur-3xl"></div>
        <div className="absolute w-72 h-72 bg-white/10 rounded-full bottom-10 right-10 blur-3xl"></div>

        {/* Content */}
        <div className="text-center text-white px-10 z-10">
          <h1 className="text-4xl font-bold mb-4">
            Manage Your Money Smartly 💰
          </h1>
          <p className="text-blue-100">
            Track your income, control expenses, and stay on top of your finances.
          </p>

          {/* Image */}
          <img
            src="https://expensia.vercel.app/assets/card2-jdHcsL6Y.png"
            alt="expense"
            className="w-[80%] max-w-md mx-auto mt-10 drop-shadow-2xl"
          />
        </div>

      </div>

    </div>
  );
};

export default AuthLayout;