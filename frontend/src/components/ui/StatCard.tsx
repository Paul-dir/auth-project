interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  gradient?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  changeType = "neutral",
  gradient = "stat-gradient-violet",
}: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} glass-card p-5 group hover:border-brand-500/25 transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-brand-300 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {change && (
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              changeType === "up"
                ? "bg-emerald-500/15 text-emerald-400"
                : changeType === "down"
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-white/5 text-slate-400"
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="font-display text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-slate-400 text-sm">{title}</p>
    </div>
  );
}
