"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, AlertCircle, Sparkles, Shield, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { authApi } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const DEMO_ACCOUNTS = [
  { label: "Admin", username: "admin", password: "admin123", icon: Shield, color: "from-brand-500 to-indigo-600" },
  { label: "Employee", username: "alice", password: "employee123", icon: Briefcase, color: "from-emerald-500 to-indigo-600" },
  { label: "Customer", username: "customer", password: "customer123", icon: User, color: "from-accent-500 to-rose-600" },
];

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const fillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setIsLogin(true);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = isLogin
        ? await authApi.login(username, password)
        : await authApi.register(username, email, password);

      const profile = await authApi.me(data.token);
      login(data.token, profile);
      toast(isLogin ? "Welcome back!" : "Account created successfully!", "success");
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden flex items-center justify-center p-4">
      <div className="ambient-bg" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/20 rounded-full blur-[100px] animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/15 rounded-full blur-[120px] animate-pulse-soft" />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-0 glass-card overflow-hidden shadow-glow-lg animate-slide-up">
        {/* Brand panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-brand-gradient-soft relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-lg">Nexus EMS</p>
                <p className="text-slate-400 text-xs">Workforce Intelligence Platform</p>
              </div>
            </div>
            <h1 className="font-display text-4xl font-bold text-white leading-tight mb-4">
              Manage your team<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient">with clarity</span>
            </h1>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Employees, departments, leave workflows, and support tickets — unified in one beautiful workspace.
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick demo login</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map(({ label, username: u, password: p, icon: Icon, color }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => fillDemo(u, p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-slate-300 hover:text-white"
                >
                  <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-3 h-3 text-white" />
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-brand-gradient rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white">Nexus EMS</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-white mb-1">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {isLogin ? "Sign in to continue to your workspace" : "Join the platform in seconds"}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-xl flex items-center gap-2 text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner className="w-4 h-4" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Mobile demo buttons */}
          <div className="lg:hidden mt-4 flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map(({ label, username: u, password: p }) => (
              <button key={label} type="button" onClick={() => fillDemo(u, p)} className="btn-secondary !text-xs !py-1.5 !px-3">
                {label}
              </button>
            ))}
          </div>

          <p className="mt-6 text-slate-400 text-sm text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={toggleForm} className="text-brand-400 hover:text-brand-300 font-semibold">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
