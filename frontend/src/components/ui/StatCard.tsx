interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  gradient?: string;
}

export default function StatCard({ title, value, icon, change, changeType = "neutral", gradient = "from-cyan-500/20 to-teal-500/20" }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} border border-white/10 rounded-2xl p-5 backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            changeType === "up" ? "bg-emerald-500/20 text-emerald-400" :
            changeType === "down" ? "bg-red-500/20 text-red-400" :
            "bg-slate-500/20 text-slate-400"
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-slate-400 text-sm">{title}</p>
    </div>
  );
}
