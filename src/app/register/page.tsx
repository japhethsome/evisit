"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  UserPlus,
  Check,
  Loader2,
  Clock,
  Phone,
  Mail,
  Building2,
} from "lucide-react";
import LocationMap from "@/components/LocationMap";
import { addVisitor } from "@/lib/visitors";
import { getOfficeSettings, type OfficeSettings } from "@/lib/office";
import styles from "./register.module.css";

const PURPOSES = [
  "Business Meeting",
  "Interview",
  "Delivery",
  "Audit / Inspection",
  "Partnership Discussion",
  "Support / Maintenance",
  "Training",
  "Personal Visit",
  "Other",
];

type Step = "info" | "form" | "done";

export default function RegisterPage() {
  const router = useRouter();
  const [office, setOffice] = useState<OfficeSettings | null>(null);
  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(false);
  const [passId, setPassId] = useState("");
  const [visitorLocation, setVisitorLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  useEffect(() => {
    setOffice(getOfficeSettings());
    // Try to get location early
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setVisitorLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {}
      );
    }
  }, []);

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.host.trim()) errs.host = "Please select who you are visiting";
    if (!form.purpose.trim()) errs.purpose = "Please select a purpose";
    if (!form.idNumber.trim()) errs.idNumber = "ID number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const visitor = addVisitor({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      host: form.host.trim(),
      purpose: form.purpose.trim(),
      idType: form.idType as "national-id",
      idNumber: form.idNumber.trim(),
    });
    setPassId(visitor.id);
    setLoading(false);
    setStep("done");
  }

  if (!office) return null;

  const hosts = office.hosts ?? [];

  // ── Step: Office Info ────────────────────────────────────────────────
  if (step === "info") {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logoRow}>
              <div className={styles.logoIcon}><ShieldCheck size={22} /></div>
              <span className={styles.logoText}>eVisitors</span>
            </div>
            <h1 className={styles.title}>Welcome, Visitor!</h1>
            <p className={styles.subtitle}>
              You're about to visit <strong>{office.name}</strong>. Please review
              the office information below, then proceed to fill in your details.
            </p>
          </div>

          {/* Office Details */}
          <div className={styles.officeDetails}>
            <div className={styles.detailItem}>
              <Building2 size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Office</span>
                <span className={styles.detailValue}>{office.name} · {office.floor}</span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Clock size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Hours</span>
                <span className={styles.detailValue}>{office.openHours}</span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Phone size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Reception</span>
                <span className={styles.detailValue}>{office.phone}</span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Mail size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{office.email}</span>
              </div>
            </div>
          </div>

          {/* Map */}
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
            Proceed to Registration Form
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
            <div className={styles.logoRow}>
              <div className={styles.logoIcon}><ShieldCheck size={22} /></div>
              <span className={styles.logoText}>eVisitors</span>
            </div>
            <h1 className={styles.title}>Visitor Registration</h1>
            <p className={styles.subtitle}>
              Visiting <strong>{office.name}</strong> · {office.floor}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            {/* Personal Info */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Your Details</h3>
              <div className={styles.grid2}>
                <div>
                  <label className="label" htmlFor="reg-name">Full Name *</label>
                  <input id="reg-name" className={`input ${errors.name ? styles.err : ""}`}
                    placeholder="John Doe" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  {errors.name && <p className={styles.errMsg}>{errors.name}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="reg-company">Company / Organization</label>
                  <input id="reg-company" className="input" placeholder="Optional"
                    value={form.company} onChange={(e) => set("company", e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="reg-phone">Phone Number *</label>
                  <input id="reg-phone" className={`input ${errors.phone ? styles.err : ""}`}
                    placeholder="+254 700 000 000" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  {errors.phone && <p className={styles.errMsg}>{errors.phone}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="reg-email">Email Address</label>
                  <input id="reg-email" type="email" className="input" placeholder="Optional"
                    value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Visit Details */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Visit Details</h3>
              <div className={styles.grid2}>
                <div>
                  <label className="label" htmlFor="reg-host">Who are you visiting? *</label>
                  <select id="reg-host" className={`input ${errors.host ? styles.err : ""}`}
                    value={form.host} onChange={(e) => set("host", e.target.value)}>
                    <option value="">Select person / department…</option>
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
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="reg-idnum">ID Number *</label>
                  <input id="reg-idnum" className={`input ${errors.idNumber ? styles.err : ""}`}
                    placeholder="Enter ID number" value={form.idNumber}
                    onChange={(e) => set("idNumber", e.target.value)} />
                  {errors.idNumber && <p className={styles.errMsg}>{errors.idNumber}</p>}
                </div>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button type="button" className="btn btn-secondary"
                onClick={() => setStep("info")}>← Back</button>
              <button type="submit" className="btn btn-primary"
                disabled={loading} style={{ padding: "12px 32px", fontSize: 15 }}>
                {loading ? (
                  <><Loader2 size={18} className={styles.spin} /> Registering…</>
                ) : (
                  <><UserPlus size={18} /> Complete Registration</>
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
          <div className={styles.successIcon}><Check size={36} /></div>
          <h2 className={styles.successTitle}>You're Registered!</h2>
          <p className={styles.successSub}>
            Your visit has been logged. Please proceed to{" "}
            <strong>{office.name}</strong> reception and show this confirmation.
          </p>

          <div className={styles.passIdBox}>
            <span className={styles.passIdLabel}>Your Pass ID</span>
            <span className={styles.passId}>#{passId.slice(-8).toUpperCase()}</span>
          </div>

          <div className={styles.officeDirections}>
            <Building2 size={15} />
            <span>{office.name} · {office.floor} · {office.address}</span>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ marginTop: 8 }}
          >
            <UserPlus size={16} />
            Get Directions to Office
          </a>
        </div>
      </div>
    </div>
  );
}
