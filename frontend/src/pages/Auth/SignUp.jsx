import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
    const handleSignup = () => {
        
    }
    return (
        <form onSubmit={handleSignup} className="space-y-6">

            <div>
                <h2 className="text-3xl font-bold text-gray-800">Create Account 🚀</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Start tracking your expenses today
                </p>
            </div>

            <div className="space-y-4">

                <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        // placeholder="Muhammad Mustafa"
                        // value={form.name}
                        // onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="example@gmail.com"
                        // value={form.email}
                        // onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        // value={form.password}
                        // onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                </div>

            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
                Signup
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

export default SignUp
