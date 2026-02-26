import React from 'react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { register } from '../../features/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { UploadCloud } from 'lucide-react'
import toast from 'react-hot-toast'

const SignupForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, user } = useSelector((state) => state.auth);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImge] = useState(null);
    const [preview, setPreview] = useState(null);
    const [localError, setErrors] = useState("");

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
            toast.success("Login successful!", { id: "login-toast" });

        }
    }, [user, navigate]);

    // if (user) return <Navigate to="/" replace />;

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            setErrors("Only image files (jpeg, jpg, png, webp) are allowed!");
            setProfileImge(null);
            setPreview(null);
            return;
        }

        setProfileImge(file);
        setPreview(URL.createObjectURL(file));
        setErrors("");
    }

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

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("emailAddress", email);
        formData.append("password", password);

        if (profileImage) {
            formData.append("profileImg", profileImage); 
        }

        dispatch(register(formData));

        setErrors("")



        // dispatch(register({ fullName, emailAddress: email, password }))
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
                <div className="flex flex-col items-center gap-2">
                    <label className="cursor-pointer">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-blue-500 transition relative">
                            {preview ? (
                                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <UploadCloud className="text-gray-400 w-8 h-8" />
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                    <p className="text-xs text-gray-400">Upload Profile Image</p>
                </div>

                <div className="flex justify-between gap-5">
                    <div className='flex-1'>
                        <label className="text-sm text-gray-600">Full Name</label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
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

export default SignupForm
