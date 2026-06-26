"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { departmentApi, Department } from "@/lib/api";
import { Building2, Plus, Edit2, Trash2, X, AlertCircle } from "lucide-react";

export default function DepartmentsPage() {
  const { token } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

  const fetchDepartments = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await departmentApi.getAll(token);
      setDepartments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [token]);

  const openAddModal = () => {
    setEditingDept(null);
    setName("");
    setDescription("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.name);
    setDescription(dept.description || "");
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!name.trim()) {
      setModalError("Department name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setModalError(null);

      if (editingDept) {
        await departmentApi.update(editingDept.id, { name, description }, token);
      } else {
        await departmentApi.create({ name, description }, token);
      }

      setIsModalOpen(false);
      fetchDepartments();
    } catch (err: any) {
      setModalError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !deptToDelete) return;
    try {
      setSubmitting(true);
      await departmentApi.delete(deptToDelete.id, token);
      setDeptToDelete(null);
      fetchDepartments();
    } catch (err: any) {
      setError(err.message || "Failed to delete department.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight">Departments</h1>
          <p className="text-slate-400 text-sm mt-1">
            Organize, monitor and configure all company departments.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
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

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm group hover:border-white/[0.12] transition-all duration-300 hover:shadow-glow"
            >
              {/* Card top banner style */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500/50 to-indigo-600/50" />

              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center text-brand-400 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(dept)}
                    className="p-2 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Department"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeptToDelete(dept)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h2 className="text-lg font-bold text-white mb-2">{dept.name}</h2>
              <p className="text-slate-400 text-sm mb-6 min-h-[40px] line-clamp-2 leading-relaxed">
                {dept.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between border-t border-white/[0.08]/60 pt-4">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Staff Strength
                </span>
                <span className="bg-slate-800 text-brand-400 px-3 py-1 rounded-full text-xs font-bold border border-white/[0.12]">
                  {dept.employeeCount} {dept.employeeCount === 1 ? "Employee" : "Employees"}
                </span>
              </div>
            </div>
          ))}

          {departments.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-900/20 border border-dashed border-white/[0.08] rounded-3xl">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No departments found</p>
              <p className="text-slate-600 text-sm mt-1">Get started by creating your first department.</p>
            </div>
          )}
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-card p-6 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-bold text-white">
                {editingDept ? "Edit Department" : "Add Department"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-2 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Engineering, Human Resources"
                  className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-brand-400 text-sm transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the department's focus..."
                  rows={4}
                  className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-brand-400 text-sm transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingDept ? "Save Changes" : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deptToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm">
          <div className="w-full max-w-sm glass-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-2">Delete Department?</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete <span className="text-white font-semibold">{deptToDelete.name}</span>? This action is permanent.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeptToDelete(null)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
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
