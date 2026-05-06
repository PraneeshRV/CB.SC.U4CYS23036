"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Notif = {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
};

type ApiResponse = {
  notifications?: Notif[];
  updatedAt?: string;
};

export default function Home() {
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const getSafeTime = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString();
  };

  async function loadNotifications() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api", { cache: "no-store" });

      if (!response.ok) throw new Error("api failed");

      const data: ApiResponse = await response.json();
      setNotifications(data.notifications ?? []);
      setUpdatedAt(data.updatedAt ?? "");
    } catch {
      setNotifications([]);
      setError("Could not load notifications. Check TOKEN and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(loadNotifications, 15000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.box}>
        <h1>Stage 1</h1>
        <h2>Priority Inbox</h2>
        <p className={styles.smallText}>
          Top 10 notifications. Placement is first, then Result, then Event.
          Newer notifications inside the same type.
        </p>

        <div className={styles.statusRow}>
          <button type="button" onClick={loadNotifications}>
            Refresh
          </button>
          <span>{loading ? "Loading..." : `Showing ${notifications.length}`}</span>
        </div>

        {updatedAt && (
          <p className={styles.updated}>
            Last updated: {getSafeTime(updatedAt) || "--"}
          </p>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <ol className={styles.list}>
          {notifications.map((notification, index) => (
            <li className={styles.card} key={notification.ID}>
              <div className={styles.topLine}>
                <strong>#{index + 1}</strong>
                <span className={styles.badge}>{notification.Type}</span>
              </div>
              <p className={styles.message}>{notification.Message}</p>
              <p className={styles.date}>{getSafeTime(notification.Timestamp) || notification.Timestamp}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
