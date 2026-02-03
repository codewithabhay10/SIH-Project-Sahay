// Real auth API integration utilities
import { api } from "./api";

// Frontend uses: 'ministry', 'state', 'ia', 'pacc', 'sna', 'beneficiary'
export type BackendUserRole =
  | "mosje"
  | "state"
  | "ia"
  | "pacc"
  | "sna"
  | "beneficary";
export type UserRole =
  | "ministry"
  | "state"
  | "ia"
  | "pacc"
  | "sna"
  | "beneficiary";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  stateId?: string;
  iaId?: string;
}

const AUTH_STORAGE_KEY = "sahay_auth_user";

function mapRole(role: BackendUserRole | UserRole): UserRole {
  switch (role) {
    case "mosje":
      return "ministry";
    case "beneficary":
      return "beneficiary";
    default:
      return role as UserRole;
  }
}

function persistUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
}

export async function signup(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: BackendUserRole;
}): Promise<User> {
  const res = await api.post("/users/signup", payload);
  const user = res.data?.user as {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: BackendUserRole;
  };
  const mapped: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: mapRole(user.role),
  };
  persistUser(mapped);
  return mapped;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await api.post("/users/login", { email, password });
  const user = res.data?.user as {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: BackendUserRole;
  };
  const mapped: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: mapRole(user.role),
  };
  persistUser(mapped);
  return mapped;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/users/logout");
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function getDashboardRoute(user: User): string {
  switch (user.role) {
    case "ministry":
      return "/dashboard/central";
    case "state":
      return `/dashboard/state/${user.stateId || "MH"}`;
    case "ia":
      return "/dashboard/central"; // Redirect IA to central dashboard
    case "pacc":
      return "/proposals";
    case "sna":
      return "/sna";
    case "beneficiary":
      return "/beneficiary";
    default:
      return "/";
  }
}
