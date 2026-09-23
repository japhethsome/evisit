"use client";

import Link from "next/link";
import { LogOut, Eye, User, MapPin } from "lucide-react";
import type { Visitor } from "@/lib/visitors";
import { formatTime, formatDate, getDuration, checkOutVisitor } from "@/lib/visitors";
import StatusBadge from "./StatusBadge";
import styles from "./VisitorTable.module.css";

interface VisitorTableProps {
  visitors: Visitor[];
  onUpdate?: () => void;
  compact?: boolean;
}

export default function VisitorTable({
  visitors,
  onUpdate,
  compact = false,
}: VisitorTableProps) {
  function handleCheckOut(id: string) {
    checkOutVisitor(id);
    onUpdate?.();
  }

  if (visitors.length === 0) {
    return (
      <div className={styles.empty}>
        <User size={36} style={{ color: "var(--color-text-muted)", marginBottom: 12 }} />
        <p style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
          No visitors found
        </p>
        <p style={{ color: "var(--color-text-muted)", fontSize: 13, marginTop: 4 }}>
          Visitors will appear here once they check in.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Visitor</th>
            <th>Host</th>
            <th>Purpose</th>
            <th>Live Location</th>
            <th>Check In</th>
            {!compact && <th>Duration</th>}
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((v) => (
            <tr key={v.id} className={styles.row}>
              <td>
                <div className={styles.visitorInfo}>
                  <div className={styles.avatar}>
                    {v.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={styles.visitorName}>{v.name}</p>
                    {v.company && (
                      <p className={styles.visitorCompany}>{v.company}</p>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>
                  {v.host}
                </span>
              </td>
              <td>
                <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>
                  {v.purpose}
                </span>
              </td>
              <td>
                {v.location ? (
                  <Link
                    href={`/visitors/${v.id}#location`}
                    className={styles.locationBadge}
                    title={`GPS: ${v.location.lat.toFixed(4)}, ${v.location.lng.toFixed(4)}`}
                  >
                    <MapPin size={12} style={{ color: "#3b82f6" }} />
                    {v.location.distanceKm !== undefined
                      ? v.location.distanceKm <= 0.2
                        ? "On Campus"
                        : `${v.location.distanceKm} km away`
                      : "GPS Captured"}
                  </Link>
                ) : (
                  <span className={styles.noLocation}>—</span>
                )}
              </td>
              <td>
                <div>
                  <p style={{ fontSize: 13, color: "var(--color-text-primary)" }}>
                    {formatTime(v.checkInTime)}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                    {formatDate(v.checkInTime)}
                  </p>
                </div>
              </td>
              {!compact && (
                <td>
                  <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                    {getDuration(v.checkInTime, v.checkOutTime)}
                  </span>
                </td>
              )}
              <td>
                <StatusBadge status={v.status} />
              </td>
              <td>
                <div className={styles.actions}>
                  <Link href={`/visitors/${v.id}`} className="btn btn-ghost" style={{ padding: "6px 10px" }} title="View Visitor Pass & Map">
                    <Eye size={15} />
                  </Link>
                  {v.status === "checked-in" && (
                    <button
                      onClick={() => handleCheckOut(v.id)}
                      className="btn btn-danger"
                      title="Check Out"
                    >
                      <LogOut size={14} />
                      Check Out
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
