"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(""); setSuccess("");
    setUsername(""); setEmail(""); setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); setSuccess("");

    try {
      let data;
      if (isLogin) {
        data = await authApi.login(username, password);
      } else {
        data = await authApi.register(username, email, password);
      }

      // Fetch full profile to get role/id
      const profile = await authApi.me(data.token);
      login(data.token, profile);
      setSuccess(data.message || (isLogin ? "Login successful!" : "Registration successful!"));
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-[570px] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">

        {/* Animated gradient panel */}
        <div className={`absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-500 to-indigo-600 transition-all duration-700 ease-in-out ${isLogin ? "clip-path-login" : "clip-path-register"}`} />
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isLogin ? "clip-path-login" : "clip-path-register"}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
        </div>

        {/* LOGIN PANEL */}
        <div className={`absolute inset-0 flex transition-all duration-700 ease-in-out ${isLogin ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"}`}>
          <div className="w-1/2 h-full flex flex-col justify-center px-12 z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
              <span className="text-slate-300 text-sm font-semibold tracking-wide">EMS Portal</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400 mb-6 text-sm">Sign in to your account to continue</p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg flex items-center gap-2 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-400/50 rounded-lg flex items-center gap-2 text-emerald-300 text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />{success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <input
                  type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username" required
                  className="w-full bg-transparent border-b-2 border-slate-600 text-white py-2 pl-2 pr-10 focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-500 text-sm"
                />
                <User className="absolute right-2 top-2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-4 h-4" />
              </div>
              <div className="relative group">
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" required
                  className="w-full bg-transparent border-b-2 border-slate-600 text-white py-2 pl-2 pr-10 focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-500 text-sm"
                />
                <Lock className="absolute right-2 top-2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-4 h-4" />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : "Sign In"}
              </button>
            </form>

            <p className="mt-4 text-slate-500 text-xs text-center">
              Demo: <span className="text-cyan-400 font-mono">admin / admin123</span>
            </p>
            <p className="mt-3 text-slate-400 text-sm text-center">
              Don&apos;t have an account?{" "}
              <button onClick={toggleForm} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Sign Up</button>
            </p>
          </div>

          <div className="w-1/2 h-full flex flex-col justify-center items-center text-white z-10 px-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">Employee Management</h2>
            <p className="text-white/80 max-w-xs leading-relaxed text-sm">Manage your team, departments, leaves and more — all in one beautiful dashboard.</p>
          </div>
        </div>

        {/* REGISTER PANEL */}
        <div className={`absolute inset-0 flex transition-all duration-700 ease-in-out ${isLogin ? "opacity-0 translate-x-full pointer-events-none" : "opacity-100 translate-x-0"}`}>
          <div className="w-1/2 h-full flex flex-col justify-center items-center text-white z-10 px-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">Join the Team</h2>
            <p className="text-white/80 max-w-xs leading-relaxed text-sm">Create your account to access the employee management platform.</p>
          </div>

          <div className="w-1/2 h-full flex flex-col justify-center px-12 z-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
              <span className="text-slate-300 text-sm font-semibold tracking-wide">EMS Portal</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
            <p className="text-slate-400 mb-5 text-sm">Get started with your free account</p>

            {error && (
              <div className="mb-3 p-3 bg-red-500/20 border border-red-400/50 rounded-lg flex items-center gap-2 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}
            {success && (
              <div className="mb-3 p-3 bg-emerald-500/20 border border-emerald-400/50 rounded-lg flex items-center gap-2 text-emerald-300 text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />{success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { type: "text", value: username, setter: setUsername, placeholder: "Username", Icon: User },
                { type: "email", value: email, setter: setEmail, placeholder: "Email address", Icon: Mail },
                { type: "password", value: password, setter: setPassword, placeholder: "Password", Icon: Lock },
              ].map(({ type, value, setter, placeholder, Icon }) => (
                <div key={placeholder} className="relative group">
                  <input
                    type={type} value={value} onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder} required
                    className="w-full bg-transparent border-b-2 border-slate-600 text-white py-2 pl-2 pr-10 focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-500 text-sm"
                  />
                  <Icon className="absolute right-2 top-2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-4 h-4" />
                </div>
              ))}
              <button
                type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : "Create Account"}
              </button>
            </form>

            <p className="mt-4 text-slate-400 text-sm text-center">
              Already have an account?{" "}
              <button onClick={toggleForm} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Sign In</button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .clip-path-login { clip-path: polygon(55% 0, 100% 0, 100% 100%, 45% 100%); }
        .clip-path-register { clip-path: polygon(0 0, 55% 0, 45% 100%, 0 100%); }
      `}</style>
    </div>
  );
}
