"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield, Calendar, Award } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto mt-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your personal information and account settings.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Large Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-cyan-500/20 transform group-hover:scale-105 transition-transform duration-300">
              {user.username[0].toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 text-cyan-400 text-xs px-2 py-1 rounded-full font-semibold shadow-md">
              {user.role}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-6 w-full">
            <div>
              <h2 className="text-2xl font-bold text-white text-center md:text-left">{user.username}</h2>
              <p className="text-slate-400 text-sm text-center md:text-left">System {user.role.toLowerCase()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/80 pt-6">
              {/* Username Field */}
              <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 hover:border-slate-700/50 transition-colors">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium">Username</p>
                  <p className="text-white font-semibold text-sm">{user.username}</p>
                </div>
              </div>

              {/* Email Field */}
              <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 hover:border-slate-700/50 transition-colors">
                <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium">Email Address</p>
                  <p className="text-white font-semibold text-sm truncate max-w-[200px]" title={user.email}>
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Role Field */}
              <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 hover:border-slate-700/50 transition-colors">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium">Account Role</p>
                  <p className="text-white font-semibold text-sm">{user.role}</p>
                </div>
              </div>

              {/* Permissions Field */}
              <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 hover:border-slate-700/50 transition-colors">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium">Access Status</p>
                  <p className="text-white font-semibold text-sm">Full Authorized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
