import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import LinkUpLogo, { LinkUpIcon } from "../components/common/LinkUpLogo";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
      await login({
        email,
        password,
      });

      navigate("/chat");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Dynamic Background Ambient Blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Header / Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex relative mb-4">
            <LinkUpIcon size={56} className="hover:scale-105" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">LinkUp</span>
          </h1>

          <p className="mt-2 text-sm text-slate-400 max-w-xs mx-auto">
            Real-time conversation platform built for modern connection.
          </p>
        </div>


        {/* Form Card */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Sign In
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Access your account & conversations
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure
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
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Email Address
              </label>

              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-800/60 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition duration-200 focus:border-indigo-500 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/25"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Password
                </label>
              </div>

              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 p-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition duration-200 hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to LinkUp</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-6 border-t border-slate-800/80 pt-5 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-400 transition hover:text-indigo-300 underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          © 2026 LinkUp • Powered by Socket.IO & React
        </p>
      </div>
    </div>
  );
}

export default Login;