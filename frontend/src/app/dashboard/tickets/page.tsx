"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ticketApi, departmentApi, Ticket, Department } from "@/lib/api";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Ticket as TicketIcon,
  Filter,
  Clock,
  X,
  AlertCircle,
  PlusCircle,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Send,
  HelpCircle
} from "lucide-react";

export default function TicketsPage() {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");

  // Create Ticket Modal (Customer only)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Resolve Ticket Modal (Admin only)
  const [ticketToResolve, setTicketToResolve] = useState<Ticket | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolveError, setResolveError] = useState<string | null>(null);

  // Detail Modal (Read-only view)
  const [selectedTicketDetail, setSelectedTicketDetail] = useState<Ticket | null>(null);

  if (!user) return null;

  const role = user.role.toUpperCase();
  const isAdmin = role === "ADMIN";
  const isCustomer = role === "CUSTOMER";
  const isEmployee = role === "EMPLOYEE";

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      if (isAdmin) {
        const [ticketsData, deptsData] = await Promise.all([
          ticketApi.getAll(token),
          departmentApi.getAll(token),
        ]);
        setTickets(ticketsData);
        setDepartments(deptsData);
      } else if (isCustomer) {
        const [ticketsData, deptsData] = await Promise.all([
          ticketApi.getCustomerTickets(token),
          departmentApi.getAll(token),
        ]);
        setTickets(ticketsData);
        setDepartments(deptsData);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load support tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isEmployee) {
      fetchData();
    }
  }, [token, user]);

  if (isEmployee) {
    return (
      <div className="p-6 text-center text-slate-400 mt-20">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-sm">Employees do not have access to the customer support ticketing portal.</p>
      </div>
    );
  }

  const openCreateModal = () => {
    setSubject("");
    setDescription("");
    setDepartmentId(departments.length > 0 ? departments[0].id : "");
    setCreateError(null);
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!departmentId || !subject || !description) {
      setCreateError("Please fill out all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setCreateError(null);
      await ticketApi.create(
        {
          departmentId: Number(departmentId),
          subject,
          description,
        },
        token
      );
      setIsCreateOpen(false);
      fetchData();
    } catch (err: any) {
      setCreateError(err.message || "Failed to submit ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !ticketToResolve) return;

    if (!resolutionNotes.trim()) {
      setResolveError("Resolution notes are required.");
      return;
    }

    try {
      setSubmitting(true);
      setResolveError(null);
      await ticketApi.resolve(ticketToResolve.id, resolutionNotes, token);
      setTicketToResolve(null);
      setResolutionNotes("");
      fetchData();
    } catch (err: any) {
      setResolveError(err.message || "Failed to resolve support ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (selectedStatus === "all") return true;
    return t.status === selectedStatus;
  });

  return (
    <div className="page-shell mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {isAdmin ? "Customer Support Tickets" : "My Support Tickets"}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isAdmin
              ? "Review details, assign departments, and resolve inquiries submitted by customers."
              : "Raise and track inquiry requests for technical or billing support."}
          </p>
        </div>
        {isCustomer && (
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <PlusCircle className="w-4 h-4" /> New Ticket
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-card border border-white/[0.08] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm">
        <span className="text-slate-400 text-sm font-semibold flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-400" /> Filter Tickets
        </span>
        <div className="flex items-center gap-2">
          {["all", "PENDING", "RESOLVED"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                selectedStatus === st
                  ? "bg-brand-500/20 text-brand-400 border-brand-500/30"
                  : "bg-surface/60 text-slate-400 border-white/[0.08] hover:text-white"
              }`}
            >
              {st === "all" ? "All Tickets" : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-2xl flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table Section */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass-card border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.04]">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Subject</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Customer</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Department</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Submitted Date</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:glass-card transition-colors group">
                    <td className="p-4 font-semibold text-white max-w-[220px] truncate" title={t.subject}>
                      {t.subject}
                    </td>
                    <td className="p-4 text-slate-350">
                      <div>
                        <p className="text-white text-sm">{t.customerUsername}</p>
                        <p className="text-slate-500 text-xs truncate max-w-[180px]">{t.customerEmail}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-300">
                      {t.departmentName || "N/A"}
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedTicketDetail(t)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
                        >
                          Details
                        </button>
                        {isAdmin && t.status === "PENDING" && (
                          <button
                            onClick={() => {
                              setTicketToResolve(t);
                              setResolutionNotes("");
                              setResolveError(null);
                            }}
                            className="px-3 py-1.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-500 text-sm">
                      No support tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE INQUIRY MODAL (Customer only) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-card p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TicketIcon className="w-5 h-5 text-brand-400" /> Submit Support Ticket
              </h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-2 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Select Department
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(Number(e.target.value))}
                  className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors cursor-pointer"
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
                  Subject / Summary
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Summary of issue..."
                  className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Description of Inquiry
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide all details about the problem..."
                  rows={5}
                  className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-350 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLVE TICKET MODAL (Admin only) */}
      {ticketToResolve && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-card p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Resolve Ticket
              </h2>
              <button
                onClick={() => setTicketToResolve(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resolveError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-2 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resolveError}</span>
              </div>
            )}

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div className="bg-surface border border-white/[0.08] rounded-xl p-4 text-xs space-y-2">
                <div>
                  <span className="text-slate-500 block">Customer:</span>
                  <span className="text-white font-semibold">{ticketToResolve.customerUsername} ({ticketToResolve.customerEmail})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Subject:</span>
                  <span className="text-white font-semibold">{ticketToResolve.subject}</span>
                </div>
                <div className="border-t border-slate-850/80 pt-2 mt-2">
                  <span className="text-slate-500 block mb-1">Issue Description:</span>
                  <p className="text-slate-300 max-h-24 overflow-y-auto leading-relaxed">{ticketToResolve.description}</p>
                </div>
              </div>

              <div>
                <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-2">
                  Resolution Notes / Actions Taken
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Provide resolution details for the customer..."
                  rows={4}
                  className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setTicketToResolve(null)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-350 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Resolve Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL (Read-only Detail view) */}
      {selectedTicketDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-400" /> Support Ticket Details
              </h2>
              <button
                onClick={() => setSelectedTicketDetail(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-surface border border-slate-850 rounded-xl p-4 text-xs space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ticket ID:</span>
                  <span className="text-white font-semibold">#{selectedTicketDetail.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-white font-semibold">{selectedTicketDetail.departmentName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <StatusBadge status={selectedTicketDetail.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="text-white font-semibold">{selectedTicketDetail.customerUsername}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-white font-semibold truncate max-w-[200px]">{selectedTicketDetail.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submitted:</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {selectedTicketDetail.createdAt ? new Date(selectedTicketDetail.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>

              <div className="bg-surface/40 border border-white/[0.08] rounded-xl p-4 text-xs">
                <span className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Subject</span>
                <p className="text-white font-semibold text-sm mb-2">{selectedTicketDetail.subject}</p>
                <span className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Description</span>
                <p className="text-slate-300 leading-relaxed max-h-32 overflow-y-auto">{selectedTicketDetail.description}</p>
              </div>

              {selectedTicketDetail.status === "RESOLVED" && (
                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 text-xs">
                  <span className="text-emerald-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Resolution Notes</span>
                  <p className="text-emerald-200 leading-relaxed italic">
                    Resolved by {selectedTicketDetail.resolvedBy}: &quot;{selectedTicketDetail.resolutionNotes}&quot;
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-white/[0.08] mt-6">
              <button
                type="button"
                onClick={() => setSelectedTicketDetail(null)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-350 px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
