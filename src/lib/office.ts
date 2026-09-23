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
  name: "Rongo University",
  address: "Kitere Hill, Off Rongo-Homa Bay Road, Rongo, Migori County, Kenya",
  floor: "Administration Block - Ground Floor",
  phone: "0708992882",
  email: "info@rongovarsity.ac.ke",
  lat: -0.7675,
  lng: 34.6053,
  openHours: "Mon–Fri, 8:00 AM – 5:00 PM",
  hosts: [
    "Main Reception & Information Desk",
    "Security Desk & Gate Control",
    "Vice Chancellor's Office",
    "Deputy Vice Chancellor (ASA)",
    "Deputy Vice Chancellor (AFP)",
    "Registrar (Academic Affairs)",
    "Registrar (Administration)",
    "Dean of Students",
    "Finance & Accounts Office",
    "Procurement & Supplies",
    "Human Resource Office",
    "ICT Directorate",
    "School of Information, Communication & Media",
    "School of Science, Technology & Engineering",
    "School of Education",
    "School of Business & Human Resource Dev.",
    "School of Agriculture, Natural Resources & Env.",
    "University Library",
    "University Health Unit",
  ],
  baseUrl: "http://localhost:3000",
};

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal place
}

export function getOfficeSettings(): OfficeSettings {
  if (typeof window === "undefined") return DEFAULT_OFFICE;
  try {
    const raw = localStorage.getItem(OFFICE_KEY);
    if (!raw) {
      saveOfficeSettings(DEFAULT_OFFICE);
      return DEFAULT_OFFICE;
    }
    const parsed = JSON.parse(raw);
    // If it was the placeholder "Main Office" or old phone number, upgrade to Rongo University
    if (parsed.name === "Main Office" || parsed.phone === "+254 700 000 000") {
      const updated = { ...DEFAULT_OFFICE, ...parsed, name: DEFAULT_OFFICE.name, address: DEFAULT_OFFICE.address, phone: DEFAULT_OFFICE.phone, email: DEFAULT_OFFICE.email, lat: DEFAULT_OFFICE.lat, lng: DEFAULT_OFFICE.lng, floor: DEFAULT_OFFICE.floor };
      saveOfficeSettings(updated);
      return updated;
    }
    return { ...DEFAULT_OFFICE, ...parsed };
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
