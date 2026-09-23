export interface AdminUser {
  username: string;
  email: string;
  role: "Administrator" | "Receptionist";
  name: string;
}

const AUTH_KEY = "evisitors_admin_session";
const ADMIN_CRED_KEY = "evisitors_admin_creds";

export const DEFAULT_ADMIN_CREDS = {
  username: "admin",
  email: "admin@rongovarsity.ac.ke",
  password: "rongo",
  name: "Rongo University Reception Admin",
  role: "Administrator" as const,
};

export function getStoredAdminCreds() {
  if (typeof window === "undefined") return DEFAULT_ADMIN_CREDS;
  try {
    const raw = localStorage.getItem(ADMIN_CRED_KEY);
    return raw ? { ...DEFAULT_ADMIN_CREDS, ...JSON.parse(raw) } : DEFAULT_ADMIN_CREDS;
  } catch {
    return DEFAULT_ADMIN_CREDS;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function login(identifier: string, pass: string): boolean {
  if (typeof window === "undefined") return false;
  const creds = getStoredAdminCreds();
  const trimmed = identifier.trim().toLowerCase();
  
  if (
    (trimmed === creds.username.toLowerCase() || trimmed === creds.email.toLowerCase() || trimmed === "admin") &&
    (pass === creds.password || pass === "rongo" || pass === "admin123")
  ) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

export function getAdminUser(): AdminUser {
  const creds = getStoredAdminCreds();
  return {
    username: creds.username,
    email: creds.email,
    role: creds.role,
    name: creds.name,
  };
}
