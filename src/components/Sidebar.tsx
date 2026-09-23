"use client";

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
import styles from "./Sidebar.module.css";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/checkin", label: "Check In", icon: UserPlus },
  { href: "/visitors", label: "Visitors Log", icon: Users },
  { href: "/register", label: "Visitor Form", icon: QrCode },
  { href: "/admin", label: "Admin Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <span className={styles.logoText}>eVisitors</span>
          <span className={styles.logoSub}>Management System</span>
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
            <p className={styles.orgName}>Main Office</p>
            <p className={styles.orgSub}>Reception Desk</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
