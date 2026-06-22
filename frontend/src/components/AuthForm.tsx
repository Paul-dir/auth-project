"use client";

import { useState } from "react";
import { User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

interface AuthFormProps {
  apiBaseUrl?: string;
}

export default function AuthForm({ apiBaseUrl = "http://localhost:8080" }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(""); setSuccess("");
    setUsername(""); setEmail(""); setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); setSuccess("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { username, password } : { username, email, password };

    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Authentication failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      setSuccess(data.message || (isLogin ? "Login successful!" : "Registration successful!"));
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-[550px] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Cyan/Teal/Indigo diagonal gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-500 to-indigo-600 transition-all duration-700 ease-in-out ${isLogin ? "clip-path-login" : "clip-path-register"}`} />
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isLogin ? "clip-path-login" : "clip-path-register"}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
        </div>

        {/* LOGIN */}
        <div className={`absolute inset-0 flex transition-all duration-700 ease-in-out ${isLogin ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"}`}>
          <div className="w-1/2 h-full flex flex-col justify-center px-12 z-10">
            <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
            <p className="text-slate-400 mb-6 text-sm">Sign in to your account</p>
            {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded-lg flex items-center gap-2 text-red-300 text-sm"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
            {success && <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-400 rounded-lg flex items-center gap-2 text-emerald-300 text-sm"><CheckCircle className="w-4 h-4 shrink-0" />{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="w-full bg-transparent border-b-2 border-slate-500 text-white py-2 pl-2 pr-10 focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-500" />
                <User className="absolute right-2 top-2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
              </div>
              <div className="relative group">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-transparent border-b-2 border-slate-500 text-white py-2 pl-2 pr-10 focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-500" />
                <Lock className="absolute right-2 top-2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
            <p className="mt-6 text-slate-400 text-sm text-center">Don&apos;t have an account? <button onClick={toggleForm} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Sign Up</button></p>
          </div>
          <div className="w-1/2 h-full flex flex-col justify-center items-center text-white z-10 px-8 text-center">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">WELCOME BACK!</h2>
            <p className="text-slate-200 max-w-xs leading-relaxed">We are happy to have you with us again. If you need anything, we are here to help.</p>
          </div>
        </div>

        {/* REGISTER */}
        <div className={`absolute inset-0 flex transition-all duration-700 ease-in-out ${isLogin ? "opacity-0 translate-x-full pointer-events-none" : "opacity-100 translate-x-0"}`}>
          <div className="w-1/2 h-full flex flex-col justify-center items-center text-white z-10 px-8 text-center">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">WELCOME!</h2>
            <p className="text-slate-200 max-w-xs leading-relaxed">We&apos;re delighted to have you here. If you need any assistance, feel free to reach out.</p>
          </div>
          <div className="w-1/2 h-full flex flex-col justify-center px-12 z-10">
            <h2 className="text-3xl font-bold text-white mb-2">Register</h2>
            <p className="text-slate-400 mb-6 text-sm">Create a new account</p>
            {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded-lg flex items-center gap-2 text-red-300 text-sm"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
            {success && <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-400 rounded-lg flex items-center gap-2 text-emerald-300 text-sm"><CheckCircle className="w-4 h-4 shrink-0" />{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="w-full bg-transparent border-b-2 border-slate-500 text-white py-2 pl-2 pr-10 focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-500" />
                <User className="absolute right-2 top-2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
              </div>
              <div className="relative group">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full bg-transparent border-b-2 border-slate-500 text-white py-2 pl-2 pr-10 focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-500" />
                <Mail className="absolute right-2 top-2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
              </div>
              <div className="relative group">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-transparent border-b-2 border-slate-500 text-white py-2 pl-2 pr-10 focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-500" />
                <Lock className="absolute right-2 top-2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>
            <p className="mt-6 text-slate-400 text-sm text-center">Already have an account? <button onClick={toggleForm} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Sign In</button></p>
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
