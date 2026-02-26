import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../features/authSlice';
import toast from 'react-hot-toast';

const LoginForm = () => {
    const [emailAddress, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, loading, error } = useSelector(state => state.auth);

    // console.log("user", user);


    useEffect(() => {
        if (user) {
            navigate("/dashboard");
            toast.success("Login successful!", { id: "login-toast" });
        }
    }, [user, navigate]);

    //   if (user) return <Navigate to="/dashboard" replace />;

    const handleLogin = (e) => {
        e.preventDefault();

        if (!emailAddress.trim()) {
            setLocalError("Email is required");
            return;
        }

        if (!password.trim() || password.length < 6) {
            setLocalError("Password must be at least 6 characters");
            return;
        }

        setLocalError("");
        toast.loading("Logging in...", { id: "login-toast" }); // Show loading toast
        dispatch(login({ emailAddress, password }));
    };
    return (
        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Login to manage your expenses
                </p>
            </div>

            {(localError || error) && (
                <div className="bg-red-100 text-red-600 text-sm p-2 rounded">
                    {localError || error.message || "Something went wrong"}
                </div>
            )}

            <div className="space-y-4">

                <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={emailAddress}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

            </div>

            {/* Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            {/* Signup */}
            <p className="text-sm text-center text-gray-600">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                    Signup
                </Link>
            </p>

        </form>
    )
}

export default LoginForm
