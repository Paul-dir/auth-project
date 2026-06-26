"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldOff } from "lucide-react";

const ADMIN_ONLY = ["/dashboard/employees", "/dashboard/departments"];

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const role = user?.role?.toUpperCase() ?? "";
  const isAdminRoute = ADMIN_ONLY.some((p) => pathname.startsWith(p));
  const denied = isAdminRoute && role !== "ADMIN";

  useEffect(() => {
    if (denied) router.replace("/dashboard");
  }, [denied, router]);

  if (denied) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <ShieldOff className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-slate-400 text-sm max-w-sm">You don&apos;t have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
