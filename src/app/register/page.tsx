"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  UserPlus,
  Check,
  Loader2,
  Clock,
  Phone,
  Mail,
  Building2,
  MapPin,
  Navigation,
  CheckSquare,
  Square,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import LocationMap from "@/components/LocationMap";
import { addVisitor } from "@/lib/visitors";
import { getOfficeSettings, calculateDistanceKm, type OfficeSettings } from "@/lib/office";
import styles from "./register.module.css";

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

type Step = "info" | "form" | "done";

export default function RegisterPage() {
  const [office, setOffice] = useState<OfficeSettings | null>(null);
  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(false);
  const [passId, setPassId] = useState("");
  const [consentGiven, setConsentGiven] = useState(true);
  const [visitorLocation, setVisitorLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);
  const [locState, setLocState] = useState<"idle" | "detecting" | "acquired" | "denied">("detecting");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    host: "",
    purpose: "",
    idType: "national-id",
    idNumber: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  function requestLocation() {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocState("denied");
      return;
    }

    setLocState("detecting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setVisitorLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocState("acquired");
      },
      (err) => {
        console.warn("Geolocation permission error:", err);
        setLocState("denied");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }

  useEffect(() => {
    const currentOffice = getOfficeSettings();
    setOffice(currentOffice);
    requestLocation();
  }, []);

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.host.trim()) errs.host = "Please select who / which department you are visiting";
    if (!form.purpose.trim()) errs.purpose = "Please select a purpose of visit";
    if (!form.idNumber.trim()) errs.idNumber = "ID number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const visitor = addVisitor({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      host: form.host.trim(),
      purpose: form.purpose.trim(),
      idType: form.idType as "national-id",
      idNumber: form.idNumber.trim(),
      location: (consentGiven && visitorLocation) ? {
        lat: visitorLocation.lat,
        lng: visitorLocation.lng,
        accuracy: visitorLocation.accuracy,
        timestamp: new Date().toISOString(),
      } : undefined,
    });

    setPassId(visitor.id);
    setLoading(false);
    setStep("done");
  }

  if (!office) return null;

  const hosts = office.hosts ?? [];
  const distance = visitorLocation
    ? calculateDistanceKm(visitorLocation.lat, visitorLocation.lng, office.lat, office.lng)
    : null;

  // ── Step: Office Info ────────────────────────────────────────────────
  if (step === "info") {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          {/* Header with Logo */}
          <div className={styles.header}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <Image
                src="/logo.png"
                alt="eVisitors Logo"
                width={80}
                height={80}
                style={{ objectFit: "contain", borderRadius: 12 }}
                priority
              />
            </div>
            <h1 className={styles.title}>Welcome to {office.name}</h1>
            <p className={styles.subtitle}>
              Visitor Registration & Security Clearance Portal · <strong>{office.name}</strong>
            </p>
          </div>

          {/* Office Details */}
          <div className={styles.officeDetails}>
            <div className={styles.detailItem}>
              <Building2 size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Campus & Office</span>
                <span className={styles.detailValue}>{office.name} · {office.floor}</span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Clock size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Visiting Hours</span>
                <span className={styles.detailValue}>{office.openHours}</span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Phone size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Reception Hotline</span>
                <a href={`tel:${office.phone}`} className={styles.detailValue} style={{ color: "var(--color-primary-hover)", textDecoration: "none" }}>
                  {office.phone}
                </a>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Mail size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Official Email</span>
                <span className={styles.detailValue}>{office.email}</span>
              </div>
            </div>
          </div>

          {/* Location Consent & Live Tracker Box */}
          <div style={{
            background: "rgba(17, 24, 39, 0.9)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <button
                type="button"
                onClick={() => setConsentGiven(!consentGiven)}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: consentGiven ? "#60a5fa" : "var(--color-text-muted)", marginTop: 2 }}
                id="consent-toggle-btn"
                aria-label="Toggle location consent"
              >
                {consentGiven ? <CheckSquare size={20} /> : <Square size={20} />}
              </button>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
                  Visitor Live Location Tracking Consent
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>
                  I consent to sharing my live GPS coordinates with Rongo University Reception and Security for verification, safety management, and campus directions.
                </p>
              </div>
            </div>

            {consentGiven && (
              <div style={{
                background: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                fontSize: 12
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Navigation size={15} style={{ color: locState === "acquired" ? "var(--color-success)" : "#60a5fa" }} />
                  <div>
                    {locState === "detecting" && <span>Acquiring your live GPS coordinates…</span>}
                    {locState === "acquired" && visitorLocation && (
                      <span>
                        <strong>GPS Acquired:</strong> {visitorLocation.lat.toFixed(4)}, {visitorLocation.lng.toFixed(4)}
                        {distance !== null && ` (${distance <= 0.2 ? "On Campus" : `${distance} km from Main Office`})`}
                      </span>
                    )}
                    {locState === "denied" && (
                      <span style={{ color: "#fca5a5" }}>
                        Location permission not granted. Click Refresh to enable GPS.
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={requestLocation}
                  className="btn btn-ghost"
                  style={{ padding: "4px 8px", fontSize: 11, gap: 4 }}
                  title="Refresh GPS"
                >
                  <RefreshCw size={12} className={locState === "detecting" ? styles.spin : ""} />
                  Refresh
                </button>
              </div>
            )}
          </div>

          {/* Campus Map */}
          <LocationMap
            officeLat={office.lat}
            officeLng={office.lng}
            officeName={office.name}
            officeAddress={`${office.address}, ${office.floor}`}
          />

          <button
            className="btn btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: 15, justifyContent: "center" }}
            onClick={() => setStep("form")}
            id="proceed-to-form-btn"
          >
            <UserPlus size={18} />
            Proceed to Visitor Registration Form
          </button>
        </div>
      </div>
    );
  }

  // ── Step: Registration Form ──────────────────────────────────────────
  if (step === "form") {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <Image
                src="/logo.png"
                alt="eVisitors Logo"
                width={70}
                height={70}
                style={{ objectFit: "contain", borderRadius: 10 }}
                priority
              />
            </div>
            <h1 className={styles.title}>Visitor Registration Form</h1>
            <p className={styles.subtitle}>
              Visiting <strong>{office.name}</strong> · {office.floor}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            {/* Personal Info */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Your Personal Details</h3>
              <div className={styles.grid2}>
                <div>
                  <label className="label" htmlFor="reg-name">Full Name *</label>
                  <input id="reg-name" className={`input ${errors.name ? styles.err : ""}`}
                    placeholder="e.g. John Doe" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  {errors.name && <p className={styles.errMsg}>{errors.name}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="reg-company">Institution / Company / Organization</label>
                  <input id="reg-company" className="input" placeholder="e.g. Ministry, Self, Company"
                    value={form.company} onChange={(e) => set("company", e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="reg-phone">Phone Number *</label>
                  <input id="reg-phone" className={`input ${errors.phone ? styles.err : ""}`}
                    placeholder="e.g. 0700 000 000" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  {errors.phone && <p className={styles.errMsg}>{errors.phone}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="reg-email">Email Address</label>
                  <input id="reg-email" type="email" className="input" placeholder="e.g. visitor@example.com"
                    value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Visit Details */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Office / Host to Visit</h3>
              <div className={styles.grid2}>
                <div>
                  <label className="label" htmlFor="reg-host">Office / Department / Host to Visit *</label>
                  <select id="reg-host" className={`input ${errors.host ? styles.err : ""}`}
                    value={form.host} onChange={(e) => set("host", e.target.value)}>
                    <option value="">Select office or department…</option>
                    {hosts.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  {errors.host && <p className={styles.errMsg}>{errors.host}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="reg-purpose">Purpose of Visit *</label>
                  <select id="reg-purpose" className={`input ${errors.purpose ? styles.err : ""}`}
                    value={form.purpose} onChange={(e) => set("purpose", e.target.value)}>
                    <option value="">Select purpose…</option>
                    {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.purpose && <p className={styles.errMsg}>{errors.purpose}</p>}
                </div>
              </div>
            </div>

            {/* ID */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Identification</h3>
              <div className={styles.grid2}>
                <div>
                  <label className="label" htmlFor="reg-idtype">ID Type</label>
                  <select id="reg-idtype" className="input" value={form.idType}
                    onChange={(e) => set("idType", e.target.value)}>
                    <option value="national-id">National ID</option>
                    <option value="passport">Passport</option>
                    <option value="drivers-license">Driver's License</option>
                    <option value="other">Other ID</option>
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="reg-idnum">ID Number *</label>
                  <input id="reg-idnum" className={`input ${errors.idNumber ? styles.err : ""}`}
                    placeholder="Enter National ID or Passport No." value={form.idNumber}
                    onChange={(e) => set("idNumber", e.target.value)} />
                  {errors.idNumber && <p className={styles.errMsg}>{errors.idNumber}</p>}
                </div>
              </div>
            </div>

            {/* Location Tracking Summary */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "var(--color-text-muted)",
              background: "var(--color-surface-2)",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)"
            }}>
              <MapPin size={14} style={{ color: (consentGiven && visitorLocation) ? "var(--color-success)" : "var(--color-text-muted)" }} />
              <span>
                {consentGiven && visitorLocation
                  ? `Live GPS location verified (${visitorLocation.lat.toFixed(4)}, ${visitorLocation.lng.toFixed(4)}) - Distance: ${distance} km`
                  : "Location consent will be attached to visitor record for security check"}
              </span>
            </div>

            <div className={styles.formFooter}>
              <button type="button" className="btn btn-secondary"
                onClick={() => setStep("info")}>← Back to Office Info</button>
              <button type="submit" className="btn btn-primary"
                disabled={loading} style={{ padding: "12px 32px", fontSize: 15 }}>
                {loading ? (
                  <><Loader2 size={18} className={styles.spin} /> Logging visit…</>
                ) : (
                  <><UserPlus size={18} /> Submit Registration</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Step: Done ───────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.successState}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <Image
              src="/logo.png"
              alt="eVisitors Logo"
              width={75}
              height={75}
              style={{ objectFit: "contain", borderRadius: 10 }}
              priority
            />
          </div>
          <div className={styles.successIcon}><Check size={32} /></div>
          <h2 className={styles.successTitle}>Registration Complete!</h2>
          <p className={styles.successSub}>
            Your visit has been recorded in the {office.name} visitors system. Reception and security have received your registration and location verification.
          </p>

          <div className={styles.passIdBox}>
            <span className={styles.passIdLabel}>Your Digital Pass ID</span>
            <span className={styles.passId}>#{passId.slice(-8).toUpperCase()}</span>
          </div>

          <div className={styles.officeDirections}>
            <Building2 size={16} style={{ color: "var(--color-primary-hover)" }} />
            <div>
              <strong>{office.name}</strong> · {office.floor}
              <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>{office.address}</p>
            </div>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginTop: 8,
            fontSize: 13,
            color: "var(--color-text-secondary)"
          }}>
            <Phone size={14} />
            <span>Reception Hotline: <strong>{office.phone}</strong></span>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16, width: "100%", justifyContent: "center" }}>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: "center" }}
            >
              <Navigation size={16} />
              Open GPS Navigation to Campus
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
