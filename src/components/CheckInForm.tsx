"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Check, Loader2 } from "lucide-react";
import { addVisitor } from "@/lib/visitors";
import styles from "./CheckInForm.module.css";

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

const HOSTS = [
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
];

export default function CheckInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.host.trim()) errs.host = "Host / person to visit is required";
    if (!form.purpose.trim()) errs.purpose = "Purpose of visit is required";
    if (!form.idNumber.trim()) errs.idNumber = "ID number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate brief processing
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
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push(`/visitors/${visitor.id}`);
    }, 1000);
  }

  if (success) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>
          <Check size={32} />
        </div>
        <h3>Visitor Checked In!</h3>
        <p>Generating visitor pass…</p>
      </div>
    );
  }

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
            <label className="label" htmlFor="company">Company / Organization</label>
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
              placeholder="+254 700 000 000"
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
            <label className="label" htmlFor="host">Host / Person to Visit *</label>
            <select
              id="host"
              className={`input ${errors.host ? styles.inputError : ""}`}
              value={form.host}
              onChange={(e) => set("host", e.target.value)}
            >
              <option value="">Select host…</option>
              {HOSTS.map((h) => (
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
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className="label" htmlFor="idNumber">ID Number *</label>
            <input
              id="idNumber"
              className={`input ${errors.idNumber ? styles.inputError : ""}`}
              placeholder="Enter ID number"
              value={form.idNumber}
              onChange={(e) => set("idNumber", e.target.value)}
            />
            {errors.idNumber && <p className={styles.error}>{errors.idNumber}</p>}
          </div>
        </div>
      </div>

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
              Processing…
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
