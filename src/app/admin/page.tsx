"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import {
  getOfficeSettings,
  saveOfficeSettings,
  getRegisterUrl,
  type OfficeSettings,
} from "@/lib/office";
import styles from "./admin.module.css";

type Tab = "office" | "hosts" | "qr";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("office");
  const [office, setOffice] = useState<OfficeSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [newHost, setNewHost] = useState("");

  useEffect(() => {
    setOffice(getOfficeSettings());
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

  if (!office) return null;

  const registerUrl = getRegisterUrl(office.baseUrl);

  const tabs: { id: Tab; label: string; icon: typeof Settings }[] = [
    { id: "office", label: "Office Details", icon: Building2 },
    { id: "hosts", label: "Hosts & Staff", icon: Users },
    { id: "qr", label: "QR Code & Link", icon: QrCode },
  ];

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Admin Settings</h1>
            <p className={styles.subtitle}>
              Configure your office details, manage staff, and generate visitor QR codes.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={saveAll}
            id="save-settings-btn"
            style={{ padding: "11px 24px" }}
          >
            {saved ? (
              <><CheckCircle2 size={17} /> Saved!</>
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
                <label className="label" htmlFor="off-name">Office / Company Name</label>
                <input id="off-name" className="input"
                  value={office.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="e.g. Acme Corp HQ" />
              </div>

              <div>
                <label className="label" htmlFor="off-address">Street Address</label>
                <input id="off-address" className="input"
                  value={office.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="e.g. 123 Ngong Road, Nairobi" />
              </div>

              <div>
                <label className="label" htmlFor="off-floor">Floor / Suite</label>
                <input id="off-floor" className="input"
                  value={office.floor}
                  onChange={(e) => setField("floor", e.target.value)}
                  placeholder="e.g. 5th Floor, Suite 502" />
              </div>

              <div>
                <label className="label" htmlFor="off-phone">Reception Phone</label>
                <input id="off-phone" className="input"
                  value={office.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+254 700 000 000" />
              </div>

              <div>
                <label className="label" htmlFor="off-email">Reception Email</label>
                <input id="off-email" type="email" className="input"
                  value={office.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="reception@company.com" />
              </div>

              <div className={styles.fieldFull}>
                <label className="label" htmlFor="off-hours">Opening Hours</label>
                <input id="off-hours" className="input"
                  value={office.openHours}
                  onChange={(e) => setField("openHours", e.target.value)}
                  placeholder="Mon–Fri, 8:00 AM – 6:00 PM" />
              </div>

              {/* GPS Section */}
              <div className={styles.fieldFull}>
                <div className={styles.gpsHeader}>
                  <MapPin size={15} style={{ color: "var(--color-danger)" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
                    Office GPS Coordinates
                  </span>
                  <span style={{ fontSize: 12, color: "var(--color-text-muted)", marginLeft: "auto" }}>
                    Used to show office on map for visitors
                  </span>
                </div>
              </div>

              <div>
                <label className="label" htmlFor="off-lat">Latitude</label>
                <input id="off-lat" className="input" type="number" step="any"
                  value={office.lat}
                  onChange={(e) => setField("lat", parseFloat(e.target.value) || 0)}
                  placeholder="-1.2921" />
              </div>

              <div>
                <label className="label" htmlFor="off-lng">Longitude</label>
                <input id="off-lng" className="input" type="number" step="any"
                  value={office.lng}
                  onChange={(e) => setField("lng", parseFloat(e.target.value) || 0)}
                  placeholder="36.8219" />
              </div>

              <div className={styles.fieldFull}>
                <p className={styles.gpsHint}>
                  💡 To find your GPS coordinates: open{" "}
                  <a href="https://www.google.com/maps" target="_blank" rel="noreferrer"
                    style={{ color: "var(--color-primary-hover)" }}>
                    Google Maps
                  </a>
                  , right-click your office location → "What's here?" to get lat/lng.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── HOSTS TAB ── */}
        {tab === "hosts" && (
          <div className={`glass-card ${styles.tabContent} animate-fade-in-up`}>
            <p className={styles.sectionDesc}>
              Manage the list of people and departments that visitors can select when registering.
            </p>

            {/* Add new host */}
            <div className={styles.addHostRow}>
              <input
                className="input"
                style={{ flex: 1 }}
                placeholder="Add a person or department (e.g. Jane Doe, Finance Team)…"
                value={newHost}
                onChange={(e) => setNewHost(e.target.value)}
                onKeyDown={handleHostKeyDown}
                id="add-host-input"
              />
              <button className="btn btn-primary" onClick={addHost} id="add-host-btn">
                <Plus size={16} /> Add
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
                <h3 className={styles.qrTitle}>Visitor Registration QR Code</h3>
                <p className={styles.qrDesc}>
                  Share this QR code or link with visitors so they can pre-register before arriving.
                  When scanned, it opens the visitor registration form with your office details and map.
                </p>

                <div className={styles.baseUrlSection}>
                  <label className="label" htmlFor="base-url">
                    <Globe size={13} style={{ display: "inline", marginRight: 5 }} />
                    Base URL (update for production)
                  </label>
                  <input
                    id="base-url"
                    className="input"
                    value={office.baseUrl}
                    onChange={(e) => setField("baseUrl", e.target.value)}
                    placeholder="https://evisitors.yourcompany.com"
                  />
                  <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 6 }}>
                    QR will point to: <code style={{ color: "var(--color-primary-hover)" }}>{registerUrl}</code>
                  </p>
                </div>

                <div className={styles.instructions}>
                  <h4 className={styles.instrTitle}>How to use</h4>
                  <ol className={styles.instrList}>
                    <li>Print or display the QR code at your entrance or send via email/WhatsApp</li>
                    <li>Visitor scans the QR code with their phone</li>
                    <li>They see your office info, location map, and directions</li>
                    <li>They fill in their details before arriving</li>
                    <li>Reception sees them immediately in the Dashboard</li>
                  </ol>
                </div>
              </div>

              <div className={styles.qrRight}>
                <QRCodeDisplay url={registerUrl} size={220} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
