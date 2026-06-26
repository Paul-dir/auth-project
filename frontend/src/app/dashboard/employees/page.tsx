"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { employeeApi, departmentApi, Employee, Department, EmployeeRequest } from "@/lib/api";
import StatusBadge from "@/components/ui/StatusBadge";
import Avatar from "@/components/ui/Avatar";
import {
  Search, Plus, Filter, Edit2, Trash2, X, AlertCircle, Calendar, DollarSign, Briefcase, Mail, Phone, MapPin
} from "lucide-react";

export default function EmployeesPage() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<number | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [hireDate, setHireDate] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [salary, setSalary] = useState<number | "">("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // Delete State
  const [empToDelete, setEmpToDelete] = useState<Employee | null>(null);

  const fetchEmployeesAndDepts = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [deptsData, empsData] = await Promise.all([
        departmentApi.getAll(token),
        employeeApi.getAll(token, {
          query: searchQuery || undefined,
          departmentId: selectedDept !== "all" ? Number(selectedDept) : undefined,
          status: selectedStatus !== "all" ? selectedStatus : undefined,
        }),
      ]);
      setDepartments(deptsData);
      setEmployees(empsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesAndDepts();
  }, [token, searchQuery, selectedDept, selectedStatus]);

  const openAddModal = () => {
    setEditingEmp(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPosition("");
    setDepartmentId(departments.length > 0 ? departments[0].id : "");
    setHireDate(new Date().toISOString().split("T")[0]);
    setStatus("ACTIVE");
    setSalary("");
    setAddress("");
    setDateOfBirth("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmp(emp);
    setFirstName(emp.firstName);
    setLastName(emp.lastName);
    setEmail(emp.email);
    setPhone(emp.phone || "");
    setPosition(emp.position || "");
    setDepartmentId(emp.departmentId);
    setHireDate(emp.hireDate || "");
    setStatus(emp.status);
    setSalary(emp.salary || "");
    setAddress(emp.address || "");
    setDateOfBirth(emp.dateOfBirth || "");
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !departmentId) {
      setModalError("Please fill out all required fields.");
      return;
    }

    const payload: EmployeeRequest = {
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      position: position || undefined,
      departmentId: Number(departmentId),
      hireDate: hireDate || undefined,
      status: status || undefined,
      salary: salary ? Number(salary) : undefined,
      address: address || undefined,
      dateOfBirth: dateOfBirth || undefined,
    };

    try {
      setSubmitting(true);
      setModalError(null);

      if (editingEmp) {
        await employeeApi.update(editingEmp.id, payload, token);
      } else {
        await employeeApi.create(payload, token);
      }

      setIsModalOpen(false);
      fetchEmployeesAndDepts();
    } catch (err: any) {
      setModalError(err.message || "Failed to save employee.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !empToDelete) return;
    try {
      setSubmitting(true);
      await employeeApi.delete(empToDelete.id, token);
      setEmpToDelete(null);
      fetchEmployeesAndDepts();
    } catch (err: any) {
      setError(err.message || "Failed to delete employee.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight">Employees</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your corporate team, positions, details and status.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card border border-white/[0.08] rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 backdrop-blur-sm">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees by name, email or position..."
            className="w-full bg-surface/80 border border-white/[0.08]/85 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-brand-500 text-sm transition-colors"
          />
        </div>

        {/* Department Filter */}
        <div className="relative w-full md:w-48">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="w-full bg-surface/80 border border-white/[0.08]/85 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-3.5 pointer-events-none w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-400" />
        </div>

        {/* Status Filter */}
        <div className="relative w-full md:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-surface/80 border border-white/[0.08]/85 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <div className="absolute right-3.5 top-3.5 pointer-events-none w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-400" />
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
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Employee</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Department</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Hire Date</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Salary</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:glass-card transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={emp.fullName} size="md" />
                        <div className="min-w-0">
                          <p className="text-white text-sm font-semibold truncate group-hover:text-brand-400 transition-colors">
                            {emp.fullName}
                          </p>
                          <p className="text-slate-500 text-xs truncate flex items-center gap-1.5 mt-0.5">
                            <span className="truncate">{emp.position || "Staff"}</span>
                            <span className="text-slate-700 font-bold">·</span>
                            <span className="truncate">{emp.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-350 text-sm font-medium">
                        {emp.departmentName || "Unassigned"}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="p-4">
                      <span className="text-slate-400 text-sm">
                        {emp.hireDate ? new Date(emp.hireDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-white text-sm font-medium">
                        {emp.salary ? `$${emp.salary.toLocaleString()}` : "N/A"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-2 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEmpToDelete(emp)}
                          className="p-2 text-slate-400 hover:text-red-450 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {employees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-500 text-sm">
                      No employees match the specified filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl glass-card p-6 shadow-2xl relative my-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-bold text-white">
                {editingEmp ? "Edit Employee" : "Add Employee"}
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
              {/* Row 1: Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-450 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    First Name <span className="text-red-550">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Alice"
                    className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-450 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Last Name <span className="text-red-550">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Johnson"
                    className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-550">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alice@company.com"
                    className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1-555-0101"
                    className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Position & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Job Title / Position
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Department <span className="text-red-550">*</span>
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
              </div>

              {/* Row 4: Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                    className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Row 5: Status & Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors cursor-pointer"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Salary (USD)
                  </label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 85000"
                    className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-slate-455 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 123 Main St, City, Country"
                  className="w-full bg-surface border border-white/[0.08] text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-brand-500 text-sm transition-colors"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-350 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingEmp ? "Save Changes" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {empToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm">
          <div className="w-full max-w-sm glass-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-2">Delete Employee?</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete <span className="text-white font-semibold">{empToDelete.fullName}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEmpToDelete(null)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="bg-red-650 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
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
