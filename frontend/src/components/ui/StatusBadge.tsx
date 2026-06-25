const config: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  INACTIVE: { label: "Inactive", className: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  ON_LEAVE: { label: "On Leave", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  PENDING: { label: "Pending", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  APPROVED: { label: "Approved", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  REJECTED: { label: "Rejected", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  ANNUAL: { label: "Annual", className: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  SICK: { label: "Sick", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  MATERNITY: { label: "Maternity", className: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  PATERNITY: { label: "Paternity", className: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  UNPAID: { label: "Unpaid", className: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  OTHER: { label: "Other", className: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
};

export default function StatusBadge({ status }: { status: string }) {
  const c = config[status] ?? { label: status, className: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.className}`}>
      {c.label}
    </span>
  );
}
