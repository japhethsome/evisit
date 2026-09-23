export interface OfficeSettings {
  name: string;
  address: string;
  floor: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  openHours: string;
  hosts: string[];
  baseUrl: string; // for QR code generation
}

const OFFICE_KEY = "evisitors_office";

export const DEFAULT_OFFICE: OfficeSettings = {
  name: "Main Office",
  address: "Ngong Road, Nairobi, Kenya",
  floor: "5th Floor",
  phone: "+254 700 000 000",
  email: "reception@company.com",
  lat: -1.2921,
  lng: 36.8219,
  openHours: "Mon–Fri, 8:00 AM – 6:00 PM",
  hosts: [
    "Reception",
    "CEO Office",
    "CFO Office",
    "HR Department",
    "IT Department",
    "Sales Team",
    "Marketing Team",
    "Procurement",
    "Legal Department",
    "John Mwangi",
    "Sarah Kamau",
    "Peter Ndung'u",
  ],
  baseUrl: "http://localhost:3000",
};

export function getOfficeSettings(): OfficeSettings {
  if (typeof window === "undefined") return DEFAULT_OFFICE;
  try {
    const raw = localStorage.getItem(OFFICE_KEY);
    if (!raw) return DEFAULT_OFFICE;
    return { ...DEFAULT_OFFICE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_OFFICE;
  }
}

export function saveOfficeSettings(settings: OfficeSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(OFFICE_KEY, JSON.stringify(settings));
}

export function getRegisterUrl(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/register`;
}
