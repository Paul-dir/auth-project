const API_BASE = "/api";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    apiFetch<{ token: string; username: string; email: string; message: string }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ username, password }) }
    ),
  register: (username: string, email: string, password: string) =>
    apiFetch<{ token: string; username: string; email: string; message: string }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify({ username, email, password }) }
    ),
  me: (token: string) =>
    apiFetch<{ id: number; username: string; email: string; role: string }>(
      "/auth/me",
      {},
      token
    ),
};

// Employees
export const employeeApi = {
  getAll: (token: string, params?: { query?: string; departmentId?: number; status?: string }) => {
    const search = new URLSearchParams();
    if (params?.query) search.set("query", params.query);
    if (params?.departmentId) search.set("departmentId", String(params.departmentId));
    if (params?.status) search.set("status", params.status);
    const qs = search.toString();
    return apiFetch<Employee[]>(`/employees${qs ? "?" + qs : ""}`, {}, token);
  },
  getById: (id: number, token: string) => apiFetch<Employee>(`/employees/${id}`, {}, token),
  getProfile: (token: string) => apiFetch<Employee>("/employees/profile", {}, token),
  create: (data: EmployeeRequest, token: string) =>
    apiFetch<Employee>("/employees", { method: "POST", body: JSON.stringify(data) }, token),
  update: (id: number, data: EmployeeRequest, token: string) =>
    apiFetch<Employee>(`/employees/${id}`, { method: "PUT", body: JSON.stringify(data) }, token),
  delete: (id: number, token: string) =>
    apiFetch<null>(`/employees/${id}`, { method: "DELETE" }, token),
};

// Departments
export const departmentApi = {
  getAll: (token: string) => apiFetch<Department[]>("/departments", {}, token),
  create: (data: { name: string; description?: string }, token: string) =>
    apiFetch<Department>("/departments", { method: "POST", body: JSON.stringify(data) }, token),
  update: (id: number, data: { name: string; description?: string }, token: string) =>
    apiFetch<Department>(`/departments/${id}`, { method: "PUT", body: JSON.stringify(data) }, token),
  delete: (id: number, token: string) =>
    apiFetch<null>(`/departments/${id}`, { method: "DELETE" }, token),
};

// Leave Requests
export const leaveApi = {
  getAll: (token: string) => apiFetch<LeaveRequest[]>("/leave-requests", {}, token),
  create: (data: Partial<LeaveRequest>, token: string) =>
    apiFetch<LeaveRequest>("/leave-requests", { method: "POST", body: JSON.stringify(data) }, token),
  approve: (id: number, reviewedBy: string, notes: string, token: string) =>
    apiFetch<LeaveRequest>(
      `/leave-requests/${id}/approve`,
      { method: "PUT", body: JSON.stringify({ reviewedBy, notes }) },
      token
    ),
  reject: (id: number, reviewedBy: string, notes: string, token: string) =>
    apiFetch<LeaveRequest>(
      `/leave-requests/${id}/reject`,
      { method: "PUT", body: JSON.stringify({ reviewedBy, notes }) },
      token
    ),
  delete: (id: number, token: string) =>
    apiFetch<null>(`/leave-requests/${id}`, { method: "DELETE" }, token),
};

// Dashboard
export const dashboardApi = {
  getStats: (token: string) => apiFetch<DashboardStats>("/dashboard/stats", {}, token),
};

// Tickets
export const ticketApi = {
  getAll: (token: string) => apiFetch<Ticket[]>("/tickets", {}, token),
  getCustomerTickets: (token: string) => apiFetch<Ticket[]>("/tickets/customer", {}, token),
  create: (data: { departmentId: number; subject: string; description: string }, token: string) =>
    apiFetch<Ticket>("/tickets", { method: "POST", body: JSON.stringify(data) }, token),
  resolve: (id: number, resolutionNotes: string, token: string) =>
    apiFetch<Ticket>(
      `/tickets/${id}/resolve`,
      { method: "PUT", body: JSON.stringify({ resolutionNotes }) },
      token
    ),
};

// Types
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  position?: string;
  departmentId: number;
  departmentName?: string;
  hireDate?: string;
  status: string;
  salary?: number;
  avatarUrl?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  departmentId: number;
  hireDate?: string;
  status?: string;
  salary?: number;
  address?: string;
  dateOfBirth?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  managerId?: string;
  employeeCount: number;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
  status: string;
  createdAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  totalDepartments: number;
  pendingLeaveRequests: number;
  openTickets: number;
  employeesByDepartment: Record<string, number>;
  employeesByStatus: Record<string, number>;
}

export interface Ticket {
  id: number;
  customerUsername: string;
  customerEmail: string;
  subject: string;
  description: string;
  departmentId: number;
  departmentName?: string;
  status: string; // PENDING, RESOLVED
  createdAt: string;
  updatedAt: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}
