import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/authSlice";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const LoginForm = () => {
    const [emailAddress, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!emailAddress.trim()) {
            toast.error("Email is required");
            return;
        }

        if (!password.trim() || password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            toast.loading("Signing in...", { id: "login-toast" });

            await dispatch(login({ emailAddress, password })).unwrap();

            toast.success("Login successful!", { id: "login-toast" });

            navigate("/dashboard");

        } catch (err) {
            toast.error(err.message, { id: "login-toast" });
        }
    };

    return (
        <div className="w-full">

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                    Welcome back 👋
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Login to manage your expenses
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email address
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={emailAddress}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                    />
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <button type="button" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition">
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600"
                    />
                    <label htmlFor="remember" className="text-sm text-slate-600">
                        Remember me for 30 days
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Signing in...
                        </span>
                    ) : (
                        "Sign in"
                    )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs text-slate-400">or continue with</span>
                    <div className="h-px flex-1 bg-slate-200" />
                </div>

                {/* Google */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                    Sign up for free
                </Link>
            </p>
        </div>
    );
};

export default LoginForm;   