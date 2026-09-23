import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import CheckInForm from "@/components/CheckInForm";
import styles from "./checkin.module.css";

export const metadata: Metadata = {
  title: "Check In Visitor — eVisitors",
  description: "Register a new visitor and generate their visitor pass.",
};

export default function CheckInPage() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Check In Visitor</h1>
            <p className={styles.subtitle}>
              Fill in the visitor's details to register them and generate a pass.
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <CheckInForm />
        </div>
      </main>
    </div>
  );
}
