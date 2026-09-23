"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Users, UserPlus, UserCheck, UserMinus, ArrowRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import VisitorTable from "@/components/VisitorTable";
import { getVisitors, seedIfEmpty, type Visitor } from "@/lib/visitors";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  const load = useCallback(() => {
    seedIfEmpty();
    setVisitors(getVisitors());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const today = new Date().toDateString();
  const todayVisitors = visitors.filter(
    (v) => new Date(v.checkInTime).toDateString() === today
  );
  const checkedIn = visitors.filter((v) => v.status === "checked-in");
  const checkedOut = todayVisitors.filter((v) => v.status === "checked-out");
  const recent = visitors.slice(0, 6);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Welcome back,{" "}
              <span className="gradient-text">Reception</span>
            </h1>
            <p className={styles.subtitle}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Link href="/checkin" className="btn btn-primary" style={{ fontSize: 14, padding: "11px 24px" }}>
            <UserPlus size={17} />
            New Check In
          </Link>
        </div>

        {/* Stats */}
        <div className={`${styles.statsGrid} stagger-children`}>
          <StatsCard
            label="Today's Visitors"
            value={todayVisitors.length}
            icon={Users}
            color="primary"
            trend="Total visitors today"
          />
          <StatsCard
            label="Currently Inside"
            value={checkedIn.length}
            icon={UserCheck}
            color="success"
            trend="Active right now"
          />
          <StatsCard
            label="Checked Out"
            value={checkedOut.length}
            icon={UserMinus}
            color="warning"
            trend="Left today"
          />
          <StatsCard
            label="Total Visitors"
            value={visitors.length}
            icon={Users}
            color="info"
            trend="All time"
          />
        </div>

        {/* Recent visitors */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Visitors</h2>
            <Link href="/visitors" className="btn btn-ghost" style={{ fontSize: 13 }}>
              View All
              <ArrowRight size={15} />
            </Link>
          </div>
          <VisitorTable
            visitors={recent}
            onUpdate={load}
            compact
          />
        </section>
      </main>
    </div>
  );
}
