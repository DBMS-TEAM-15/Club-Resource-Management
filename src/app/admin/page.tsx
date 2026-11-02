"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/useAuth";

export default function AdminAnalyticsPage() {
  const { user, loading, isAuthorized, logout } = useAuth(["admin"]);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (user && isAuthorized) {
      fetch("/api/analytics")
        .then((res) => res.json())
        .then(setData);
    }
  }, [user, isAuthorized]);

  if (loading || !user) return null;

  if (!isAuthorized) {
    return (
      <div>
        <Navbar user={user} onLogout={logout} />
        <main className="container">
          <div className="card" style={{ padding: "2.5rem", textAlign: "center" }}>
            <span className="badge badge-red">RBAC Access Restricted</span>
            <h2 style={{ marginTop: "0.75rem" }}>Administrator Role Required</h2>
            <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
              You are currently signed in as <strong>{user.name}</strong> (Role: <code>{user.role}</code>). Only users registered in the MySQL <code>ADMIN</code> subtype table can view the Administrative Utilization &amp; Analytics Dashboard.
            </p>
            <button onClick={logout} className="btn btn-primary" style={{ marginTop: "1.25rem" }}>
              Switch to Admin Account
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={logout} />
      <main className="container">
        <div className="page-hero">
          <div>
            <h1>Administrative Utilization &amp; Analytics Dashboard</h1>
            <p>Complex MySQL Queries (`JOIN`, `GROUP BY`, `HAVING`, Views) + MongoDB Aggregation Pipelines</p>
          </div>
          <span className="badge badge-amber">{user.admin_level || "Super Admin"}</span>
        </div>

        {!data ? (
          <div className="card">Loading analytical insights...</div>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              {data.clubUtilization?.map((c: any) => (
                <div key={c.club_id} className="card">
                  <span className="badge badge-indigo">{c.club_category}</span>
                  <h3 style={{ marginTop: "0.5rem" }}>{c.club_name}</h3>
                  <div style={{ marginTop: "0.75rem", fontSize: "0.88rem", color: "#475569", display: "grid", gap: "0.25rem" }}>
                    <div>Resources Owned: <strong>{c.total_resources_owned}</strong></div>
                    <div>Requests Made: <strong>{c.total_requests_made}</strong></div>
                    <div>Approved Requests: <strong>{c.approved_requests_count}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="card">
                <h3 style={{ marginBottom: "0.85rem" }}>Frequently Requested Resources (`GROUP BY` + `HAVING`)</h3>
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {data.frequentlyRequested?.map((item: any) => (
                    <div key={item.resource_id} style={{ display: "flex", justifyContent: "space-between", padding: "0.7rem", background: "#f8fafc", borderRadius: 8 }}>
                      <div>
                        <strong>{item.resource_name}</strong>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.owner_club} • {item.category_name}</div>
                      </div>
                      <span className="badge badge-green">{item.request_count} reqs ({item.total_units_requested} units)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: "0.85rem" }}>Inter-Club Borrowing Patterns</h3>
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {data.borrowingPatterns?.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.7rem", background: "#f8fafc", borderRadius: 8 }}>
                      <div>
                        <strong>{item.borrowing_club}</strong> &rarr; <strong>{item.lending_club}</strong>
                      </div>
                      <span className="badge badge-indigo">{item.approved_exchanges} / {item.total_exchanges} approved</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="card">
                <h3 style={{ marginBottom: "0.85rem" }}>Underutilized Assets View (`vw_underutilized_assets`)</h3>
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {data.underutilized?.map((item: any) => (
                    <div key={item.resource_id} style={{ display: "flex", justifyContent: "space-between", padding: "0.7rem", background: "#f8fafc", borderRadius: 8 }}>
                      <div>
                        <strong>{item.resource_name}</strong>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.owner_club} • {item.category_name}</div>
                      </div>
                      <span className="badge badge-amber">{item.lifetime_request_count} lifetime requests</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: "0.85rem" }}>MongoDB Maintenance Aggregation (`$group` by Issue Type)</h3>
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {data.maintenanceSummary?.map((m: any) => (
                    <div key={m._id} style={{ display: "flex", justifyContent: "space-between", padding: "0.7rem", background: "#f8fafc", borderRadius: 8 }}>
                      <div>
                        <strong>{m._id}</strong>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Events logged: {m.count}</div>
                      </div>
                      <span className="badge badge-slate">Rs. {m.total_cost} total cost</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
