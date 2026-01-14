import { useState } from "react";
import { loginUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Spinner from "../components/Spinner";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      setTimeout(() => navigate("/dashboard"), 200);
    } catch (err) {
      const apiMsg = err.response?.data?.message;
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && Array.isArray(apiErrors)) {
        setError(apiErrors.map((e) => e.message).join(", "));
      } else {
        setError(apiMsg || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Login to access your tasks">
      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="text-sm text-white/70">Email</label>
          <div className="mt-1 relative">
            <input
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl bg-black/30 border border-white/10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-70"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-white/70">Password</label>
          <div className="mt-1 relative">
            <input
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl bg-black/30 border border-white/10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-70 pr-14"
            />

            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white transition cursor-pointer"
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 transition font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-600/25 active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Spinner />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p className="mt-5 text-sm text-white/60">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-300 hover:text-blue-200">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
