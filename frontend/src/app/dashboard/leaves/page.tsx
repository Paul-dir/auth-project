"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { leaveApi, employeeApi, LeaveRequest, Employee } from "@/lib/api";
import StatusBadge from "@/components/ui/StatusBadge";
import Avatar from "@/components/ui/Avatar";
import {
  CalendarDays, Plus, Filter, Check, X, AlertCircle, Eye, Trash2, Calendar
} from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

export default function LeavesPage() {
  const { token, user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");

  // Create Request Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [leaveType, setLeaveType] = useState("ANNUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Review Modal
  const [reviewRequest, setReviewRequest] = useState<LeaveRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Detail Modal (for already reviewed ones)
  const [detailRequest, setDetailRequest] = useState<LeaveRequest | null>(null);

  // Delete State
  const [leaveToDelete, setLeaveToDelete] = useState<LeaveRequest | null>(null);

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [leavesData, empsData] = await Promise.all([
        leaveApi.getAll(token),
        employeeApi.getAll(token),
      ]);
      setLeaves(leavesData);
      setEmployees(empsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load leave requests data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const openCreateModal = () => {
    setEmployeeId(employees.length > 0 ? employees[0].id : "");
    setLeaveType("ANNUAL");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date().toISOString().split("T")[0]);
    setReason("");
    setCreateError(null);
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!employeeId || !startDate || !endDate) {
      setCreateError("Please fill out all required fields.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setCreateError("Start date cannot be after end date.");
      return;
    }

    const selectedEmp = employees.find((emp) => emp.id === Number(employeeId));
    const payload: Partial<LeaveRequest> = {
      employeeId: Number(employeeId),
      employeeName: selectedEmp ? selectedEmp.fullName : "",
      leaveType,
      startDate,
      endDate,
      reason,
      status: "PENDING",
    };

    try {
      setSubmitting(true);
      setCreateError(null);
      await leaveApi.create(payload, token);
      setIsCreateOpen(false);
      fetchData();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = (req: LeaveRequest) => {
    setReviewRequest(req);
    setReviewNotes("");
    setReviewError(null);
  };

  const submitReview = async (approve: boolean) => {
    if (!token || !reviewRequest || !user) return;
    try {
      setSubmitting(true);
      setReviewError(null);
      const reviewer = user.username;

      if (approve) {
        await leaveApi.approve(reviewRequest.id, reviewer, reviewNotes, token);
      } else {
        await leaveApi.reject(reviewRequest.id, reviewer, reviewNotes, token);
      }

      setReviewRequest(null);
      fetchData();
    } catch (err: any) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !leaveToDelete) return;
    try {
      setSubmitting(true);
      await leaveApi.delete(leaveToDelete.id, token);
      setLeaveToDelete(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete leave request.");
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDuration = (startStr: string, endStr: string) => {
    try {
      const days = differenceInDays(parseISO(endStr), parseISO(startStr)) + 1;
      return days > 0 ? days : 0;
    } catch {
      return 0;
    }
  };

  const filteredLeaves = leaves.filter((lr) => {
    if (selectedStatus === "all") return true;
    return lr.status === selectedStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Leave Requests</h1>
          <p className="text-slate-400 text-sm mt-1">
            Review, approve or log leave applications for employees.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Request Leave
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm">
        <span className="text-slate-400 text-sm font-semibold flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" /> Filter Requests
        </span>
        <div className="flex items-center gap-2">
          {["all", "PENDING", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                selectedStatus === st
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                  : "bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-white"
              }`}
            >
              {st === "all" ? "All Requests" : st.charAt(0) + st.slice(1).toLowerCase()}
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
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Employee</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Leave Type</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Duration</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Dates</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeaves.map((lr) => (
                  <tr key={lr.id} className="hover:bg-slate-900/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={lr.employeeName} size="md" />
                        <div>
                          <p className="text-white text-sm font-semibold truncate group-hover:text-cyan-400 transition-colors">
                            {lr.employeeName}
                          </p>
                          <p className="text-slate-500 text-xs truncate max-w-[200px] mt-0.5" title={lr.reason}>
                            {lr.reason || "No reason specified."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={lr.leaveType} />
                    </td>
                    <td className="p-4">
                      <span className="text-white text-sm font-medium">
                        {calculateDuration(lr.startDate, lr.endDate)} Days
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-400 text-sm">
                        {lr.startDate} → {lr.endDate}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={lr.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {lr.status === "PENDING" ? (
                          <button
                            onClick={() => handleReview(lr)}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1"
                          >
                            Review
                          </button>
                        ) : (
                          <button
                            onClick={() => setDetailRequest(lr)}
                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="View Review Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setLeaveToDelete(lr)}
                          className="p-2 text-slate-400 hover:text-red-450 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredLeaves.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-500 text-sm">
                      No leave requests found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE LEAVE REQUEST MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Request Leave</h2>
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
                  Select Employee <span className="text-red-550">*</span>
                </label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-cyan-500 text-sm transition-colors cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.position})
                    </option>
                  ))}
                </select>
              </div>

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
                    Start Date <span className="text-red-550">*</span>
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
                    End Date <span className="text-red-550">*</span>
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
                  Reason / Description
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide details about the leave request..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500 text-sm transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW REQUEST MODAL */}
      {reviewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Review Leave Request</h2>
              <button
                onClick={() => setReviewRequest(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-2 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{reviewError}</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-slate-955/40 border border-slate-800/60 rounded-2xl">
                <Avatar name={reviewRequest.employeeName} size="md" />
                <div>
                  <h3 className="text-white font-bold text-sm">{reviewRequest.employeeName}</h3>
                  <p className="text-slate-500 text-xs">Requested leave type: <span className="text-slate-300">{reviewRequest.leaveType}</span></p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Duration:</span>
                  <span className="text-white font-semibold">{calculateDuration(reviewRequest.startDate, reviewRequest.endDate)} Days</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Dates:</span>
                  <span className="text-white font-semibold">{reviewRequest.startDate} → {reviewRequest.endDate}</span>
                </div>
                {reviewRequest.reason && (
                  <div className="border-t border-slate-800/80 pt-2 mt-2">
                    <span className="text-slate-500 block text-xs mb-1">Reason:</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{reviewRequest.reason}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-2">
                  Review Notes / Comments
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Provide review reasoning (optional)..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500 text-sm transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setReviewRequest(null)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-350 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => submitReview(false)}
                disabled={submitting}
                className="bg-red-650 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                Reject Request
              </button>
              <button
                type="button"
                onClick={() => submitReview(true)}
                disabled={submitting}
                className="bg-emerald-650 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL (FOR PAST REVIEWS) */}
      {detailRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Leave Details</h2>
              <button
                onClick={() => setDetailRequest(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar name={detailRequest.employeeName} size="md" />
                <div>
                  <h3 className="text-white font-bold text-sm">{detailRequest.employeeName}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <StatusBadge status={detailRequest.leaveType} />
                    <StatusBadge status={detailRequest.status} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="text-white font-semibold">{calculateDuration(detailRequest.startDate, detailRequest.endDate)} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dates:</span>
                  <span className="text-white font-semibold">{detailRequest.startDate} → {detailRequest.endDate}</span>
                </div>
                {detailRequest.reason && (
                  <div className="border-t border-slate-800/80 pt-2 mt-2">
                    <span className="text-slate-500 block mb-1">Reason:</span>
                    <p className="text-slate-350 leading-relaxed">{detailRequest.reason}</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reviewed By:</span>
                  <span className="text-white font-semibold">{detailRequest.reviewedBy || "N/A"}</span>
                </div>
                <div className="border-t border-slate-850/80 pt-2 mt-2">
                  <span className="text-slate-500 block mb-1">Review Notes:</span>
                  <p className="text-slate-350 leading-relaxed italic">
                    {detailRequest.reviewNotes || "No review notes provided."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-800 mt-6">
              <button
                type="button"
                onClick={() => setDetailRequest(null)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {leaveToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-2">Delete Leave Request?</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete the leave request for <span className="text-white font-semibold">{leaveToDelete.employeeName}</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setLeaveToDelete(null)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="bg-red-650 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
