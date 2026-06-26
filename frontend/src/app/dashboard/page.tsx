"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  dashboardApi,
  employeeApi,
  leaveApi,
  ticketApi,
  departmentApi,
  DashboardStats,
  Employee,
  LeaveRequest,
  Ticket,
  Department,
} from "@/lib/api";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import Avatar from "@/components/ui/Avatar";
import {
  Users,
  Building2,
  CalendarDays,
  Clock,
  TrendingUp,
  UserCheck,
  Plus,
  Ticket as TicketIcon,
  Shield,
  Mail,
  Phone,
  Calendar,
  MapPin,
  AlertCircle,
  X,
  MessageSquare,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { differenceInDays, parseISO } from "date-fns";

const PIE_COLORS = ["#06b6d4", "#f59e0b", "#6b7280"];

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role.toUpperCase();

  if (role === "ADMIN") {
    return <AdminDashboard />;
  } else if (role === "EMPLOYEE") {
    return <EmployeeDashboard />;
  } else if (role === "CUSTOMER") {
    return <CustomerDashboard />;
  }

  return (
    <div className="p-6 text-center text-slate-400">
      Invalid account role. Please contact support.
    </div>
  );
}

// ==========================================
// 1. ADMIN DASHBOARD
// ==========================================
function AdminDashboard() {
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
    ])
      .then(([s, emps, leaves]) => {
        setStats(s);
        setRecentEmployees(emps.slice(0, 5));
        setPendingLeaves(leaves.filter((l) => l.status === "PENDING").slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

// ==========================================
// 2. EMPLOYEE DASHBOARD
// ==========================================
function EmployeeDashboard() {
  const { token, user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Leave Request Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("ANNUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchEmployeeData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [empProfile, leavesData] = await Promise.all([
        employeeApi.getProfile(token),
        leaveApi.getAll(token),
      ]);
      setEmployee(empProfile);
      setLeaves(leavesData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load employee details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [token]);

  const handleOpenModal = () => {
    setLeaveType("ANNUAL");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date().toISOString().split("T")[0]);
    setReason("");
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !employee) return;

    if (!startDate || !endDate) {
      setFormError("Dates are required.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setFormError("Start date cannot be after end date.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      await leaveApi.create(
        {
          employeeId: employee.id,
          leaveType,
          startDate,
          endDate,
          reason,
        },
        token
      );
      setIsModalOpen(false);
      fetchEmployeeData();
    } catch (err: any) {
      setFormError(err.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDuration = (start: string, end: string) => {
    try {
      const days = differenceInDays(parseISO(end), parseISO(start)) + 1;
      return days > 0 ? days : 0;
    } catch {
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-10">
        <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-5 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Welcome & Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {employee?.fullName || user?.username}! 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access your profile details, department information, and leave manager.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Request Leave
        </button>
      </div>

      {/* Grid Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-cyan-500/10">
                {employee?.fullName[0] || "?"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{employee?.fullName}</h2>
                <p className="text-slate-400 text-xs">{employee?.position}</p>
                <div className="mt-1">
                  <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {employee?.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <p className="text-slate-550 text-[10px] uppercase font-semibold tracking-wider">Department</p>
                  <p className="text-xs font-semibold">{employee?.departmentName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <p className="text-slate-550 text-[10px] uppercase font-semibold tracking-wider">Email</p>
                  <p className="text-xs truncate max-w-[200px]">{employee?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <p className="text-slate-550 text-[10px] uppercase font-semibold tracking-wider">Phone</p>
                  <p className="text-xs">{employee?.phone || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <p className="text-slate-550 text-[10px] uppercase font-semibold tracking-wider">Joined Date</p>
                  <p className="text-xs">{employee?.hireDate || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Leaves Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              title="My Leaves Logged"
              value={leaves.length}
              icon={<CalendarDays className="w-5 h-5" />}
              gradient="from-cyan-500/20 to-cyan-500/5"
            />
            <StatCard
              title="Approved Requests"
              value={leaves.filter((l) => l.status === "APPROVED").length}
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              gradient="from-emerald-500/20 to-emerald-500/5"
            />
            <StatCard
              title="Pending Review"
              value={leaves.filter((l) => l.status === "PENDING").length}
              icon={<Clock className="w-5 h-5 text-amber-400" />}
              gradient="from-amber-500/20 to-amber-500/5"
            />
          </div>

          {/* Leaves List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" /> Recent Leave Applications
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400">
                    <th className="pb-3 text-xs font-semibold uppercase">Type</th>
                    <th className="pb-3 text-xs font-semibold uppercase">Duration</th>
                    <th className="pb-3 text-xs font-semibold uppercase">Dates</th>
                    <th className="pb-3 text-xs font-semibold uppercase">Status</th>
                    <th className="pb-3 text-xs font-semibold uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {leaves.map((lr) => (
                    <tr key={lr.id} className="text-slate-300">
                      <td className="py-3">
                        <StatusBadge status={lr.leaveType} />
                      </td>
                      <td className="py-3 font-semibold text-white">
                        {calculateDuration(lr.startDate, lr.endDate)} Days
                      </td>
                      <td className="py-3 text-xs text-slate-400">
                        {lr.startDate} → {lr.endDate}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={lr.status} />
                      </td>
                      <td className="py-3 text-xs italic text-slate-400 max-w-[200px] truncate" title={lr.reviewNotes}>
                        {lr.reviewNotes || "No comments"}
                      </td>
                    </tr>
                  ))}
                  {leaves.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No leave history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE LEAVE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Request Leave</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-2 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-cyan-500 text-sm transition-colors cursor-pointer"
                >
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="MATERNITY">Maternity Leave</option>
                  <option value="PATERNITY">Paternity Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                  <option value="OTHER">Other Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide reason or description..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500 text-sm transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-350 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. CUSTOMER DASHBOARD
// ==========================================
function CustomerDashboard() {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Ticket State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCustomerData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [ticketsData, depts] = await Promise.all([
        ticketApi.getCustomerTickets(token),
        departmentApi.getAll(token),
      ]);
      setTickets(ticketsData);
      setDepartments(depts);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load support tickets details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [token]);

  const handleOpenModal = () => {
    setSubject("");
    setDescription("");
    setDepartmentId(departments.length > 0 ? departments[0].id : "");
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!departmentId || !subject || !description) {
      setFormError("All fields are required.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      await ticketApi.create(
        {
          departmentId: Number(departmentId),
          subject,
          description,
        },
        token
      );
      setIsModalOpen(false);
      fetchCustomerData();
    } catch (err: any) {
      setFormError(err.message || "Failed to submit support ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-10">
        <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-5 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome to support portal, {user?.username}! 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Submit inquiry requests, report bugs, or track resolution status of your support tickets.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <PlusCircle className="w-4 h-4" /> Submit Ticket
        </button>
      </div>

      {/* Ticket Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Tickets submitted"
          value={tickets.length}
          icon={<TicketIcon className="w-6 h-6 text-cyan-400" />}
          gradient="from-cyan-500/20 to-cyan-500/5"
        />
        <StatCard
          title="Open / Pending Tickets"
          value={tickets.filter((t) => t.status === "PENDING").length}
          icon={<Clock className="w-6 h-6 text-amber-400" />}
          gradient="from-amber-500/20 to-amber-500/5"
        />
        <StatCard
          title="Resolved Tickets"
          value={tickets.filter((t) => t.status === "RESOLVED").length}
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
          gradient="from-emerald-500/20 to-emerald-500/5"
        />
      </div>

      {/* Ticket List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" /> My Tickets History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-850 text-slate-400">
                <th className="pb-3 text-xs font-semibold uppercase">Subject</th>
                <th className="pb-3 text-xs font-semibold uppercase">Department</th>
                <th className="pb-3 text-xs font-semibold uppercase">Status</th>
                <th className="pb-3 text-xs font-semibold uppercase">Date Submitted</th>
                <th className="pb-3 text-xs font-semibold uppercase">Resolution Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {tickets.map((t) => (
                <tr key={t.id} className="text-slate-300">
                  <td className="py-3 font-semibold text-white max-w-[200px] truncate" title={t.subject}>
                    {t.subject}
                  </td>
                  <td className="py-3">{t.departmentName || "N/A"}</td>
                  <td className="py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="py-3 text-xs text-slate-400">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-3 text-xs max-w-[250px] truncate" title={t.resolutionNotes}>
                    {t.status === "RESOLVED" ? (
                      <span className="text-emerald-450 italic">
                        Resolved by {t.resolvedBy}: &quot;{t.resolutionNotes}&quot;
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Awaiting technical review</span>
                    )}
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No tickets found. Need assistance? Click Submit Ticket above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Submit Support Ticket</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-2 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Assigned Department
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-cyan-500 text-sm transition-colors cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Summary of issue..."
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Inquiry Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide all details about the problem..."
                  rows={5}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500 text-sm transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-350 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
