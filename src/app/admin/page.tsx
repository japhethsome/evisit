"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Save,
  Plus,
  X,
  Building2,
  QrCode,
  Users,
  Globe,
  MapPin,
  CheckCircle2,
  Lock,
  LogIn,
  Key,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import {
  getOfficeSettings,
  saveOfficeSettings,
  getRegisterUrl,
  type OfficeSettings,
} from "@/lib/office";
import { isAuthenticated, getAdminUser } from "@/lib/auth";
import styles from "./admin.module.css";

type Tab = "office" | "hosts" | "qr" | "security";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("office");
  const [office, setOffice] = useState<OfficeSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [newHost, setNewHost] = useState("");
  const [authed, setAuthed] = useState(true);

  useEffect(() => {
    setOffice(getOfficeSettings());
    setAuthed(isAuthenticated());
  }, []);

  function setField<K extends keyof OfficeSettings>(key: K, value: OfficeSettings[K]) {
    setOffice((o) => o ? { ...o, [key]: value } : o);
    setSaved(false);
  }

  function saveAll() {
    if (!office) return;
    saveOfficeSettings(office);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function addHost() {
    const h = newHost.trim();
    if (!h || !office) return;
    if (office.hosts.includes(h)) return;
    setField("hosts", [...office.hosts, h]);
    setNewHost("");
  }

  function removeHost(host: string) {
    if (!office) return;
    setField("hosts", office.hosts.filter((h) => h !== host));
  }

  function handleHostKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); addHost(); }
  }

  if (!authed) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className="glass-card" style={{ padding: 48, textAlign: "center", maxWidth: 480, margin: "60px auto" }}>
            <Lock size={48} style={{ color: "var(--color-primary-hover)", margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Admin Login Required</h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 24 }}>
              Please sign in with your administrator credentials to access and modify Rongo University office settings and host configurations.
            </p>
            <Link href="/login" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 12 }}>
              <LogIn size={16} /> Sign In to Admin Panel
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!office) return null;

  const registerUrl = getRegisterUrl(office.baseUrl);

  const tabs: { id: Tab; label: string; icon: typeof Settings }[] = [
    { id: "office", label: "Office & Location", icon: Building2 },
    { id: "hosts", label: "Staff & Departments", icon: Users },
    { id: "qr", label: "QR Code & Link", icon: QrCode },
    { id: "security", label: "Admin Credentials", icon: Key },
  ];

  const adminUser = getAdminUser();

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Admin Settings</h1>
            <p className={styles.subtitle}>
              Configure {office.name} office details, visitor locations, staff hosts, and digital pass QR codes.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={saveAll}
            id="save-settings-btn"
            style={{ padding: "11px 24px" }}
          >
            {saved ? (
              <><CheckCircle2 size={17} /> Saved Changes!</>
            ) : (
              <><Save size={17} /> Save Changes</>
            )}
          </button>
        </div>

        {/* Tab nav */}
        <div className={styles.tabNav}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`${styles.tabBtn} ${tab === id ? styles.tabActive : ""}`}
              onClick={() => setTab(id)}
              id={`tab-${id}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* ── OFFICE TAB ── */}
        {tab === "office" && (
          <div className={`glass-card ${styles.tabContent} animate-fade-in-up`}>
            <div className={styles.formGrid}>
              <div className={styles.fieldFull}>
                <label className="label" htmlFor="off-name">University / Office Name</label>
                <input id="off-name" className="input"
                  value={office.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="e.g. Rongo University" />
              </div>

              <div>
                <label className="label" htmlFor="off-address">Campus Address / Location</label>
                <input id="off-address" className="input"
                  value={office.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="e.g. Kitere Hill, Off Rongo-Homa Bay Road" />
              </div>

              <div>
                <label className="label" htmlFor="off-floor">Administration Block / Floor</label>
                <input id="off-floor" className="input"
                  value={office.floor}
                  onChange={(e) => setField("floor", e.target.value)}
                  placeholder="e.g. Administration Block - Ground Floor" />
              </div>

              <div>
                <label className="label" htmlFor="off-phone">Reception Hotline Phone</label>
                <input id="off-phone" className="input"
                  value={office.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="0708992882" />
              </div>

              <div>
                <label className="label" htmlFor="off-email">Official Email</label>
                <input id="off-email" type="email" className="input"
                  value={office.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="info@rongovarsity.ac.ke" />
              </div>

              <div className={styles.fieldFull}>
                <label className="label" htmlFor="off-hours">Visiting Hours</label>
                <input id="off-hours" className="input"
                  value={office.openHours}
                  onChange={(e) => setField("openHours", e.target.value)}
                  placeholder="Mon–Fri, 8:00 AM – 5:00 PM" />
              </div>

              {/* GPS Section */}
              <div className={styles.fieldFull}>
                <div className={styles.gpsHeader}>
                  <MapPin size={15} style={{ color: "var(--color-danger)" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
                    Rongo University Campus GPS Coordinates
                  </span>
                  <span style={{ fontSize: 12, color: "var(--color-text-muted)", marginLeft: "auto" }}>
                    Used for visitor proximity and live distance calculation
                  </span>
                </div>
              </div>

              <div>
                <label className="label" htmlFor="off-lat">Latitude</label>
                <input id="off-lat" className="input" type="number" step="any"
                  value={office.lat}
                  onChange={(e) => setField("lat", parseFloat(e.target.value) || 0)}
                  placeholder="-0.7675" />
              </div>

              <div>
                <label className="label" htmlFor="off-lng">Longitude</label>
                <input id="off-lng" className="input" type="number" step="any"
                  value={office.lng}
                  onChange={(e) => setField("lng", parseFloat(e.target.value) || 0)}
                  placeholder="34.6053" />
              </div>
            </div>
          </div>
        )}

        {/* ── HOSTS TAB ── */}
        {tab === "hosts" && (
          <div className={`glass-card ${styles.tabContent} animate-fade-in-up`}>
            <p className={styles.sectionDesc}>
              Manage university offices, faculties, and staff that visitors can select during registration.
            </p>

            {/* Add new host */}
            <div className={styles.addHostRow}>
              <input
                className="input"
                style={{ flex: 1 }}
                placeholder="Add an office, dean, or department (e.g. Dean of Students, Admissions)…"
                value={newHost}
                onChange={(e) => setNewHost(e.target.value)}
                onKeyDown={handleHostKeyDown}
                id="add-host-input"
              />
              <button className="btn btn-primary" onClick={addHost} id="add-host-btn">
                <Plus size={16} /> Add Host
              </button>
            </div>

            {/* Hosts list */}
            <div className={styles.hostsList}>
              {office.hosts.length === 0 ? (
                <p style={{ color: "var(--color-text-muted)", fontSize: 13, textAlign: "center", padding: "24px" }}>
                  No hosts added yet. Add your first host above.
                </p>
              ) : (
                office.hosts.map((host) => (
                  <div key={host} className={styles.hostItem}>
                    <div className={styles.hostAvatar}>{host.charAt(0).toUpperCase()}</div>
                    <span className={styles.hostName}>{host}</span>
                    <button
                      className="btn btn-ghost"
                      style={{ marginLeft: "auto", padding: "4px 8px" }}
                      onClick={() => removeHost(host)}
                      aria-label={`Remove ${host}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <p className={styles.hostsCount}>{office.hosts.length} host(s) configured</p>
          </div>
        )}

        {/* ── QR TAB ── */}
        {tab === "qr" && (
          <div className={`glass-card ${styles.tabContent} animate-fade-in-up`}>
            <div className={styles.qrLayout}>
              <div className={styles.qrLeft}>
                <h3 className={styles.qrTitle}>Visitor Pre-Registration QR Code</h3>
                <p className={styles.qrDesc}>
                  Place this QR code at the Rongo University main gate, security checkpoint, and website.
                  Visitors scan it with their phone camera to pre-register and submit their live location.
                </p>

                <div className={styles.baseUrlSection}>
                  <label className="label" htmlFor="base-url">
                    <Globe size={13} style={{ display: "inline", marginRight: 5 }} />
                    Live Domain Base URL
                  </label>
                  <input
                    id="base-url"
                    className="input"
                    value={office.baseUrl}
                    onChange={(e) => setField("baseUrl", e.target.value)}
                    placeholder="https://evisit.vercel.app"
                  />
                  <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 6 }}>
                    QR links to: <code style={{ color: "var(--color-primary-hover)" }}>{registerUrl}</code>
                  </p>
                </div>

                <div className={styles.instructions}>
                  <h4 className={styles.instrTitle}>Visitor Process</h4>
                  <ol className={styles.instrList}>
                    <li>Visitor scans the QR code on campus or from email</li>
                    <li>Visitor reviews Rongo University reception details & location consent</li>
                    <li>Visitor grants location consent to verify GPS arrival</li>
                    <li>Reception immediately sees them in the live Visitors Log</li>
                  </ol>
                </div>
              </div>

              <div className={styles.qrRight}>
                <QRCodeDisplay url={registerUrl} size={220} />
              </div>
            </div>
          </div>
        )}

        {/* ── SECURITY TAB ── */}
        {tab === "security" && (
          <div className={`glass-card ${styles.tabContent} animate-fade-in-up`}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Admin Account Details</h3>
            <p className={styles.sectionDesc}>
              Current credentials for accessing the administrative dashboard and reception controls.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
              <div className={styles.field}>
                <label className="label">Admin Username</label>
                <input className="input" value={adminUser.username} disabled />
              </div>
              <div className={styles.field}>
                <label className="label">Admin Email</label>
                <input className="input" value={adminUser.email} disabled />
              </div>
              <div className={styles.field}>
                <label className="label">Current Password</label>
                <input className="input" type="password" value="••••••••" disabled />
              </div>
              <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                Default login: Username: <code>admin</code> | Password: <code>rongo</code>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
