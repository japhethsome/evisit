"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Building2,
  ShieldCheck,
  QrCode,
  Settings,
} from "lucide-react";
import { getOfficeSettings, type OfficeSettings } from "@/lib/office";
import styles from "./Sidebar.module.css";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/checkin", label: "Check In", icon: UserPlus },
  { href: "/visitors", label: "Visitors Log", icon: Users },
  { href: "/register", label: "Public Visitor Form", icon: QrCode },
  { href: "/admin", label: "Admin & Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [office, setOffice] = useState<OfficeSettings | null>(null);

  useEffect(() => {
    setOffice(getOfficeSettings());
  }, []);

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <span className={styles.logoText}>eVisitors</span>
          <span className={styles.logoSub}>{office?.name || "Rongo University"}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <p className={styles.navLabel}>Main Menu</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${active ? styles.active : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active && <span className={styles.activeDot} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className={styles.bottom}>
        <div className={styles.orgCard}>
          <Building2 size={16} className={styles.orgIcon} />
          <div>
            <p className={styles.orgName}>{office?.name || "Rongo University"}</p>
            <p className={styles.orgSub}>Reception: {office?.phone || "0708992882"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
