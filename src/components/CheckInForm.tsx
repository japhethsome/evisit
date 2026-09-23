"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Check, Loader2, MapPin } from "lucide-react";
import { addVisitor } from "@/lib/visitors";
import { getOfficeSettings, type OfficeSettings } from "@/lib/office";
import styles from "./CheckInForm.module.css";

const PURPOSES = [
  "Academic Collaboration",
  "Admission / Student Inquiry",
  "Official University Meeting",
  "Interview",
  "Delivery / Courier",
  "Audit / Inspection",
  "Partnership Discussion",
  "Support / Technical Maintenance",
  "Personal Visit",
  "Other",
];

export default function CheckInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [office, setOffice] = useState<OfficeSettings | null>(null);
  const [visitorLocation, setVisitorLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    host: "",
    purpose: "",
    idType: "national-id" as const,
    idNumber: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  useEffect(() => {
    const off = getOfficeSettings();
    setOffice(off);

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setVisitorLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.host.trim()) errs.host = "Host office / person to visit is required";
    if (!form.purpose.trim()) errs.purpose = "Purpose of visit is required";
    if (!form.idNumber.trim()) errs.idNumber = "ID number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const visitor = addVisitor({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      host: form.host.trim(),
      purpose: form.purpose.trim(),
      idType: form.idType as "national-id",
      idNumber: form.idNumber.trim(),
      location: visitorLocation ? {
        lat: visitorLocation.lat,
        lng: visitorLocation.lng,
        accuracy: visitorLocation.accuracy,
        timestamp: new Date().toISOString(),
      } : undefined,
    });

    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push(`/visitors/${visitor.id}`);
    }, 800);
  }

  if (success) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>
          <Check size={32} />
        </div>
        <h3>Visitor Checked In!</h3>
        <p>Generating digital visitor badge…</p>
      </div>
    );
  }

  const hosts = office?.hosts || [
    "Main Reception & Information Desk",
    "Security Desk & Gate Control",
    "Vice Chancellor's Office",
    "Deputy Vice Chancellor (ASA)",
    "Deputy Vice Chancellor (AFP)",
    "Registrar (Academic Affairs)",
    "Dean of Students",
    "Finance & Accounts Office",
    "Procurement & Supplies",
    "Human Resource Office",
    "ICT Directorate",
  ];

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className="label" htmlFor="name">Full Name *</label>
            <input
              id="name"
              className={`input ${errors.name ? styles.inputError : ""}`}
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>
          <div className={styles.field}>
            <label className="label" htmlFor="company">Institution / Company</label>
            <input
              id="company"
              className="input"
              placeholder="Optional"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className="label" htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              className={`input ${errors.phone ? styles.inputError : ""}`}
              placeholder="e.g. 0700 000 000"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
          </div>
          <div className={styles.field}>
            <label className="label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="Optional"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Visit Details</h3>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className="label" htmlFor="host">Office / Host to Visit *</label>
            <select
              id="host"
              className={`input ${errors.host ? styles.inputError : ""}`}
              value={form.host}
              onChange={(e) => set("host", e.target.value)}
            >
              <option value="">Select office / department…</option>
              {hosts.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            {errors.host && <p className={styles.error}>{errors.host}</p>}
          </div>
          <div className={styles.field}>
            <label className="label" htmlFor="purpose">Purpose of Visit *</label>
            <select
              id="purpose"
              className={`input ${errors.purpose ? styles.inputError : ""}`}
              value={form.purpose}
              onChange={(e) => set("purpose", e.target.value)}
            >
              <option value="">Select purpose…</option>
              {PURPOSES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.purpose && <p className={styles.error}>{errors.purpose}</p>}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Identification</h3>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className="label" htmlFor="idType">ID Type</label>
            <select
              id="idType"
              className="input"
              value={form.idType}
              onChange={(e) => set("idType", e.target.value)}
            >
              <option value="national-id">National ID</option>
              <option value="passport">Passport</option>
              <option value="drivers-license">Driver's License</option>
              <option value="other">Other ID</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className="label" htmlFor="idNumber">ID Number *</label>
            <input
              id="idNumber"
              className={`input ${errors.idNumber ? styles.inputError : ""}`}
              placeholder="Enter ID or Passport number"
              value={form.idNumber}
              onChange={(e) => set("idNumber", e.target.value)}
            />
            {errors.idNumber && <p className={styles.error}>{errors.idNumber}</p>}
          </div>
        </div>
      </div>

      {visitorLocation && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "var(--color-text-muted)",
          padding: "8px 12px",
          background: "var(--color-surface-2)",
          borderRadius: "var(--radius-sm)"
        }}>
          <MapPin size={13} style={{ color: "var(--color-primary-hover)" }} />
          <span>Live GPS coordinates attached: {visitorLocation.lat.toFixed(4)}, {visitorLocation.lng.toFixed(4)}</span>
        </div>
      )}

      <div className={styles.footer}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ padding: "12px 32px", fontSize: 15 }}
        >
          {loading ? (
            <>
              <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              Checking In…
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Check In Visitor
            </>
          )}
        </button>
      </div>
    </form>
  );
}
