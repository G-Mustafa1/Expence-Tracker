import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../features/authSlice";
import { UploadCloud, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only jpeg, jpg, png, webp files allowed!");
      setProfileImage(null);
      setPreview(null);
      return;
    }
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) { toast.error("Full name is required"); return; }
    if (!email.trim()) { toast.error("Email is required"); return; }
    if (!password.trim() || password.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("emailAddress", email);
    formData.append("password", password);
    if (profileImage) formData.append("profileImg", profileImage);

    try {
      await dispatch(register(formData)).unwrap();
      navigate("/");
      toast.success("Account created!", { id: "signup-toast" });
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Password strength
  const getStrength = (p) => {
    if (p.length === 0) return 0;
    if (p.length < 4) return 1;
    if (p.length < 7) return 2;
    if (p.length < 10) return 3;
    return 4;
  };
  const strength = getStrength(password);
  const strengthMeta = [
    null,
    { label: "Weak", bar: "w-1/4", color: "bg-red-400", text: "text-red-500" },
    { label: "Fair", bar: "w-2/4", color: "bg-orange-400", text: "text-orange-500" },
    { label: "Good", bar: "w-3/4", color: "bg-yellow-400", text: "text-yellow-600" },
    { label: "Strong", bar: "w-full", color: "bg-green-500", text: "text-green-600" },
  ];

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white";

  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-7">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          Create Account 🚀
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Start tracking your expenses today
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-5">

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center gap-2">
          <label className="group cursor-pointer">
            <div className={`relative h-20 w-20 overflow-hidden rounded-full border-2 border-dashed flex items-center justify-center transition-all
              ${preview ? "border-blue-400" : "border-slate-300 hover:border-blue-400"}
              bg-slate-50`}
            >
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <UploadCloud className="h-5 w-5 text-white" />
                  </div>
                </>
              ) : (
                <UploadCloud className="h-6 w-6 text-slate-400 transition group-hover:text-blue-500" />
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <p className="text-xs text-slate-400">
            {preview ? "Click to change photo" : "Upload profile photo (optional)"}
          </p>
        </div>

        {/* Name + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputCls} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Strength bar */}
          {password.length > 0 && strengthMeta[strength] && (
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strengthMeta[strength].bar} ${strengthMeta[strength].color}`} />
              </div>
              <p className="text-xs text-slate-500">
                Strength:{" "}
                <span className={`font-semibold ${strengthMeta[strength].text}`}>
                  {strengthMeta[strength].label}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Terms */}
        <p className="text-xs leading-relaxed text-slate-500">
          By creating an account, you agree to our{" "}
          <span className="cursor-pointer font-medium text-blue-600 hover:underline">Terms of Service</span>{" "}
          and{" "}
          <span className="cursor-pointer font-medium text-blue-600 hover:underline">Privacy Policy</span>.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/" className="font-semibold text-blue-600 hover:text-blue-700 transition">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;