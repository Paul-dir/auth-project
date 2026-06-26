"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, CalendarDays, LogOut, ChevronLeft, Menu,
  UserCircle2, Ticket, Sparkles, Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "EMPLOYEE", "CUSTOMER"] },
  { href: "/dashboard/employees", label: "Employees", icon: Users, roles: ["ADMIN"] },
  { href: "/dashboard/departments", label: "Departments", icon: Building2, roles: ["ADMIN"] },
  { href: "/dashboard/leaves", label: "Leave Requests", icon: CalendarDays, roles: ["ADMIN", "EMPLOYEE"] },
  { href: "/dashboard/tickets", label: "Support Tickets", icon: Ticket, roles: ["ADMIN", "CUSTOMER"] },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle2, roles: ["ADMIN", "EMPLOYEE", "CUSTOMER"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const role = user?.role?.toUpperCase() ?? "";

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  const displayLabel = (href: string, label: string) => {
    if (href === "/dashboard/leaves" && role === "EMPLOYEE") return "My Leaves";
    if (href === "/dashboard/tickets" && role === "CUSTOMER") return "My Tickets";
    return label;
  };

  return (
    <aside
      className={`h-screen bg-surface-raised/90 backdrop-blur-xl border-r border-white/[0.06] flex flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      } shrink-0 relative z-20`}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-gradient rounded-xl flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display text-white font-bold text-sm leading-tight">Nexus EMS</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">Workforce Hub</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 bg-brand-gradient rounded-xl flex items-center justify-center mx-auto shadow-glow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 ${collapsed ? "mx-auto mt-2" : ""}`}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto px-2">
        <ul className="space-y-1">
          {filteredNavItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            const text = displayLabel(href, label);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`nav-link ${active ? "nav-link-active" : "nav-link-inactive"}`}
                  title={collapsed ? text : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${active ? "text-brand-400" : ""}`} />
                  {!collapsed && <span>{text}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-white/[0.03]">
            <div className="w-9 h-9 bg-brand-gradient rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.username[0].toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-white text-xs font-semibold truncate">{user.username}</p>
              <p className="text-brand-400/80 text-[10px] font-medium uppercase tracking-wide truncate">{user.role}</p>
            </div>
            <Bell className="w-4 h-4 text-slate-600 shrink-0" />
          </div>
        )}
        <button
          onClick={logout}
          className={`nav-link nav-link-inactive w-full hover:!text-red-400 hover:!bg-red-500/10 ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
