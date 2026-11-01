"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Administrative Utilization & Analytics Dashboard</h1>
        {!data ? (
          <p style={{ marginTop: "1rem" }}>Loading analytics...</p>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem" }}>
            <section style={{ background: "#fff", padding: "1.25rem", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <h2>Frequently Requested Resources</h2>
              <ul>
                {data.frequentlyRequested?.map((item: any) => (
                  <li key={item.resource_id} style={{ marginTop: "0.5rem" }}>
                    <strong>{item.resource_name}</strong> ({item.owner_club}) — {item.request_count} requests ({item.total_units_requested} units)
                  </li>
                ))}
              </ul>
            </section>

            <section style={{ background: "#fff", padding: "1.25rem", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <h2>Inter-Club Borrowing Patterns</h2>
              <ul>
                {data.borrowingPatterns?.map((item: any, idx: number) => (
                  <li key={idx} style={{ marginTop: "0.5rem" }}>
                    <strong>{item.borrowing_club}</strong> borrowed from <strong>{item.lending_club}</strong>: {item.total_exchanges} requests ({item.approved_exchanges} approved)
                  </li>
                ))}
              </ul>
            </section>

            <section style={{ background: "#fff", padding: "1.25rem", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <h2>Underutilized Assets</h2>
              <ul>
                {data.underutilized?.map((item: any) => (
                  <li key={item.resource_id} style={{ marginTop: "0.5rem" }}>
                    <strong>{item.resource_name}</strong> ({item.owner_club}) — {item.lifetime_request_count} lifetime requests
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}