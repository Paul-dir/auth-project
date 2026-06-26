"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { employeeApi, Employee } from "@/lib/api";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  User, Mail, Shield, Briefcase, Phone, MapPin, Calendar, DollarSign, Building2,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) return;
    const role = user.role.toUpperCase();
    if (role === "EMPLOYEE" || role === "ADMIN") {
      employeeApi
        .getProfile(token)
        .then(setEmployee)
        .catch(() => setEmployee(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, user]);

  if (!user) return null;

  const role = user.role.toUpperCase();

  const infoItems = [
    { icon: User, label: "Username", value: user.username, color: "text-brand-400 bg-brand-500/10" },
    { icon: Mail, label: "Email", value: user.email, color: "text-accent-400 bg-accent-500/10" },
    { icon: Shield, label: "Role", value: user.role, color: "text-emerald-400 bg-emerald-500/10" },
  ];

  const employeeItems = employee
    ? [
        { icon: Briefcase, label: "Position", value: employee.position },
        { icon: Building2, label: "Department", value: employee.departmentName },
        { icon: Phone, label: "Phone", value: employee.phone },
        { icon: MapPin, label: "Address", value: employee.address },
        { icon: Calendar, label: "Hire Date", value: employee.hireDate ? format(parseISO(employee.hireDate), "MMM d, yyyy") : undefined },
        { icon: DollarSign, label: "Salary", value: employee.salary ? `$${employee.salary.toLocaleString()}` : undefined },
      ].filter((i) => i.value)
    : [];

  return (
    <div className="page-shell max-w-4xl">
      <PageHeader
        title="My Profile"
        subtitle="Your account details and employment information"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="relative group">
              <div className="w-28 h-28 bg-brand-gradient rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-glow group-hover:scale-105 transition-transform">
                {(employee?.fullName ?? user.username)[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-surface-raised border border-white/10 text-brand-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                {user.role}
              </div>
            </div>

            <div className="flex-1 space-y-6 w-full">
              <div className="text-center md:text-left">
                <h2 className="font-display text-2xl font-bold text-white">
                  {employee?.fullName ?? user.username}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {employee?.position ?? `System ${role.toLowerCase()}`}
                </p>
                {employee && <StatusBadge status={employee.status} />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-white/[0.06] pt-6">
                {infoItems.map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-500/20 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-medium">{label}</p>
                      <p className="text-white font-semibold text-sm truncate">{value}</p>
                    </div>
                  </div>
                ))}

                {employeeItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-400 bg-brand-500/10">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-medium">{label}</p>
                      <p className="text-white font-semibold text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {role === "CUSTOMER" && (
                <p className="text-slate-500 text-sm border-t border-white/[0.06] pt-4">
                  Customer accounts can submit and track support tickets from the dashboard.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
