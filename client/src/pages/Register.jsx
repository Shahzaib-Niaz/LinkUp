import { useState } from "react";
import { registerUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { LinkUpIcon } from "../components/common/LinkUpLogo";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await registerUser({
        fullName,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Background Glow Blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Header / Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex relative mb-4">
            <LinkUpIcon size={56} className="hover:scale-105" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-400 max-w-xs mx-auto">
            Join <span className="text-indigo-400 font-semibold">LinkUp</span> and start messaging in seconds.
          </p>
        </div>


        {/* Form Card */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Get Started
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fill details to register your free profile
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" /> Instant Access
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Full Name
              </label>

              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  required
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-800/60 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition duration-200 focus:border-indigo-500 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/25"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>

              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-800/60 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition duration-200 focus:border-indigo-500 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/25"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>

              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-800/60 py-3 pl-10 pr-11 text-sm text-slate-100 placeholder-slate-500 outline-none transition duration-200 focus:border-indigo-500 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 p-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition duration-200 hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Link to login */}
          <div className="mt-6 border-t border-slate-800/80 pt-5 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-400 transition hover:text-indigo-300 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          © 2026 LinkUp • All rights reserved
        </p>
      </div>
    </div>
  );
}

export default Register;