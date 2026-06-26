const config: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
  INACTIVE: { label: "Inactive", className: "bg-slate-500/15 text-slate-400 border-slate-500/25" },
  ON_LEAVE: { label: "On Leave", className: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  PENDING: { label: "Pending", className: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
  IN_PROGRESS: { label: "In Progress", className: "bg-brand-500/15 text-brand-400 border-brand-500/25" },
  APPROVED: { label: "Approved", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
  REJECTED: { label: "Rejected", className: "bg-red-500/15 text-red-400 border-red-500/25" },
  RESOLVED: { label: "Resolved", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
  ANNUAL: { label: "Annual", className: "bg-brand-500/15 text-brand-400 border-brand-500/25" },
  SICK: { label: "Sick", className: "bg-orange-500/15 text-orange-400 border-orange-500/25" },
  MATERNITY: { label: "Maternity", className: "bg-pink-500/15 text-pink-400 border-pink-500/25" },
  PATERNITY: { label: "Paternity", className: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25" },
  UNPAID: { label: "Unpaid", className: "bg-slate-500/15 text-slate-400 border-slate-500/25" },
  OTHER: { label: "Other", className: "bg-teal-500/15 text-teal-400 border-teal-500/25" },
};

export default function StatusBadge({ status }: { status: string }) {
  const c = config[status] ?? { label: status, className: "bg-slate-500/15 text-slate-400 border-slate-500/25" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.className}`}>
      {c.label}
    </span>
  );
}
