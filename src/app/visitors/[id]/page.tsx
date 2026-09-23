"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  Clock,
  LogOut,
  IdCard,
  Briefcase,
  CheckCircle2,
  Timer,
  Printer,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import StatusBadge from "@/components/StatusBadge";
import {
  getVisitorById,
  checkOutVisitor,
  formatDateTime,
  formatTime,
  getDuration,
  type Visitor,
} from "@/lib/visitors";
import styles from "./pass.module.css";

const ID_LABELS: Record<string, string> = {
  "national-id": "National ID",
  passport: "Passport",
  "drivers-license": "Driver's License",
  other: "Other ID",
};

export default function VisitorPassPage({ params }: PageProps<"/visitors/[id]">) {
  const router = useRouter();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      const v = getVisitorById(id);
      setVisitor(v ?? null);
      setLoading(false);
    });
  }, [params]);

  function handleCheckOut() {
    if (!visitor) return;
    const updated = checkOutVisitor(visitor.id);
    if (updated) setVisitor(updated);
  }

  if (loading) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.loading}>Loading visitor pass…</div>
        </main>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.notFound}>
            <User size={48} style={{ color: "var(--color-text-muted)", marginBottom: 16 }} />
            <h2>Visitor Not Found</h2>
            <p>This visitor record doesn't exist or was deleted.</p>
            <Link href="/visitors" className="btn btn-primary" style={{ marginTop: 20 }}>
              <ArrowLeft size={16} /> Back to Visitors
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const initials = visitor.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        {/* Back nav */}
        <div className={styles.backNav}>
          <Link href="/visitors" className="btn btn-ghost" style={{ padding: "8px 12px" }}>
            <ArrowLeft size={16} />
            Back to Visitors
          </Link>
          <div style={{ display: "flex", gap: 8 }}>
            {visitor.status === "checked-in" && (
              <button onClick={handleCheckOut} className="btn btn-danger">
                <LogOut size={15} />
                Check Out
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
            >
              <Printer size={15} />
              Print Pass
            </button>
          </div>
        </div>

        <div className={styles.passLayout}>
          {/* Visitor Pass Card */}
          <div className={`${styles.passCard} glow-border animate-fade-in-up`}>
            {/* Card header gradient */}
            <div className={styles.passHeader}>
              <div className={styles.passHeaderInner}>
                <div className={styles.passLogo}>
                  <span>eVisitors</span>
                </div>
                <StatusBadge status={visitor.status} />
              </div>
              <div className={styles.avatarWrap}>
                <div className={styles.avatar}>{initials}</div>
              </div>
            </div>

            {/* Card body */}
            <div className={styles.passBody}>
              <div className={styles.passMeta}>
                <h2 className={styles.passName}>{visitor.name}</h2>
                {visitor.company && (
                  <p className={styles.passCompany}>{visitor.company}</p>
                )}
              </div>

              <div className={styles.passDetails}>
                <div className={styles.detailRow}>
                  <Briefcase size={15} className={styles.detailIcon} />
                  <div>
                    <span className={styles.detailLabel}>Purpose</span>
                    <span className={styles.detailValue}>{visitor.purpose}</span>
                  </div>
                </div>
                <div className={styles.detailRow}>
                  <User size={15} className={styles.detailIcon} />
                  <div>
                    <span className={styles.detailLabel}>Host</span>
                    <span className={styles.detailValue}>{visitor.host}</span>
                  </div>
                </div>
                <div className={styles.detailRow}>
                  <Clock size={15} className={styles.detailIcon} />
                  <div>
                    <span className={styles.detailLabel}>Check In</span>
                    <span className={styles.detailValue}>
                      {formatDateTime(visitor.checkInTime)}
                    </span>
                  </div>
                </div>
                {visitor.checkOutTime && (
                  <div className={styles.detailRow}>
                    <CheckCircle2 size={15} className={styles.detailIcon} />
                    <div>
                      <span className={styles.detailLabel}>Check Out</span>
                      <span className={styles.detailValue}>
                        {formatDateTime(visitor.checkOutTime)}
                      </span>
                    </div>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <Timer size={15} className={styles.detailIcon} />
                  <div>
                    <span className={styles.detailLabel}>Duration</span>
                    <span className={styles.detailValue}>
                      {getDuration(visitor.checkInTime, visitor.checkOutTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR placeholder */}
              <div className={styles.qrWrap}>
                <div className={styles.qrBox}>
                  <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
                    {/* Simplified QR pattern */}
                    <rect x="0" y="0" width="32" height="32" rx="4" fill="currentColor" opacity="0.15"/>
                    <rect x="4" y="4" width="24" height="24" rx="2" fill="currentColor" opacity="0.3"/>
                    <rect x="10" y="10" width="12" height="12" rx="1" fill="currentColor"/>
                    <rect x="48" y="0" width="32" height="32" rx="4" fill="currentColor" opacity="0.15"/>
                    <rect x="52" y="4" width="24" height="24" rx="2" fill="currentColor" opacity="0.3"/>
                    <rect x="58" y="10" width="12" height="12" rx="1" fill="currentColor"/>
                    <rect x="0" y="48" width="32" height="32" rx="4" fill="currentColor" opacity="0.15"/>
                    <rect x="4" y="52" width="24" height="24" rx="2" fill="currentColor" opacity="0.3"/>
                    <rect x="10" y="58" width="12" height="12" rx="1" fill="currentColor"/>
                    <rect x="36" y="36" width="8" height="8" rx="1" fill="currentColor" opacity="0.6"/>
                    <rect x="48" y="36" width="8" height="8" rx="1" fill="currentColor" opacity="0.6"/>
                    <rect x="60" y="36" width="8" height="8" rx="1" fill="currentColor"/>
                    <rect x="36" y="48" width="8" height="8" rx="1" fill="currentColor"/>
                    <rect x="48" y="48" width="8" height="8" rx="1" fill="currentColor" opacity="0.4"/>
                    <rect x="60" y="48" width="8" height="8" rx="1" fill="currentColor" opacity="0.6"/>
                    <rect x="36" y="60" width="8" height="8" rx="1" fill="currentColor" opacity="0.6"/>
                    <rect x="48" y="60" width="8" height="8" rx="1" fill="currentColor"/>
                    <rect x="60" y="60" width="8" height="8" rx="1" fill="currentColor" opacity="0.4"/>
                  </svg>
                </div>
                <p className={styles.visitorId}># {visitor.id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Side details panel */}
          <div className={styles.detailsPanel}>
            <div className={`glass-card ${styles.detailGroup} animate-fade-in-up`} style={{ animationDelay: "80ms" }}>
              <h3 className={styles.panelTitle}>Contact Information</h3>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Phone size={15} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>Phone</span>
                    <span className={styles.infoValue}>{visitor.phone || "—"}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Mail size={15} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{visitor.email || "—"}</span>
                  </div>
                </div>
                {visitor.company && (
                  <div className={styles.infoItem}>
                    <Building2 size={15} className={styles.infoIcon} />
                    <div>
                      <span className={styles.infoLabel}>Company</span>
                      <span className={styles.infoValue}>{visitor.company}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`glass-card ${styles.detailGroup} animate-fade-in-up`} style={{ animationDelay: "140ms" }}>
              <h3 className={styles.panelTitle}>Identification</h3>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <IdCard size={15} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>ID Type</span>
                    <span className={styles.infoValue}>{ID_LABELS[visitor.idType] ?? visitor.idType}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <IdCard size={15} className={styles.infoIcon} style={{ opacity: 0 }} />
                  <div>
                    <span className={styles.infoLabel}>ID Number</span>
                    <span className={styles.infoValue} style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}>
                      {visitor.idNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`glass-card ${styles.detailGroup} animate-fade-in-up`} style={{ animationDelay: "200ms" }}>
              <h3 className={styles.panelTitle}>Visit Timeline</h3>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <div
                    className={styles.timelineDot}
                    style={{ background: "var(--color-success)" }}
                  />
                  <div>
                    <span className={styles.infoLabel}>Checked In</span>
                    <span className={styles.infoValue}>{formatDateTime(visitor.checkInTime)}</span>
                  </div>
                </div>
                {visitor.checkOutTime ? (
                  <div className={styles.timelineItem}>
                    <div
                      className={styles.timelineDot}
                      style={{ background: "var(--color-text-muted)" }}
                    />
                    <div>
                      <span className={styles.infoLabel}>Checked Out</span>
                      <span className={styles.infoValue}>{formatDateTime(visitor.checkOutTime)}</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.timelineItem}>
                    <div
                      className={styles.timelineDot}
                      style={{
                        background: "var(--color-primary)",
                        animation: "pulse-glow 2s ease infinite",
                      }}
                    />
                    <div>
                      <span className={styles.infoLabel}>Currently Inside</span>
                      <span className={styles.infoValue} style={{ color: "var(--color-primary-hover)" }}>
                        {getDuration(visitor.checkInTime)} elapsed
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
