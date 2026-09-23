export type VisitorStatus = "checked-in" | "checked-out" | "expected";

export interface Visitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  host: string;
  purpose: string;
  idType: "national-id" | "passport" | "drivers-license" | "other";
  idNumber: string;
  checkInTime: string; // ISO string
  checkOutTime?: string; // ISO string
  status: VisitorStatus;
  company?: string;
}

const STORAGE_KEY = "evisitors_data";

function generateId(): string {
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function getVisitors(): Visitor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveVisitors(visitors: Visitor[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
}

export function addVisitor(
  data: Omit<Visitor, "id" | "status" | "checkInTime">
): Visitor {
  const visitors = getVisitors();
  const newVisitor: Visitor = {
    ...data,
    id: generateId(),
    status: "checked-in",
    checkInTime: new Date().toISOString(),
  };
  saveVisitors([newVisitor, ...visitors]);
  return newVisitor;
}

export function checkOutVisitor(id: string): Visitor | null {
  const visitors = getVisitors();
  const idx = visitors.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  visitors[idx] = {
    ...visitors[idx],
    status: "checked-out",
    checkOutTime: new Date().toISOString(),
  };
  saveVisitors(visitors);
  return visitors[idx];
}

export function getVisitorById(id: string): Visitor | undefined {
  return getVisitors().find((v) => v.id === id);
}

export function deleteVisitor(id: string): void {
  const visitors = getVisitors().filter((v) => v.id !== id);
  saveVisitors(visitors);
}

export function seedIfEmpty(): void {
  const existing = getVisitors();
  if (existing.length > 0) return;
  const { MOCK_VISITORS } = require("./mock-data");
  saveVisitors(MOCK_VISITORS);
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)}, ${formatTime(iso)}`;
}

export function getDuration(checkIn: string, checkOut?: string): string {
  const start = new Date(checkIn).getTime();
  const end = checkOut ? new Date(checkOut).getTime() : Date.now();
  const minutes = Math.floor((end - start) / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
