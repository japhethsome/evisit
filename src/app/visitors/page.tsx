"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, UserPlus, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import VisitorTable from "@/components/VisitorTable";
import { getVisitors, seedIfEmpty, type Visitor, type VisitorStatus } from "@/lib/visitors";
import styles from "./visitors.module.css";

const STATUS_FILTERS: { label: string; value: VisitorStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Checked In", value: "checked-in" },
  { label: "Checked Out", value: "checked-out" },
];

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VisitorStatus | "all">("all");

  const load = useCallback(() => {
    seedIfEmpty();
    setVisitors(getVisitors());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = visitors.filter((v) => {
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.host.toLowerCase().includes(q) ||
      v.purpose.toLowerCase().includes(q) ||
      (v.company ?? "").toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Visitors Log</h1>
            <p className={styles.subtitle}>
              {visitors.length} total visitors registered
            </p>
          </div>
          <Link href="/checkin" className="btn btn-primary">
            <UserPlus size={17} />
            Check In Visitor
          </Link>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              className={`input ${styles.searchInput}`}
              placeholder="Search by name, host, company, purpose…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className={styles.filterGroup}>
            <Filter size={15} style={{ color: "var(--color-text-muted)" }} />
            {STATUS_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                className={`${styles.filterBtn} ${statusFilter === value ? styles.active : ""}`}
                onClick={() => setStatusFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <VisitorTable visitors={filtered} onUpdate={load} />

        {filtered.length > 0 && (
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", textAlign: "right" }}>
            Showing {filtered.length} of {visitors.length} visitors
          </p>
        )}
      </main>
    </div>
  );
}
