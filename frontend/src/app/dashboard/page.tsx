"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi, employeeApi, leaveApi, DashboardStats, Employee, LeaveRequest } from "@/lib/api";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import Avatar from "@/components/ui/Avatar";
import {
  Users, Building2, CalendarDays, Clock, TrendingUp, UserCheck,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const PIE_COLORS = ["#06b6d4", "#f59e0b", "#6b7280"];

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      dashboardApi.getStats(token),
      employeeApi.getAll(token),
      leaveApi.getAll(token),
    ]).then(([s, emps, leaves]) => {
      setStats(s);
      setRecentEmployees(emps.slice(0, 5));
      setPendingLeaves(leaves.filter((l) => l.status === "PENDING").slice(0, 5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const deptChartData = stats?.employeesByDepartment
    ? Object.entries(stats.employeesByDepartment).map(([name, count]) => ({
        name: name.length > 12 ? name.slice(0, 12) + "…" : name,
        employees: count,
      }))
    : [];

  const pieData = stats?.employeesByStatus
    ? Object.entries(stats.employeesByStatus).map(([name, value]) => ({ name, value }))
    : [];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {greeting()}, {user?.username} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Here&apos;s what&apos;s happening with your team today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees ?? 0}
          icon={<Users className="w-6 h-6" />}
          gradient="from-cyan-500/20 to-teal-500/10"
        />
        <StatCard
          title="Active Employees"
          value={stats?.activeEmployees ?? 0}
          icon={<UserCheck className="w-6 h-6" />}
          gradient="from-emerald-500/20 to-green-500/10"
          change="Working"
          changeType="up"
        />
        <StatCard
          title="Departments"
          value={stats?.totalDepartments ?? 0}
          icon={<Building2 className="w-6 h-6" />}
          gradient="from-violet-500/20 to-purple-500/10"
        />
        <StatCard
          title="Pending Leaves"
          value={stats?.pendingLeaveRequests ?? 0}
          icon={<Clock className="w-6 h-6" />}
          gradient="from-amber-500/20 to-orange-500/10"
          change={stats?.pendingLeaveRequests ? "Needs review" : "All clear"}
          changeType={stats?.pendingLeaveRequests ? "down" : "up"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white font-semibold">Employees by Department</h2>
          </div>
          {deptChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptChartData} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                  labelStyle={{ color: "#f1f5f9" }}
                  itemStyle={{ color: "#06b6d4" }}
                />
                <Bar dataKey="employees" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No data available</div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <CalendarDays className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white font-semibold">Status Overview</h2>
          </div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                    itemStyle={{ color: "#f1f5f9" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-slate-400">{entry.name.replace("_", " ")}</span>
                    </div>
                    <span className="text-white font-medium">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No data</div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Employees */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" /> Recent Employees
            </h2>
            <a href="/dashboard/employees" className="text-cyan-400 text-xs hover:underline">View all</a>
          </div>
          <div className="space-y-3">
            {recentEmployees.map((emp) => (
              <div key={emp.id} className="flex items-center gap-3">
                <Avatar name={emp.fullName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{emp.fullName}</p>
                  <p className="text-slate-500 text-xs truncate">{emp.position} · {emp.departmentName}</p>
                </div>
                <StatusBadge status={emp.status} />
              </div>
            ))}
            {recentEmployees.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">No employees yet</p>
            )}
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-cyan-400" /> Pending Leaves
            </h2>
            <a href="/dashboard/leaves" className="text-cyan-400 text-xs hover:underline">View all</a>
          </div>
          <div className="space-y-3">
            {pendingLeaves.map((lr) => (
              <div key={lr.id} className="flex items-center gap-3">
                <Avatar name={lr.employeeName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{lr.employeeName}</p>
                  <p className="text-slate-500 text-xs">{lr.startDate} → {lr.endDate}</p>
                </div>
                <StatusBadge status={lr.leaveType} />
              </div>
            ))}
            {pendingLeaves.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">No pending requests</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
