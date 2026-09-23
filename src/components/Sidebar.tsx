"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Building2,
  QrCode,
  Settings,
  LogIn,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { getOfficeSettings, type OfficeSettings } from "@/lib/office";
import { isAuthenticated, logout } from "@/lib/auth";
import styles from "./Sidebar.module.css";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/checkin", label: "Check In", icon: UserPlus },
  { href: "/visitors", label: "Visitors Log", icon: Users },
  { href: "/register", label: "Visitor Form (QR)", icon: QrCode },
  { href: "/admin", label: "Admin Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [office, setOffice] = useState<OfficeSettings | null>(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setOffice(getOfficeSettings());
    setAuthed(isAuthenticated());
  }, [pathname]);

  function handleLogout() {
    logout();
    setAuthed(false);
    router.push("/login");
  }

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
          <Image
            src="/logo.png"
            alt="eVisitors Logo"
            width={44}
            height={44}
            style={{ objectFit: "contain", borderRadius: 8 }}
            priority
          />
        </div>
        <div style={{ overflow: "hidden" }}>
          <span className={styles.logoText}>eVisitors</span>
          <span className={styles.logoSub} style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", display: "block" }}>
            {office?.name || "Rongo University"}
          </span>
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

      {/* Bottom info & Auth */}
      <div className={styles.bottom}>
        <div className={styles.orgCard}>
          <Building2 size={16} className={styles.orgIcon} />
          <div>
            <p className={styles.orgName}>{office?.name || "Rongo University"}</p>
            <p className={styles.orgSub}>Hotline: {office?.phone || "0708992882"}</p>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          {authed ? (
            <button
              onClick={handleLogout}
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "flex-start", fontSize: 13, padding: "8px 12px", color: "#f87171" }}
            >
              <LogOut size={15} />
              <span>Sign Out (Admin)</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "flex-start", fontSize: 13, padding: "8px 12px" }}
            >
              <LogIn size={15} />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
