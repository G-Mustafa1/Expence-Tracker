import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { register } from '../../features/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, user } = useSelector((state) => state.auth);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [localError, setErrors] = useState("");

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
            toast.success("Login successful!", { id: "login-toast" });

        }
    }, [user, navigate]);

    // if (user) return <Navigate to="/" replace />;

    const handleSignup = (e) => {
        e.preventDefault();


        if (!fullName.trim()) {
            setErrors("Full name is required");
            return;
        }

        if (!email.trim()) {
            setErrors("email is required")
            return;
        }

        if (!password.trim() || password.length < 6) {
            setErrors("Password must be at least 6 characters");
            return;
        }

        setErrors("")

        // if (Object.keys(newErrors).length > 0) return;

        console.log("Sending Data:", {
            fullName,
            email,
            password
        });

        console.log(error, user)

        dispatch(register({ fullName, emailAddress: email, password }))
    }

    return (
        <form onSubmit={handleSignup} className="space-y-6">

            <div>
                <h2 className="text-3xl font-bold text-gray-800">Create Account 🚀</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Start tracking your expenses today
                </p>
            </div>

            {(localError || error) && (
                <div className="bg-red-100 text-red-600 text-sm p-2 rounded">
                    {localError || error?.message}
                </div>
            )}

            <div className="space-y-4">

                {/* Full Name */}
                <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

            </div>

            <button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            >
                {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/" className="text-blue-600 font-medium hover:underline">
                    Login
                </Link>
            </p>

        </form>
    )
}

export default SignUp;