"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, User, LogIn, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { login } from "@/lib/auth";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("rongo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      if (ok) {
        router.push("/admin");
      } else {
        setError("Invalid username or password. Try username: admin, password: rongo");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Image
            src="/logo.png"
            alt="eVisitors Logo"
            width={90}
            height={90}
            className={styles.logoImg}
            priority
          />
          <h1 className={styles.title}>Admin Portal</h1>
          <p className={styles.subTitle}>Rongo University eVisitors System</p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className="label" htmlFor="username">
              Username or Email
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="username"
                className="input"
                style={{ paddingLeft: 38 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
              <User
                size={16}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className="label" htmlFor="password">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type="password"
                className="input"
                style={{ paddingLeft: 38 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              />
            </div>
          </div>

          <div className={styles.hintBox}>
            <strong>Default Credentials:</strong>
            <div style={{ marginTop: 4, display: "flex", gap: 16 }}>
              <span>User: <code style={{ color: "var(--color-primary-hover)" }}>admin</code></span>
              <span>Pass: <code style={{ color: "var(--color-primary-hover)" }}>rongo</code></span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15 }}
          >
            {loading ? (
              <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Signing in…</>
            ) : (
              <><LogIn size={18} /> Sign In to Admin</>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <Link href="/" style={{ color: "var(--color-text-muted)", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
